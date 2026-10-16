// File: scripts/capture-sites.mjs
//
// Records smooth scroll-through videos and screenshots of sites I built,
// for the portfolio and for sharing (LinkedIn, Instagram, proposals).
//
//   npm run capture                 → every site below
//   npm run capture -- voltaaflora  → just one
//
// How: instead of screen-recording in real time (which drops frames), the page is
// scrolled one frame at a time and each frame is screenshotted, then ffmpeg joins
// them at 30fps. The page's own CSS/JS animations are slowed down through the
// DevTools protocol to match, so they play at their real speed in the video.
//
// Needs: Google Chrome and ffmpeg (brew install ffmpeg).

import { chromium, devices } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// `variants` record the same site more than once with different localStorage
// (e.g. its own light/dark theme switch). Files get the variant name as a suffix.
const SITES = [
  { id: "voltaaflora", url: "https://www.voltaaflora.com/" },
  {
    id: "ipuy",
    url: "https://ipuy.org.uy/",
    variants: [
      { name: "light", storage: { theme: "light" } },
      { name: "dark", storage: { theme: "dark" } },
    ],
  },
];

// Raw outputs live outside public/ (not deployed); copy what the site uses into public/projects
const OUT_DIR = path.resolve("marketing/captures");
const FPS = 30;

const PROFILES = {
  desktop: {
    context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 / 3 },
    crf: 25,
  },
  mobile: {
    context: { ...devices["iPhone 14"], deviceScaleFactor: 2 },
    crf: 26,
  },
};

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Scroll plan: hold at the top, then glide down one "screen" at a time with short pauses. */
function buildTimeline(pageHeight, viewportHeight) {
  const frames = [];
  const hold = (y, seconds) => {
    for (let i = 0; i < Math.round(seconds * FPS); i++) frames.push(y);
  };
  const glide = (from, to, seconds) => {
    const n = Math.round(seconds * FPS);
    for (let i = 1; i <= n; i++) frames.push(from + (to - from) * easeInOut(i / n));
  };

  const max = Math.max(0, pageHeight - viewportHeight);
  const step = viewportHeight * 0.85;
  let y = 0;
  hold(0, 1.6);
  while (y < max) {
    const next = Math.min(max, y + step);
    glide(y, next, 1.15);
    hold(next, 0.45);
    y = next;
  }
  hold(max, 1.2);
  return frames;
}

async function preparePage(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  // Visit the whole page once so lazy images and embeds load before recording
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(120);
  }
  await page.waitForLoadState("networkidle", { timeout: 20_000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important} ::-webkit-scrollbar{display:none}" });
  await page.waitForTimeout(800);
}

async function newContext(browser, options, variant) {
  const context = await browser.newContext({ ...options, locale: "pt-BR" });
  if (variant?.storage) {
    await context.addInitScript((entries) => {
      for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
    }, variant.storage);
  }
  return context;
}

const fileBase = (site, variant) => (variant ? `${site.id}-${variant.name}` : site.id);

async function recordVideo(browser, site, variant, profileName) {
  const profile = PROFILES[profileName];
  const context = await newContext(browser, profile.context, variant);
  const page = await context.newPage();
  await preparePage(page, site.url);

  const cdp = await context.newCDPSession(page);
  await cdp.send("Animation.enable");

  const { pageHeight, viewportHeight } = await page.evaluate(() => ({
    pageHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
  }));
  const timeline = buildTimeline(pageHeight, viewportHeight);

  const framesDir = mkdtempSync(path.join(tmpdir(), `capture-${site.id}-${profileName}-`));
  const started = Date.now();
  let rate = 1;

  for (let i = 0; i < timeline.length; i++) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(timeline[i]));
    await page.screenshot({
      path: path.join(framesDir, `${String(i).padStart(5, "0")}.jpg`),
      type: "jpeg",
      quality: 92,
    });

    // After a few frames we know how long one frame really takes:
    // slow the page's animations by the same factor
    if (i === 8) {
      const realMsPerFrame = (Date.now() - started) / 9;
      rate = Math.min(1, 1000 / FPS / realMsPerFrame);
      await cdp.send("Animation.setPlaybackRate", { playbackRate: rate });
    }
    if (i % 60 === 0) process.stdout.write(`  ${profileName}: frame ${i}/${timeline.length}\r`);
  }
  process.stdout.write("\n");

  const base = path.join(OUT_DIR, `${fileBase(site, variant)}-${profileName}`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS),
    "-i", path.join(framesDir, "%05d.jpg"),
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(profile.crf),
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${base}.mp4`,
  ]);
  // Poster = the first frame
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-i", path.join(framesDir, "00000.jpg"),
    "-vf", profileName === "desktop" ? "scale=1200:-2" : "scale=-2:1100",
    "-q:v", "4",
    `${base}.jpg`,
  ]);

  rmSync(framesDir, { recursive: true, force: true });
  await context.close();
  console.log(`  ✓ ${path.relative(process.cwd(), base)}.mp4 (${timeline.length} frames, animations at ${rate.toFixed(2)}x)`);
}

async function fullPage(browser, site, variant) {
  const context = await newContext(browser, { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }, variant);
  const page = await context.newPage();
  await preparePage(page, site.url);
  const png = path.join(tmpdir(), `${fileBase(site, variant)}-page.png`);
  await page.screenshot({ path: png, fullPage: true });
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", png,
    "-vf", "scale=1200:-2", "-q:v", "4",
    path.join(OUT_DIR, `${fileBase(site, variant)}-page.jpg`),
  ]);
  rmSync(png, { force: true });
  await context.close();
  console.log(`  ✓ full-page screenshot`);
}

const only = process.argv.slice(2);
const sites = only.length ? SITES.filter((s) => only.includes(s.id)) : SITES;
mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
try {
  for (const site of sites) {
    for (const variant of site.variants ?? [undefined]) {
      console.log(`\n${fileBase(site, variant)} → ${site.url}`);
      await fullPage(browser, site, variant);
      await recordVideo(browser, site, variant, "desktop");
      await recordVideo(browser, site, variant, "mobile");
    }
  }
} finally {
  await browser.close();
}
