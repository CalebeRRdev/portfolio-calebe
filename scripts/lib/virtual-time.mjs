// File: scripts/lib/virtual-time.mjs
//
// Injected into the page before any of its scripts run (page.addInitScript).
// Freezes the page's clock so a recording can step it one video frame at a time:
// requestAnimationFrame, performance.now, Date.now, timers, CSS/WAAPI animations
// (including the View Transition of the theme toggle) and <video> playback all
// move only when window.__vt.advance(ms) is called. Every frame of the final video
// then shows exactly what a real visitor would see at that moment, no matter how
// long the screenshot took.

export function installVirtualTime() {
  if (window.__vt) return;

  const realRaf = window.requestAnimationFrame.bind(window);
  const realPerfNow = performance.now.bind(performance);
  const realDateNow = Date.now;

  let now = realPerfNow();
  const dateOffset = realDateNow() - now;

  performance.now = () => now;
  Date.now = () => Math.round(now + dateOffset);

  // --- requestAnimationFrame ---
  let rafs = new Map();
  let rafId = 1;
  window.requestAnimationFrame = (cb) => {
    const id = rafId++;
    rafs.set(id, cb);
    return id;
  };
  window.cancelAnimationFrame = (id) => rafs.delete(id);

  // --- timers ---
  const timers = new Map();
  let timerId = 1;
  const addTimer = (fn, ms, args, repeat) => {
    const id = timerId++;
    const delay = Math.max(0, Number(ms) || 0);
    timers.set(id, { at: now + delay, fn, args, every: repeat ? Math.max(1, delay) : 0 });
    return id;
  };
  window.setTimeout = (fn, ms, ...args) => addTimer(fn, ms, args, false);
  window.setInterval = (fn, ms, ...args) => addTimer(fn, ms, args, true);
  window.clearTimeout = window.clearInterval = (id) => timers.delete(id);

  // --- animations (CSS animations/transitions, element.animate, view transitions) ---
  const controlled = new WeakMap();
  const extra = new Set(); // animate() results, in case getAnimations() misses pseudo-elements
  const realAnimate = Element.prototype.animate;
  Element.prototype.animate = function (...args) {
    const a = realAnimate.apply(this, args);
    extra.add(a);
    return a;
  };

  const stepAnimations = () => {
    const all = new Set(document.getAnimations());
    for (const a of extra) {
      if (a.playState === "finished" || a.playState === "idle") extra.delete(a);
      else all.add(a);
    }
    for (const a of all) {
      let s = controlled.get(a);
      if (!s) {
        // A page that paused its own animation (animation-play-state) keeps it paused
        if (a.playState !== "running") continue;
        s = { born: now, base: a.currentTime ?? 0, rate: a.playbackRate || 1, done: false };
        controlled.set(a, s);
      }
      if (s.done) continue;
      const local = s.base + (now - s.born) * s.rate;
      const end = a.effect?.getComputedTiming().endTime ?? Infinity;
      if (Number.isFinite(end) && local >= end) {
        // Let it finish for real so finished promises and onfinish handlers fire
        s.done = true;
        try {
          a.play();
          a.finish();
        } catch {}
        continue;
      }
      a.pause();
      a.currentTime = local;
    }
  };

  // --- video ---
  const realPause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause = function () {
    this.__vtPlaying = false;
    return realPause.call(this);
  };

  const stepVideos = async (ms) => {
    const seeks = [];
    for (const v of document.querySelectorAll("video")) {
      if (!v.paused) {
        // It started playing on its own (autoplay): take over the clock
        realPause.call(v);
        v.__vtPlaying = true;
        continue;
      }
      if (!v.__vtPlaying || !(v.duration > 0)) continue;
      let t = v.currentTime + ms / 1000;
      if (t >= v.duration) t = v.loop ? t % v.duration : v.duration;
      seeks.push(
        new Promise((resolve) => {
          const done = () => resolve();
          v.addEventListener("seeked", done, { once: true });
          setTimeoutReal(done, 400);
        })
      );
      v.currentTime = t;
    }
    await Promise.all(seeks);
  };
  const setTimeoutReal = (fn, ms) => {
    const end = realPerfNow() + ms;
    const tick = () => (realPerfNow() >= end ? fn() : realRaf(tick));
    realRaf(tick);
  };

  const yieldMicrotasks = () => new Promise((r) => queueMicrotask(r)).then(() => null);

  window.__vt = {
    now: () => now,
    /** Wait for one real rendering frame (lets scroll and input events be dispatched). */
    frame: () => new Promise((r) => realRaf(() => r())),
    async advance(ms) {
      const target = now + ms;
      // Timers in order, each one seeing its own due time
      for (;;) {
        let next = null;
        for (const [id, t] of timers) {
          if (t.at <= target && (!next || t.at < next.t.at)) next = { id, t };
        }
        if (!next) break;
        now = Math.max(now, next.t.at);
        if (next.t.every) next.t.at += next.t.every;
        else timers.delete(next.id);
        try {
          if (typeof next.t.fn === "function") next.t.fn(...next.t.args);
        } catch (e) {
          console.error(e);
        }
        await yieldMicrotasks();
      }
      now = target;

      const callbacks = [...rafs.values()];
      rafs = new Map();
      for (const cb of callbacks) {
        try {
          cb(now);
        } catch (e) {
          console.error(e);
        }
      }
      await yieldMicrotasks();
      stepAnimations();
      await stepVideos(ms);
    },
  };
}

