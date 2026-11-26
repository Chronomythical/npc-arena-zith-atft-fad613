// The fourth generation (FOURTH_IDS in fighters.ts), freed from the secret boss Zenith's crown: their body designs,
// drawn by the engine through drawQuestDesign (quest-designs.ts), and every one of their moves' looks, each drawn
// from its own design (designLook), in their colours or their Surge Mode's.
import type { BossRig } from "./boss-designs";
import type { Power } from "./fighters";
import type { QuestAct, QuestPaint } from "./quest-designs";
import { designLook, type OwnDraw, type PShape } from "./move-looks";

type Pt = { x: number; y: number };
const TAU = Math.PI * 2;
const HEAD = 11;
const al = (c: string, a: number) => c.replace(")", ` / ${Math.max(0, Math.min(1, a))})`);

function glowDot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, c: string, a = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, al(c, a));
  g.addColorStop(1, al(c, 0));
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
}
const mid = (a: Pt, b: Pt, k = 0.5): Pt => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });

// ---------- Wisp: a hood and a face scarf of smoke, a long smoky tail off the shoulders, embers in the palms ----------
function wispBack(ctx: CanvasRenderingContext2D, r: BossRig, s: number, face: number, t: number, alive: boolean, act: QuestAct | undefined, p: QuestPaint) {
  ctx.save();
  const smoke = p.nightmare ? "hsl(220 10% 10%)" : "hsl(210 8% 40%)";
  // the smoke tail streaming back off the shoulders, thicker while a move is under way
  const n = act ? 9 : 7;
  for (let i = 0; i < n; i++) {
    const k = i / n;
    const x = r.neck.x - face * (8 + k * 60) * s + Math.sin(t * 2.4 + i) * 4 * s;
    const y = r.neck.y + 4 * s - k * 14 * s + Math.sin(t * 3 + i * 0.8) * 5 * s;
    const rr = (9 + k * 10) * s;
    ctx.fillStyle = al(smoke, (alive ? 0.5 : 0.25) * (1 - k * 0.8));
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function wispFront(ctx: CanvasRenderingContext2D, r: BossRig, s: number, face: number, t: number, alive: boolean, p: QuestPaint) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const h = r.head;
  const hood = p.nightmare ? "hsl(220 12% 8%)" : "hsl(210 10% 28%)";
  // the hood: a soft peak drawn over the back of the head
  ctx.fillStyle = hood;
  ctx.beginPath();
  ctx.moveTo(h.x + face * 9 * s, h.y - 6 * s);
  ctx.quadraticCurveTo(h.x, h.y - 18 * s, h.x - face * 14 * s, h.y - 10 * s + Math.sin(t * 2) * s);
  ctx.quadraticCurveTo(h.x - face * 16 * s, h.y + 4 * s, h.x - face * 9 * s, h.y + 9 * s);
  ctx.quadraticCurveTo(h.x - face * 2 * s, h.y + 2 * s, h.x + face * 9 * s, h.y - 6 * s);
  ctx.fill();
  // a scarf of smoke over the mouth
  ctx.fillStyle = al(p.nightmare ? "hsl(220 10% 16%)" : "hsl(210 8% 52%)", 0.95);
  ctx.beginPath();
  ctx.ellipse(h.x + face * 3 * s, h.y + 5 * s, 9 * s, 4.5 * s, 0, 0, TAU);
  ctx.fill();
  // eyes glowing through the gap
  if (alive) {
    ctx.globalCompositeOperation = "lighter";
    for (const dx of [2.5, 7]) glowDot(ctx, h.x + face * dx * s, h.y - 1.5 * s, 3 * s, p.glow, 0.95);
    // embers smouldering in both palms, smoke curling off them
    for (const hand of [r.hF, r.hB]) {
      glowDot(ctx, hand.x, hand.y, 5 * s, p.nightmare ? p.glow : "hsl(24 100% 58%)", 0.6 + Math.sin(t * 6) * 0.2);
    }
    ctx.globalCompositeOperation = "source-over";
    for (let i = 0; i < 3; i++) {
      const k = (t * 0.8 + i / 3) % 1;
      ctx.fillStyle = al("hsl(210 8% 60%)", 0.4 * (1 - k));
      ctx.beginPath();
      ctx.arc(r.hF.x + Math.sin(t * 3 + i) * 3 * s, r.hF.y - k * 22 * s, (2 + k * 4) * s, 0, TAU);
      ctx.fill();
    }
  }
  ctx.restore();
}

// ---------- Boreal: an aurora shawl rippling behind the shoulders, a circlet of polar stars, lit hands ----------
function borealBack(ctx: CanvasRenderingContext2D, r: BossRig, s: number, face: number, t: number, alive: boolean, act: QuestAct | undefined, p: QuestPaint) {
  ctx.save();
  if (alive) ctx.globalCompositeOperation = "lighter";
  const lift = act ? 1.3 : 1;
  // two ribbons of light hanging off the shoulders, each waving on its own
  for (let band = 0; band < 2; band++) {
    const c = band ? p.glow : p.a;
    ctx.fillStyle = al(c, alive ? 0.45 : 0.15);
    ctx.beginPath();
    const pts: Pt[] = [];
    for (let j = 0; j <= 8; j++) {
      const k = j / 8;
      pts.push({
        x: r.neck.x - face * (4 + k * 46 + band * 6) * s,
        y: r.neck.y + 2 * s + k * 34 * s * lift - band * 4 * s + Math.sin(t * 3 + j * 0.9 + band * 1.7) * 6 * s * k,
      });
    }
    pts.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y - 6 * s) : ctx.moveTo(q.x, q.y - 6 * s)));
    for (let i = pts.length - 1; i >= 0; i--) ctx.lineTo(pts[i].x, pts[i].y + 6 * s);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function borealFront(ctx: CanvasRenderingContext2D, r: BossRig, s: number, face: number, t: number, alive: boolean, p: QuestPaint) {
  ctx.save();
  ctx.lineCap = "round";
  const h = r.head;
  // a thin circlet with three small polar stars
  ctx.strokeStyle = p.nightmare ? "hsl(350 80% 60%)" : "hsl(170 40% 86%)";
  ctx.lineWidth = 1.6 * s;
  ctx.beginPath();
  ctx.ellipse(h.x, h.y - 6 * s, 11 * s, 3 * s, 0, Math.PI, TAU);
  ctx.stroke();
  for (let i = 0; i < 3; i++) {
    const sx = h.x + (i - 1) * 7 * s, sy = h.y - 9 * s - (i === 1 ? 3 : 0) * s;
    if (alive) {
      ctx.globalCompositeOperation = "lighter";
      glowDot(ctx, sx, sy, 5 * s, i === 1 ? p.glow : p.a, 0.7 + Math.sin(t * 4 + i) * 0.2);
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.fillStyle = "hsl(0 0% 100%)";
    ctx.beginPath();
    ctx.arc(sx, sy, 1.4 * s, 0, TAU);
    ctx.fill();
  }
  if (alive) {
    ctx.globalCompositeOperation = "lighter";
    for (const dx of [2.5, 7]) glowDot(ctx, h.x + face * dx * s, h.y + 0.5 * s, 2.6 * s, p.a, 0.9);
    // the hands lit like the sky: one green, one violet
    glowDot(ctx, r.hF.x, r.hF.y, 7 * s, p.a, 0.6);
    glowDot(ctx, r.hB.x, r.hB.y, 6 * s, p.glow, 0.5);
    // a few motes rising off the shawl
    const c = mid(r.neck, r.hip, 0.3);
    for (let i = 0; i < 3; i++) {
      const k = (t * 0.6 + i / 3) % 1;
      glowDot(ctx, c.x - face * (20 + i * 10) * s, c.y - k * 40 * s, 2.4 * s, i % 2 ? p.glow : p.a, 1 - k);
    }
  }
  ctx.restore();
}

/** The fourth generation's body designs; true when `id` is one of them. */
export function drawFourthDesign(
  ctx: CanvasRenderingContext2D, id: Power, layer: "back" | "front", r: BossRig, s: number, face: number, t: number,
  alive: boolean, act: QuestAct | undefined, p: QuestPaint,
): boolean {
  if (id === "smoke") {
    layer === "back" ? wispBack(ctx, r, s, face, t, alive, act, p) : wispFront(ctx, r, s, face, t, alive, p);
    return true;
  }
  if (id === "aurora") {
    layer === "back" ? borealBack(ctx, r, s, face, t, alive, act, p) : borealFront(ctx, r, s, face, t, alive, p);
    return true;
  }
  return false;
}

// ---------- move looks ----------
type Row = [id: string, kind: string, a: string, b: string, p: PShape, d: Omit<OwnDraw, "kind">];
const WISP_A = "hsl(210 8% 44%)", WISP_B = "hsl(168 80% 64%)";
const SMOG_A = "hsl(220 10% 18%)", SMOG_B = "hsl(24 100% 60%)";
const BOREAL_A = "hsl(160 80% 50%)", BOREAL_B = "hsl(292 90% 74%)";
const STORM_A = "hsl(300 80% 56%)", STORM_B = "hsl(140 100% 70%)";
const ROWS: Row[] = [
  // Wisp
  ["smoke-jab", "melee", WISP_A, WISP_B, "smoke", { glyph: "orb", trail: "none", motion: "steady", burst: "scatter" }],
  ["cinder-hook", "melee", "hsl(24 90% 52%)", WISP_A, "ember", { glyph: "fang", trail: "none", motion: "steady", burst: "fountain" }],
  ["smoke-bomb", "projectile", WISP_A, WISP_B, "smoke", { glyph: "orb", trail: "dots", motion: "wobble", burst: "scatter" }],
  ["smokescreen", "zone", WISP_A, "hsl(210 8% 70%)", "smoke", { glyph: "spiral", trail: "none", motion: "spin", burst: "ring" }],
  ["vanish-step", "blink", WISP_A, WISP_B, "smoke", { glyph: "crescent", trail: "echo", motion: "steady", burst: "spiral" }],
  ["ash-tether", "pull", "hsl(210 6% 30%)", WISP_B, "dust", { glyph: "arrow", trail: "ribbon", motion: "wobble", burst: "spiral" }],
  ["chimney-blast", "eruption", WISP_A, "hsl(24 100% 60%)", "smoke", { glyph: "drop", trail: "none", motion: "pulse", burst: "fountain" }],
  ["exhale", "burst", "hsl(210 8% 56%)", WISP_B, "smoke", { glyph: "ring", trail: "none", motion: "pulse", burst: "ring" }],
  ["smog-cyclone", "zone", SMOG_A, SMOG_B, "smoke", { glyph: "spiral", trail: "none", motion: "spin", burst: "spiral" }],
  ["ember-cloud", "rain", SMOG_B, SMOG_A, "ember", { glyph: "drop", trail: "streak", motion: "wobble", burst: "scatter" }],
  ["phantom-rush", "dash", SMOG_A, SMOG_B, "smoke", { glyph: "crescent", trail: "echo", motion: "steady", burst: "crack" }],
  ["choking-cloud", "burst", SMOG_A, "hsl(90 60% 50%)", "smoke", { glyph: "eye", trail: "none", motion: "pulse", burst: "ring" }],
  ["soot-lance", "beam", SMOG_A, SMOG_B, "ember", { glyph: "arrow", trail: "ribbon", motion: "steady", burst: "crack" }],
  // Boreal
  ["veil-jab", "melee", BOREAL_A, BOREAL_B, "spark", { glyph: "feather", trail: "none", motion: "steady", burst: "scatter" }],
  ["curtain-ray", "beam", BOREAL_A, BOREAL_B, "spark", { glyph: "feather", trail: "ribbon", motion: "wobble", burst: "fountain" }],
  ["polar-shards", "projectile", "hsl(180 70% 70%)", BOREAL_B, "shard", { glyph: "diamond", trail: "sparkle", motion: "spin", burst: "crack" }],
  ["solar-wind", "rain", BOREAL_B, BOREAL_A, "star", { glyph: "star", trail: "streak", motion: "wobble", burst: "scatter" }],
  ["magnetic-halo", "zone", BOREAL_A, BOREAL_B, "ring", { glyph: "ring", trail: "none", motion: "spin", burst: "ring" }],
  ["polar-dash", "dash", BOREAL_A, "hsl(0 0% 100%)", "spark", { glyph: "arrow", trail: "echo", motion: "steady", burst: "scatter" }],
  ["aurora-flare", "burst", BOREAL_B, BOREAL_A, "star", { glyph: "flower", trail: "none", motion: "pulse", burst: "ring" }],
  ["polar-mend", "heal", BOREAL_A, "hsl(170 60% 88%)", "spark", { glyph: "heart", trail: "none", motion: "pulse", burst: "fountain" }],
  ["coronal-sky", "rain", STORM_A, STORM_B, "shard", { glyph: "star", trail: "sparkle", motion: "spin", burst: "crack" }],
  ["polar-vortex", "pull", STORM_A, STORM_B, "spark", { glyph: "spiral", trail: "ribbon", motion: "spin", burst: "spiral" }],
  ["northern-step", "blink", STORM_B, STORM_A, "star", { glyph: "feather", trail: "echo", motion: "steady", burst: "fountain" }],
  ["magnetosphere", "burst", STORM_A, STORM_B, "ring", { glyph: "hex", trail: "none", motion: "pulse", burst: "ring" }],
  ["ion-spire", "eruption", STORM_B, STORM_A, "spark", { glyph: "diamond", trail: "none", motion: "pulse", burst: "fountain" }],
];
for (const [id, kind, a, b, p, d] of ROWS) designLook(id, a, b, p, { kind, ...d });
