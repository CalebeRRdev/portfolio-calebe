// File: scripts/record-portfolio.mjs
//
// Records a promo video of this portfolio (for LinkedIn and the like): a scripted
// visit that starts in the light theme, flips to dark halfway down the page with
// the contour reveal, and shows the site's animations along the way.
//
//   npm run dev                          (in another terminal)
//   npm run promo                        → desktop + mobile, Portuguese
//   npm run promo -- desktop --locale en → just one device / another language
//   npm run promo -- compose             → redo only the framed 9:16 phone version
//
// Unlike capture-sites.mjs, the page's clock is frozen (scripts/lib/virtual-time.mjs)
// and moved forward exactly one video frame between screenshots, so GSAP, Motion,
// Lenis, the canvas and the view transition all play at their real speed.
//
// Output: marketing/promo/ (gitignored). Needs Google Chrome and ffmpeg.
//   calebe-dev-desktop-pt.mp4       1920×1080
//   calebe-dev-mobile-pt.mp4        the phone screen alone, 780×1688
//   calebe-dev-mobile-pt-9x16.mp4   the phone in a frame on a 1080×1920 canvas

import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { installPointer, installVirtualTime } from "./lib/virtual-time.mjs";
import { composePhone } from "./lib/compose-phone.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};
const LOCALE = flag("locale", "pt");
const BASE_URL = flag("url", "http://localhost:3000");
const only = args.filter((a, i) => !a.startsWith("--") && !args[i - 1]?.startsWith("--"));

const OUT_DIR = path.resolve("marketing/promo");
const FPS = 30;
const DT = 1000 / FPS;

const PROFILES = {
  // 1440×810 CSS px at 4/3 → a 1920×1080 video
  desktop: { context: { viewport: { width: 1440, height: 810 }, deviceScaleFactor: 4 / 3 }, crf: 20 },
  // iPhone 14 screen without browser chrome, 780×1688 video
  mobile: {
    context: {
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
    },
    crf: 20,
  },
};

const ease = {
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  out: (t) => 1 - Math.pow(1 - t, 3),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
};
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Drives the page one video frame at a time and writes each frame to disk. */
class Director {
  constructor(page, framesDir, touch) {
    this.page = page;
    this.framesDir = framesDir;
    this.touch = touch;
    this.index = 0;
    this.scrollY = 0;
    this.pointer = { x: 1500, y: 900 };
    this.marks = {};
  }

  get seconds() {
    return this.index / FPS;
  }

  mark(name) {
    this.marks[name] = this.seconds;
  }

  /** One frame: optionally scroll, let events land, advance the clock, screenshot. */
  async frame(scrollY) {
    if (scrollY !== undefined) this.scrollY = scrollY;
    await this.page.evaluate(
      async ({ y, dt }) => {
        if (y !== undefined) window.scrollTo(0, y);
        await window.__vt.frame();
        await window.__vt.advance(dt);
      },
      { y: scrollY === undefined ? undefined : Math.round(scrollY), dt: DT }
    );
    // Keep the pointer's hover state honest while the page moves under it
    if (!this.touch && scrollY !== undefined) await this.page.mouse.move(this.pointer.x, this.pointer.y);
    await this.page.screenshot({
      path: path.join(this.framesDir, `${String(this.index).padStart(5, "0")}.jpg`),
      type: "jpeg",
      quality: 92,
    });
    this.index++;
    if (this.index % 90 === 0) process.stdout.write(`  ${this.seconds.toFixed(0)}s\r`);
  }

  async hold(seconds) {
    for (let i = 0; i < Math.round(seconds * FPS); i++) await this.frame();
  }