/** The fake pointer drawn into the page, since headless screenshots have none. */
export function installPointer(kind) {
  if (window.__pointer) return;
  const css = `
    #__vt-pointer{position:fixed;left:0;top:0;width:26px;height:26px;z-index:2147483647;pointer-events:none;will-change:transform}
    #__vt-pointer svg{position:absolute;left:0;top:0;width:26px;height:26px;max-width:none;filter:drop-shadow(0 2px 3px rgba(0,0,0,.28))}
    #__vt-pointer .hand{display:none;left:-9px}
    #__vt-pointer.is-hand .arrow{display:none}
    #__vt-pointer.is-hand .hand{display:block}
    #__vt-finger{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;
      background:rgba(255,255,255,.42);border:2px solid rgba(0,0,0,.18);box-shadow:0 4px 18px rgba(0,0,0,.22);opacity:0;
      -webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}
    .__vt-ripple{position:fixed;z-index:2147483646;pointer-events:none;width:56px;height:56px;margin:-28px 0 0 -28px;border-radius:50%;border:2px solid #8EB486}
    nextjs-portal{display:none!important}
    ::-webkit-scrollbar{display:none}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.documentElement.appendChild(style);

  const ripple = (x, y) => {
    const r = document.createElement("div");
    r.className = "__vt-ripple";
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    document.documentElement.appendChild(r);
    r.animate(
      [
        { transform: "scale(.3)", opacity: 0.9 },
        { transform: "scale(1.5)", opacity: 0 },
      ],
      { duration: 520, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
    ).finished.then(() => r.remove());
  };

  if (kind === "mouse") {
    const el = document.createElement("div");
    el.id = "__vt-pointer";
    el.innerHTML = `
      <svg class="arrow" viewBox="0 0 26 26"><path d="M4 2.5v18.2l4.6-4.4 3 6.9 3.2-1.4-3-6.8h6.4L4 2.5Z" fill="#111" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>
      <svg class="hand" viewBox="0 0 26 26"><path d="M9.6 3.4c1 0 1.8.8 1.8 1.8v6.1l.1-1.3c.1-.9.9-1.6 1.8-1.5.9 0 1.6.8 1.6 1.7v1.1c.2-.8.9-1.3 1.7-1.3.9 0 1.7.8 1.7 1.7v1.2c.2-.7.9-1.2 1.6-1.2.9 0 1.6.7 1.6 1.6v4.9c0 3.6-2.6 6.5-6.3 6.5h-1.6c-2 0-3.6-.9-4.8-2.5l-3.7-5.2c-.6-.8-.4-1.9.4-2.4.7-.5 1.7-.3 2.2.4l1.1 1.4V5.2c0-1 .8-1.8 1.8-1.8Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
    el.style.transform = "translate(-100px,-100px)";
    document.documentElement.appendChild(el);
    window.addEventListener(
      "mousemove",
      (e) => {
        el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        const under = document.elementFromPoint(e.clientX, e.clientY);
        el.classList.toggle("is-hand", !!under && getComputedStyle(under).cursor === "pointer");
      },
      { capture: true, passive: true }
    );
    window.addEventListener("mousedown", (e) => ripple(e.clientX, e.clientY), { capture: true });
    window.__pointer = { ripple };
  } else {
    const finger = document.createElement("div");
    finger.id = "__vt-finger";
    document.documentElement.appendChild(finger);
    window.__pointer = {
      ripple,
      /** Show the finger at (x, y) with the given opacity and press scale. */
      finger(x, y, opacity, scale = 1) {
        finger.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        finger.style.opacity = String(opacity);
      },
    };
  }
}
