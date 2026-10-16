// File: scripts/lib/compose-phone.mjs
//
// Puts the phone recording in an iPhone frame on a 1080×1920 (9:16) canvas for
// LinkedIn/Stories. The topographic background switches from light to dark at the
// same moment the site does. Each theme's background + phone is drawn in Chrome as
// one image with a transparent, rounded screen hole; ffmpeg lays the video underneath.

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const W = 1080;
const H = 1920;
const SCREEN = { x: 210, y: 316, w: 660, h: 1428, r: 58 };
const BEZEL = 16;

const SUBTITLE = {
  pt: "Desenvolvedor full-stack",
  en: "Full-stack developer",
  es: "Desarrollador full-stack",
};

const THEMES = {
  light: { bg: "#FDF7F4", line: "rgba(153,124,112,0.22)", index: "rgba(142,180,134,0.5)", ink: "#685752", accent: "#8EB486", sub: "#997C70" },
  dark: { bg: "#021526", line: "rgba(110,172,218,0.24)", index: "rgba(110,172,218,0.5)", ink: "#E2E2B6", accent: "#6EACDA", sub: "rgba(226,226,182,0.66)" },
};

const MARK = `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M16 2.5c7.6 0 13.5 5.2 13.5 12.6S23.3 29.5 15.4 29.5 2.5 23.8 2.5 16.2 8.4 2.5 16 2.5Z"/>
  <path d="M16.4 8c4.6 0 8 3.3 8 7.7s-3.6 8.3-8.4 8.3-7.9-3.6-7.9-8 3.7-8 8.3-8Z"/>
  <path d="M16.6 13c1.9 0 3.2 1.3 3.2 3s-1.4 3.1-3.3 3.1-3.1-1.3-3.1-3 1.4-3.1 3.2-3.1Z"/></svg>`;

function screenPath(inset = 0) {
  const { x, y, w, h, r } = SCREEN;
  return `M ${x + r} ${y + inset} H ${x + w - r} A ${r - inset} ${r - inset} 0 0 1 ${x + w - inset} ${y + r}
    V ${y + h - r} A ${r - inset} ${r - inset} 0 0 1 ${x + w - r} ${y + h - inset}
    H ${x + r} A ${r - inset} ${r - inset} 0 0 1 ${x + inset} ${y + h - r} V ${y + r} A ${r - inset} ${r - inset} 0 0 1 ${x + r} ${y + inset} Z`;
}