  /** Where an element is, in page coordinates (top) and on screen (center). */
  async box(selector, nth = 0) {
    const box = await this.page.evaluate(
      ({ selector, nth }) => {
        const el = document.querySelectorAll(selector)[nth];
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height };
      },
      { selector, nth }
    );
    if (!box) throw new Error(`Not found: ${selector} [${nth}]`);
    return box;
  }

  async maxScroll() {
    return this.page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  }

  /** Smooth scripted scroll to a page offset. */
  async glide(toY, seconds) {
    const from = this.scrollY;
    const to = clamp(Math.round(toY), 0, await this.maxScroll());
    const dur = seconds ?? clamp(Math.abs(to - from) / 800, 0.8, 2);
    const n = Math.round(dur * FPS);
    const flick = this.touch && Math.abs(to - from) > 40;
    const fx = 250;
    const fy0 = to > from ? 640 : 300;
    const fy1 = to > from ? 380 : 560;
    for (let i = 1; i <= n; i++) {
      const t = i / n;
      if (flick) {
        // A finger flicks the page, then lets the momentum carry it
        const ft = clamp(t / 0.3, 0, 1);
        const opacity = t < 0.3 ? 1 : clamp(1 - (t - 0.3) / 0.12, 0, 1);
        await this.finger(fx, lerp(fy0, fy1, ease.out(ft)), opacity, t < 0.3 ? 0.92 : 1);
      }
      await this.frame(lerp(from, to, ease.inOut(t)));
    }
    if (flick) await this.finger(fx, fy1, 0);
  }

  /** Scroll so that an element's top sits `offset` px below the top of the screen. */
  async glideTo(selector, offset = 120, seconds, nth = 0) {
    const { top } = await this.box(selector, nth);
    await this.glide(top - offset, seconds);
  }

  async finger(x, y, opacity, scale) {
    await this.page.evaluate(({ x, y, opacity, scale }) => window.__pointer.finger(x, y, opacity, scale), {
      x,
      y,
      opacity,
      scale,
    });
  }

  /** Mouse travel along a gentle arc, like a hand moving it. */
  async moveTo(x, y, seconds = 0.8) {
    const from = { ...this.pointer };
    const n = Math.max(1, Math.round(seconds * FPS));
    const dx = x - from.x;
    const dy = y - from.y;
    // Control point pushed sideways from the straight line
    const cx = from.x + dx * 0.5 - dy * 0.18;
    const cy = from.y + dy * 0.5 + dx * 0.18;
    for (let i = 1; i <= n; i++) {
      const t = ease.inOutSine(i / n);
      const px = (1 - t) * (1 - t) * from.x + 2 * (1 - t) * t * cx + t * t * x;
      const py = (1 - t) * (1 - t) * from.y + 2 * (1 - t) * t * cy + t * t * y;
      this.pointer = { x: px, y: py };
      await this.page.mouse.move(px, py);
      await this.frame();
    }
  }

  async moveToEl(selector, seconds, nth = 0, dx = 0, dy = 0) {
    const b = await this.box(selector, nth);
    await this.moveTo(b.x + dx, b.y + dy, seconds);
    return b;
  }

  async click() {
    await this.page.mouse.down();
    await this.frame();
    await this.page.mouse.up();
    await this.frame();
  }

  /** Mobile: a tap with a visible fingertip. */
  async tap(selector, nth = 0) {
    const b = await this.box(selector, nth);
    await this.finger(b.x, b.y, 1, 1.1);
    await this.frame();
    await this.finger(b.x, b.y, 1, 0.9);
    await this.page.evaluate(({ x, y }) => window.__pointer.ripple(x, y), b);
    await this.page.touchscreen.tap(b.x, b.y);
    await this.frame();
    for (let i = 1; i <= 6; i++) {
      await this.finger(b.x, b.y, 1 - i / 6, 0.9 + i * 0.03);
      await this.frame();
    }
    return b;
  }

  /** Desktop: keep scrolling past the bottom with the wheel, so the page stretches. */
  async wheelPull(seconds, perFrame) {
    for (let i = 0; i < Math.round(seconds * FPS); i++) {
      await this.page.mouse.wheel(0, perFrame);
      await this.frame();
    }
  }

  /** Mobile: drag the finger up from the bottom edge and let go. */
  async touchPull(cdp, distance, seconds) {
    const x = 195;
    const y0 = 620;
    const n = Math.round(seconds * FPS);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: y0 }] });
    for (let i = 1; i <= n; i++) {
      const y = y0 - distance * ease.inOutSine(i / n);
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
      await this.finger(x, y, 1, 0.92);
      await this.frame();
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    for (let i = 1; i <= 6; i++) {
      await this.finger(x, y0 - distance, 1 - i / 6, 0.92 + i * 0.02);
      await this.frame();
    }
  }
}

// --- The visits -------------------------------------------------------------

const TOGGLE = "header [data-mounted]";

