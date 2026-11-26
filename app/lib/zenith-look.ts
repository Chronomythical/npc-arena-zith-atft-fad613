// Zenith's second layer (see zenith.ts): its crown of four sealed stars, a sundial halo, a night-blue mantle and the
// zenith ray, plus the charge, mark, floor sign and landing flourish every boss look carries (boss-looks.ts).
import { GOLD } from "./zenith";
import {
  TAU, HEAD, ring, dot, glowDot, star4, drift, hsla, seg, easeOut, mid, type BossLook,
} from "./boss-looks-kit";

// ---------- second layer: crown, halo and the zenith ray ----------
// The four stars of its crown each hold one sealed fighter; the colours are the fourth generation's glows.
const SEALED = ["hsl(168 80% 60%)", "hsl(292 90% 72%)", "hsl(200 30% 70%)", "hsl(46 100% 70%)"];

function crown(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, t: number, alive: boolean) {
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + (i - 1.5) * 0.42;
    const r = 22 * s;
    const sx = x + Math.cos(a) * r, sy = y + Math.sin(a) * r * 0.9 - 4 * s + Math.sin(t * 2 + i) * 1.2 * s;
    if (alive) glowDot(ctx, sx, sy, 9 * s, SEALED[i], 0.55 + Math.sin(t * 3 + i * 1.7) * 0.15);
    star4(ctx, sx, sy, 5.5 * s, alive ? "hsl(0 0% 100%)" : "hsl(232 20% 60%)");
  }
}

export const ZENITH_LOOK: BossLook = {
  back: (ctx, r, s, face, t, alive) => {
    const c = mid(r.hip, r.neck);
    // a tall thin halo, like a sundial ring stood on its edge
    ctx.save();
    if (alive) {
      ctx.globalCompositeOperation = "lighter";
      glowDot(ctx, c.x, c.y - 10 * s, 64 * s, "hsl(46 100% 60%)", 0.22);
      // the zenith ray: a column of light straight down from the top of the sky
      const g = ctx.createLinearGradient(0, r.head.y - 400 * s, 0, r.head.y);
      g.addColorStop(0, hsla(46, 100, 80, 0));
      g.addColorStop(1, hsla(46, 100, 80, 0.18 + Math.sin(t * 2) * 0.05));
      ctx.fillStyle = g;
      ctx.fillRect(r.head.x - 9 * s, r.head.y - 400 * s, 18 * s, 400 * s);
    }
    ctx.globalCompositeOperation = "source-over";
    ring(ctx, r.head.x - face * 2 * s, r.head.y + 8 * s, 34 * s, alive ? hsla(46, 100, 70, 0.85) : hsla(232, 20, 60, 0.4), 2.2 * s, 1.35);
    // twelve hour marks on the ring
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * TAU + t * 0.25;
      const x0 = r.head.x - face * 2 * s + Math.cos(a) * 34 * s, y0 = r.head.y + 8 * s + Math.sin(a) * 34 * s * 1.35;
      dot(ctx, x0, y0, (i % 3 ? 1.2 : 2.2) * s, alive ? GOLD : "hsl(232 20% 60%)");
    }
    // a long night-blue mantle hanging from the shoulders
    ctx.fillStyle = alive ? "hsl(232 50% 14% / 0.92)" : "hsl(232 20% 20% / 0.7)";
    ctx.beginPath();
    ctx.moveTo(r.neck.x - 8 * s, r.neck.y + 2 * s);
    ctx.lineTo(r.neck.x + 8 * s, r.neck.y + 2 * s);
    ctx.lineTo(r.hip.x + 22 * s, r.hip.y + 34 * s);
    ctx.quadraticCurveTo(r.hip.x, r.hip.y + 40 * s + Math.sin(t * 2) * 2 * s, r.hip.x - 22 * s, r.hip.y + 34 * s);
    ctx.closePath();
    ctx.fill();
    // stars stitched into the mantle
    for (let i = 0; i < 6; i++) {
      const k = (i + 1) / 7;
      const sx = r.hip.x + Math.sin(i * 2.3) * 14 * s, sy = r.neck.y + (r.hip.y + 30 * s - r.neck.y) * k;
      dot(ctx, sx, sy, 1.2 * s, alive ? hsla(46, 100, 80, 0.6 + Math.sin(t * 4 + i) * 0.3) : "hsl(232 20% 50%)");
    }
    ctx.restore();
  },
  front: (ctx, r, s, face, t, alive) => {
    ctx.save();
    crown(ctx, r.head.x, r.head.y - HEAD * s, s, t, alive);
    if (alive) {
      // motes of light drifting up off it, back towards the sky
      ctx.globalCompositeOperation = "lighter";
      drift(5, t, 0.5, 7, (i, k, r1) => {
        const x = r.hip.x + (r1 - 0.5) * 50 * s, y = r.hip.y + 30 * s - k * 120 * s;
        glowDot(ctx, x, y, 3 * s, GOLD, (1 - k) * 0.7);
      });
    }
    ctx.restore();
  },
  charge: (ctx, h, s, t, k, face) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    glowDot(ctx, h.x, h.y, (8 + 12 * k) * s, GOLD, 0.4 + 0.5 * k);
    for (let i = 0; i < 4; i++) {
      const a = t * 3 + (i / 4) * TAU, d = (1 - k) * 26 * s + 6 * s;
      star4(ctx, h.x + Math.cos(a) * d, h.y + Math.sin(a) * d, 3.5 * s, SEALED[i]);
    }
    ctx.restore();
  },
  mark: (ctx, x, y, R, k, face, seed) => {
    const fade = 1 - k;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ring(ctx, x, y, R * (0.5 + k * 0.7), hsla(46, 100, 72, fade), 2);
    for (let i = 0; i < 4; i++) {
      const a = seed + (i / 4) * TAU + k;
      star4(ctx, x + Math.cos(a) * R * (0.3 + k), y + Math.sin(a) * R * (0.3 + k), R * 0.22 * fade + 1, SEALED[i]);
    }
    ctx.restore();
  },
  sign: (ctx, x, g, s, k, t) => {
    ctx.save();
    const a = Math.min(1, k * 1.4) * (k > 0.85 ? (1 - k) / 0.15 : 1);
    ring(ctx, x, g, 70 * s * easeOut(Math.min(1, k * 1.3)), hsla(46, 100, 70, a), 2 * s, 0.25);
    ring(ctx, x, g, 46 * s * easeOut(Math.min(1, k * 1.3)), hsla(232, 80, 70, a * 0.8), 1.5 * s, 0.25);
    for (let i = 0; i < 4; i++) {
      const an = (i / 4) * TAU + t * 0.6;
      star4(ctx, x + Math.cos(an) * 58 * s, g + Math.sin(an) * 58 * s * 0.25, 4 * s * a, SEALED[i]);
    }
    ctx.restore();
  },
  burst: (ctx, x, g, s, e, t) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const fade = 1 - seg(e, 0.3, 1);
    glowDot(ctx, x, g - 60 * s, 90 * s * (0.6 + e), GOLD, 0.5 * fade);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU + t * 0.4;
      const d = 30 * s + e * 120 * s;
      star4(ctx, x + Math.cos(a) * d, g - 60 * s + Math.sin(a) * d * 0.6, 5 * s * fade, i % 2 ? GOLD : "hsl(0 0% 100%)");
    }
    ctx.restore();
  },
};