function layerHtml(theme, locale) {
  const t = THEMES[theme];
  const o = { x: SCREEN.x - BEZEL, y: SCREEN.y - BEZEL, w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2, r: SCREEN.r + BEZEL };
  // Everything is opaque except the rounded screen, where the video will show through
  const hole = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z ${screenPath(0.5)}"/></svg>`;
  return `<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&display=block" rel="stylesheet">
<style>
  html,body{margin:0;width:${W}px;height:${H}px;background:transparent;overflow:hidden}
  .layer{position:absolute;inset:0;background:${t.bg};
    -webkit-mask:url('data:image/svg+xml;utf8,${encodeURIComponent(hole)}') 0 0/${W}px ${H}px no-repeat}
  canvas,svg.phone{position:absolute;inset:0}
  .title{position:absolute;left:0;right:0;top:92px;display:flex;align-items:center;justify-content:center;gap:22px;
    font:700 84px/1 "Bricolage Grotesque";letter-spacing:-0.035em;color:${t.ink}}
  .title svg{width:70px;height:70px;color:${t.accent}}
  .sub{position:absolute;left:0;right:0;top:204px;text-align:center;font:500 34px/1 "Bricolage Grotesque";letter-spacing:-0.01em;color:${t.sub}}
</style></head><body><div class="layer">
<canvas id="c" width="${W}" height="${H}"></canvas>
<div class="title">${MARK}<span>Calebe Dev</span></div>
<div class="sub">${SUBTITLE[locale] ?? SUBTITLE.en}</div>
<svg class="phone" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#000" flood-opacity="${theme === "dark" ? 0.55 : 0.3}"/></filter>
    <linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="#3a3a3c"/><stop offset=".5" stop-color="#1c1c1e"/><stop offset="1" stop-color="#3a3a3c"/></linearGradient>
  </defs>
  <rect x="${o.x - 5}" y="${o.y + 250}" width="7" height="70" rx="3" fill="#2c2c2e"/>
  <rect x="${o.x - 5}" y="${o.y + 350}" width="7" height="110" rx="3" fill="#2c2c2e"/>
  <rect x="${o.x - 5}" y="${o.y + 480}" width="7" height="110" rx="3" fill="#2c2c2e"/>
  <rect x="${o.x + o.w - 2}" y="${o.y + 380}" width="7" height="160" rx="3" fill="#2c2c2e"/>
  <rect filter="url(#s)" x="${o.x}" y="${o.y}" width="${o.w}" height="${o.h}" rx="${o.r}" fill="url(#edge)"/>
  <rect x="${o.x + 1.5}" y="${o.y + 1.5}" width="${o.w - 3}" height="${o.h - 3}" rx="${o.r - 1.5}" fill="none" stroke="#5a5a5e" stroke-width="2"/>
</svg></div>
<script>
  // Wobbly contour rings around a few summits, like the site's map
  const ctx = document.getElementById("c").getContext("2d");
  const summits = [[120, 1500, 1.1], [980, 520, 0.9], [940, 1820, 0.7], [60, 260, 0.6]];
  for (const [cx, cy, k] of summits) {
    for (let i = 1; i <= 16; i++) {
      const r = i * 46 * k;
      ctx.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.04) {
        const w = 1 + 0.12 * Math.sin(3 * a + i * 0.4 + cx) + 0.06 * Math.sin(5 * a - i * 0.7 + cy);
        const x = cx + Math.cos(a) * r * w, y = cy + Math.sin(a) * r * w * 0.92;
        a === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = i % 5 === 0 ? "${t.index}" : "${t.line}";
      ctx.lineWidth = i % 5 === 0 ? 2.4 : 1.6;
      ctx.stroke();
    }
  }
</script></body></html>`;
}

/**
 * @param {import("playwright").Browser} browser
 * @param {{ video: string, out: string, themeAt?: number, locale: string }} opts
 */
export async function composePhone(browser, { video, out, themeAt, locale }) {
  const dir = mkdtempSync(path.join(tmpdir(), "promo-phone-"));
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const shot = async (html, file) => {
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(dir, file), omitBackground: true });
  };
  await shot(layerHtml("light", locale), "light.png");
  await shot(layerHtml("dark", locale), "dark.png");
  await page.close();

  const duration = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).toString()
  );
  // The site's reveal takes ~1.1s from the click; the backdrop follows a beat behind
  const fadeAt = themeAt === undefined ? duration : themeAt + 0.25;

  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-f", "lavfi", "-i", `color=c=black:s=${W}x${H}:r=30:d=${duration}`,
    "-i", video,
    "-loop", "1", "-framerate", "30", "-t", String(duration), "-i", path.join(dir, "light.png"),
    "-loop", "1", "-framerate", "30", "-t", String(duration), "-i", path.join(dir, "dark.png"),
    "-filter_complex",
    [
      `[1]scale=${SCREEN.w}:${SCREEN.h}:flags=lanczos[screen]`,
      `[0][screen]overlay=${SCREEN.x}:${SCREEN.y}:shortest=1[base]`,
      `[base][2]overlay[lit]`,
      `[3]format=rgba,fade=t=in:st=${fadeAt.toFixed(2)}:d=1:alpha=1[dark]`,
      `[lit][dark]overlay,format=yuv420p`,
    ].join(";"),
    "-r", "30",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19",
    "-movflags", "+faststart",
    out,
  ]);
  rmSync(dir, { recursive: true, force: true });
}