async function desktopTour(d) {
  const vh = 810;

  // Hero: intro plays while the pointer drifts in over the map (the contours rise under it)
  await d.hold(1.2);
  await d.moveTo(980, 620, 1.6);
  await d.hold(0.3);
  // Sweep across the name: letters swell near the pointer
  const h1 = await d.box("#home h1");
  await d.moveTo(h1.x - h1.w * 0.42, h1.y - h1.h * 0.22, 0.9);
  await d.moveTo(h1.x + h1.w * 0.4, h1.y - h1.h * 0.18, 1.3);
  await d.moveTo(h1.x - h1.w * 0.15, h1.y + h1.h * 0.26, 1);
  await d.moveTo(h1.x + h1.w * 0.32, h1.y + h1.h * 0.24, 0.9);
  await d.moveTo(1150, 520, 0.9);
  await d.hold(0.4);

  // Navbar: the slime pill travels and the page glides to Experience
  await d.moveToEl("header nav a[href='#experience']", 0.8);
  await d.hold(0.2);
  await d.click();
  await d.hold(1.7);
  d.scrollY = await d.page.evaluate(() => window.scrollY);

  // LetsPic demos: face scan → album, then the CRM pipeline
  await d.glideTo("[class*='AlbumDemo'][class*='demo']", vh * 0.32);
  await d.moveToEl("[class*='AlbumDemo'][class*='action']", 0.9);
  await d.click();
  await d.hold(2.6);
  await d.moveToEl("[class*='PipelineDemo'][class*='action']", 0.8);
  await d.click();
  await d.hold(1.1);
  await d.click();
  await d.hold(1.2);

  // Freelance and the diploma
  await d.moveTo(1330, 560, 0.6);
  await d.glideTo("[class*='DiplomaCard'][class*='figure']", vh * 0.28, 1.6);
  await d.moveToEl("[class*='DiplomaCard'][class*='thumb']", 0.8);
  await d.hold(0.8);

  // Halfway down the page: switch to dark
  await d.moveTo(1330, 600, 0.5);
  const mid = (await d.maxScroll()) / 2;
  await d.glide(mid, 1.6);
  await d.hold(0.4);
  await d.moveToEl(TOGGLE, 0.9);
  await d.hold(0.2);
  d.mark("theme");
  await d.click();
  await d.hold(1.8);

  // Projects in the dark theme: hover the IPUY captures, open the phone recording
  await d.moveTo(1300, 560, 0.6);
  await d.glideTo("#projects button[class*='thumb']", vh * 0.12, 1.4, 1);
  await d.moveToEl("#projects button[class*='thumb']", 0.8, 2);
  await d.hold(0.3);
  await d.moveToEl("#projects button[class*='thumb']", 0.6, 3);
  await d.hold(0.2);
  await d.click();
  await d.hold(3.4);
  await d.page.keyboard.press("Escape");
  await d.hold(1);

  // MobTech
  await d.glideTo("#projects button[class*='thumb']", vh * 0.3, 1.3, 4);
  await d.moveToEl("#projects button[class*='thumb']", 0.7, 4);
  await d.hold(0.4);
  await d.moveToEl("#projects button[class*='thumb']", 0.5, 5);
  await d.hold(0.4);

  // Skills: the legend stamps in; a few symbols react
  await d.moveTo(1330, 500, 0.5);
  await d.glideTo("#skills [data-waypoint]", 110, 1.4);
  await d.hold(0.6);
  for (const i of [0, 2, 5, 9, 14]) {
    await d.moveToEl("#skills li[class*='symbol']", 0.38, i);
    await d.hold(0.12);
  }
  await d.moveTo(1330, 500, 0.4);
  await d.glideTo("#skills [class*='softTitle']", 140, 1.2);
  await d.hold(0.8);

  // Contact
  await d.glideTo("#contact [data-waypoint]", 110, 1.4);
  await d.moveToEl("#contact a[href^='mailto']", 0.8);
  await d.hold(0.9);
  for (let i = 0; i < 4; i++) {
    await d.moveToEl("#contact li a", 0.32, i, 120);
    await d.hold(0.12);
  }

  // Bottom of the page: keep scrolling and it stretches like a slingshot
  await d.moveTo(900, 420, 0.5);
  await d.glide(await d.maxScroll(), 1.1);
  await d.hold(0.5);
  await d.wheelPull(0.55, 45);
  await d.hold(1.3);

  // Back to the top, with the landing bounce
  await d.moveToEl("footer button", 0.8);
  await d.click();
  await d.hold(2.4);
  d.scrollY = 0;
  await d.moveTo(h1.x + h1.w * 0.1, h1.y, 1.2);
  await d.moveTo(h1.x + h1.w * 0.38, h1.y + h1.h * 0.2, 1);
  await d.hold(1.4);
}

async function mobileTour(d, cdp) {
  const vh = 844;

  await d.hold(3.6);

  // Menu drawer → Experience
  await d.tap("header button[aria-controls]");
  await d.hold(0.9);
  await d.tap("#mobile-nav a[href='#experience']");
  await d.hold(1.8);
  d.scrollY = await d.page.evaluate(() => window.scrollY);

  // LetsPic demos
  await d.glideTo("[class*='AlbumDemo'][class*='demo']", vh * 0.3);
  await d.hold(0.3);
  await d.tap("[class*='AlbumDemo'][class*='action']");
  await d.hold(2.5);
  await d.glideTo("[class*='PipelineDemo'][class*='action']", vh * 0.62, 1);
  await d.tap("[class*='PipelineDemo'][class*='action']");
  await d.hold(1.2);
  await d.tap("[class*='PipelineDemo'][class*='action']");
  await d.hold(1);

  // Freelance, diploma
  await d.glideTo("[class*='DiplomaCard'][class*='figure']", vh * 0.55, 1.6);
  await d.hold(0.5);
  await d.glideTo("[class*='DiplomaCard'][class*='figure']", vh * 0.22, 1);
  await d.hold(0.5);

  // Halfway: dark theme
  await d.glide((await d.maxScroll()) / 2, 1.8);
  await d.hold(0.5);
  d.mark("theme");
  await d.tap(TOGGLE);
  await d.hold(1.8);

  // IPUY: open the phone recording
  await d.glideTo("#projects button[class*='thumb']", vh * 0.38, 1.2, 3);
  await d.hold(0.3);
  await d.tap("#projects button[class*='thumb']", 3);
  await d.hold(3.4);
  await d.tap("[class*='VideoCard'][class*='close']");
  await d.hold(0.9);

  // MobTech, skills, soft skills, contact
  await d.glideTo("#projects button[class*='thumb']", vh * 0.3, 1.2, 4);
  await d.hold(0.6);
  await d.glideTo("#skills [data-waypoint]", 90, 1.2);
  await d.hold(0.9);
  await d.glideTo("#skills [class*='legend']", 70, 1.1);
  await d.hold(0.7);
  await d.glideTo("#skills [class*='softTitle']", 90, 1.3);
  await d.hold(0.7);
  await d.glideTo("#contact [data-waypoint]", 90, 1.5);
  await d.hold(0.8);

  // Bottom: drag past the end and let go
  await d.glide(await d.maxScroll(), 1);
  await d.hold(0.4);
  await d.touchPull(cdp, 190, 0.5);
  await d.hold(1.2);

  // Back to the top
  await d.tap("footer button");
  await d.hold(2.6);
  await d.hold(1);
}

// --- Recording ----------------------------------------------------------------

async function record(browser, profileName) {
  const profile = PROFILES[profileName];
  const context = await browser.newContext({ ...profile.context, locale: LOCALE });
  await context.addInitScript(() => {
    localStorage.setItem("theme", "light");
    sessionStorage.clear();
  });
  await context.addInitScript(installVirtualTime);
  const page = await context.newPage();
  page.on("pageerror", (e) => console.log("  page error:", e.message));

  await page.goto(`${BASE_URL}/${LOCALE}`, { waitUntil: "load", timeout: 120_000 });
  await page.waitForSelector(`${TOGGLE}[data-mounted='true']`, { timeout: 60_000 });
  // Load every image now, so nothing pops in while recording
  await page.evaluate(async () => {
    await document.fonts.ready;
    const imgs = [...document.images];
    imgs.forEach((img) => (img.loading = "eager"));
    await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => (img.onload = img.onerror = r)))));
    await Promise.all(imgs.map((img) => img.decode?.().catch(() => {})));
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(installPointer, profileName === "desktop" ? "mouse" : "touch");

  const framesDir = mkdtempSync(path.join(tmpdir(), `promo-${profileName}-`));
  const d = new Director(page, framesDir, profileName === "mobile");
  const started = Date.now();
  if (profileName === "desktop") await desktopTour(d);
  else await mobileTour(d, await context.newCDPSession(page));
  process.stdout.write("\n");

  const base = path.join(OUT_DIR, `calebe-dev-${profileName}-${LOCALE}`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", String(FPS),
    "-i", path.join(framesDir, "%05d.jpg"),
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-c:v", "libx264", "-preset", "slow", "-crf", String(profile.crf),
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${base}.mp4`,
  ]);
  writeFileSync(`${base}.json`, JSON.stringify({ fps: FPS, frames: d.index, marks: d.marks }, null, 2));
  rmSync(framesDir, { recursive: true, force: true });
  await context.close();
  console.log(
    `  ✓ ${path.relative(process.cwd(), base)}.mp4 — ${d.seconds.toFixed(1)}s, theme switch at ${d.marks.theme?.toFixed(1)}s (took ${Math.round((Date.now() - started) / 1000)}s)`
  );
}

async function compose(browser) {
  const base = path.join(OUT_DIR, `calebe-dev-mobile-${LOCALE}`);
  const { marks } = JSON.parse(readFileSync(`${base}.json`, "utf8"));
  await composePhone(browser, { video: `${base}.mp4`, out: `${base}-9x16.mp4`, themeAt: marks.theme, locale: LOCALE });
  console.log(`  ✓ ${path.relative(process.cwd(), base)}-9x16.mp4`);
}

mkdirSync(OUT_DIR, { recursive: true });
const browser = await chromium.launch({ channel: "chrome" });
try {
  if (only.includes("compose")) await compose(browser);
  else {
    for (const name of only.length ? only : Object.keys(PROFILES)) {
      console.log(`\n${name} (${LOCALE})`);
      await record(browser, name);
      if (name === "mobile") await compose(browser);
    }
  }
} finally {
  await browser.close();
}
