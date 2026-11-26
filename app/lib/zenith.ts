// Zenith, the secret boss. It is in no Story chapter: it sits at the highest point of the sky above the home
// arena holding the fourth generation of fighters sealed in its crown, and comes down only when someone calls it
// (typing its name on the arena screen, or knocking seven times on the arena; see home.tsx). Beating it breaks
// the seal (`breakSeal` in quests.ts). Its moves are drawn from their own designs (designLook), its phases sit in
// BOSS_PHASES (bosses.ts), and its crown, halo and zenith ray are its second layer (zenith-look.ts, used by boss-looks.ts).
import type { FighterDef, Move } from "./fighters";
import type { Form } from "./forms";
import { designLook, type OwnDraw, type PShape } from "./move-looks";

const M = (m: Omit<Move, "wind" | "act" | "rec"> & Partial<Pick<Move, "wind" | "act" | "rec">>): Move => ({
  wind: 0.2,
  act: 0.12,
  rec: 0.24,
  ...m,
});

export const GOLD = "hsl(46 100% 70%)";
const NIGHT = "hsl(232 45% 18%)";

export const ZENITH: FighterDef = {
  id: "lux", boss: "zenith", name: "Zenith", power: "The Highest Point", role: "control",
  ability: "The arena's secret champion. It waits at the highest point of the sky with the fourth generation sealed in its crown of stars, and comes down only for someone who calls it.",
  color: NIGHT, glow: GOLD, hp: 560, speed: 96,
  moves: [
    M({ id: "crown-strike", name: "Crown Strike", kind: "melee", anim: "thrust", range: 82, cd: 0.9, dmg: 11, kb: 280 }),
    M({ id: "meridian-lance", name: "Meridian Lance", kind: "beam", anim: "cast", range: 620, minRange: 70, cd: 3.2, dmg: 15, act: 0.34, status: "blind", statusDur: 0.6, wind: 0.32 }),
    M({ id: "zenith-fall", name: "Zenith Fall", kind: "rain", anim: "raise", range: 560, cd: 5, dmg: 9, count: 7, radius: 170, shape: "shard", status: "stun", statusDur: 0.2, wind: 0.36, rec: 0.3 }),
    M({ id: "seal-ring", name: "Seal Ring", kind: "zone", anim: "slam", range: 420, cd: 9, dmg: 6, radius: 150, dur: 4.5, pullIn: 160, status: "slow", statusDur: 0.6, wind: 0.36 }),
    M({ id: "ascension", name: "Ascension", kind: "eruption", anim: "uppercut", range: 520, minRange: 40, cd: 5.5, dmg: 14, radius: 50, count: 3, lift: -760, wind: 0.34 }),
    M({ id: "star-seal", name: "Star Seal", kind: "projectile", anim: "thrust", range: 600, minRange: 80, cd: 2.4, dmg: 7, speed: 640, size: 11, count: 4, spread: 0.2, shape: "disc" }),
    M({ id: "noon-flare", name: "Noon Flare", kind: "burst", anim: "raise", range: 160, cd: 7, dmg: 16, radius: 190, kb: 480, lift: -360, wind: 0.34, rec: 0.35 }),
  ],
};

const P2 = { kind: "phase" as const, step: 2, at: 0.75, dmg: 1.12, kb: 1.08, cd: 0.88, speed: 1.05, act: 1.05 };
const P3 = { kind: "phase" as const, step: 3, at: 0.5, dmg: 1.24, kb: 1.15, cd: 0.78, speed: 1.1, act: 1.1 };
const P4 = { kind: "phase" as const, step: 4, at: 0.25, dmg: 1.38, kb: 1.25, cd: 0.68, speed: 1.18, act: 1.18 };

export const ZENITH_PHASES: Form[] = [
  {
    ...P2, power: "lux", title: "FIRST SEAL CRACKED",
    blurb: "One star in its crown splits open. Light leaks out of the crack and it starts pulling fighters up towards it.",
    body: "hsl(232 40% 24%)", glow: GOLD, a: "hsl(40 100% 62%)", b: "hsl(0 0% 100%)",
    moves: [
      M({ id: "sky-tether", name: "Sky Tether", kind: "pull", anim: "cast", range: 480, minRange: 110, cd: 4, dmg: 10, status: "stun", statusDur: 0.3, wind: 0.26 }),
      M({ id: "meridian-step", name: "Meridian Step", kind: "blink", anim: "kick", range: 640, minRange: 110, cd: 4, dmg: 14, kb: 320, lift: -300 }),
    ],
  },
  {
    ...P3, power: "lux", title: "HIGH NOON", drain: 0.1,
    blurb: "The sun stands straight overhead and casts no shadows. Every hit it lands takes a little light back.",
    body: "hsl(44 60% 40%)", glow: "hsl(0 0% 100%)", a: "hsl(48 100% 66%)", b: "hsl(30 100% 60%)",
    moves: [
      M({ id: "noon-pillar", name: "Noon Pillar", kind: "eruption", anim: "slam", range: 620, minRange: 40, cd: 6, dmg: 13, radius: 46, count: 5, lift: -640, status: "blind", statusDur: 0.8, wind: 0.36 }),
      M({ id: "solar-crown", name: "Solar Crown", kind: "dash", anim: "lunge", range: 440, cd: 4.2, dmg: 16, dist: 440, act: 0.24, kb: 400, lift: -220 }),
    ],
  },
  {
    ...P4, power: "lux", title: "THE LAST SEAL", drain: 0.1, guard: 0.8,
    blurb: "Its crown breaks open and the sealed fighters' light pours through it. The whole sky falls on the arena at once.",
    body: "hsl(0 0% 96%)", glow: GOLD, a: "hsl(46 100% 72%)", b: "hsl(232 80% 70%)", dark: "hsl(232 60% 8%)",
    moves: [
      M({ id: "apex", name: "Apex", kind: "burst", anim: "raise", range: 2000, cd: 13, dmg: 12, radius: 60, world: true, status: "blind", statusDur: 1, wind: 0.55, rec: 0.25 }),
      M({ id: "starcrown-rain", name: "Starcrown Rain", kind: "rain", anim: "raise", range: 600, cd: 5, dmg: 10, count: 10, radius: 210, shape: "shard", status: "stun", statusDur: 0.2, wind: 0.36 }),
    ],
  },
];

// ---------- move looks ----------
// Every move is drawn from its own design, in its phase's colours.
const looks: [string, string, string, PShape, Omit<OwnDraw, "kind">][] = [
  ["crown-strike", GOLD, "hsl(0 0% 100%)", "star", { glyph: "star", trail: "none", motion: "steady", burst: "ring" }],
  ["meridian-lance", "hsl(46 100% 64%)", "hsl(0 0% 100%)", "spark", { glyph: "diamond", trail: "ribbon", motion: "steady", burst: "crack" }],
  ["zenith-fall", "hsl(50 100% 72%)", "hsl(220 80% 80%)", "star", { glyph: "star", trail: "streak", motion: "spin", burst: "scatter" }],
  ["seal-ring", "hsl(232 70% 60%)", GOLD, "ring", { glyph: "ring", trail: "none", motion: "spin", burst: "ring" }],
  ["ascension", "hsl(46 100% 66%)", "hsl(232 80% 82%)", "spark", { glyph: "arrow", trail: "sparkle", motion: "steady", burst: "fountain" }],
  ["star-seal", GOLD, "hsl(232 70% 70%)", "star", { glyph: "cross", trail: "dots", motion: "spin", burst: "spiral" }],
  ["noon-flare", "hsl(40 100% 62%)", "hsl(0 0% 100%)", "spark", { glyph: "star", trail: "none", motion: "pulse", burst: "ring" }],
  ["sky-tether", "hsl(40 100% 62%)", "hsl(0 0% 100%)", "spark", { glyph: "arrow", trail: "ribbon", motion: "steady", burst: "spiral" }],
  ["meridian-step", "hsl(46 100% 70%)", "hsl(232 80% 80%)", "star", { glyph: "diamond", trail: "echo", motion: "steady", burst: "ring" }],
  ["noon-pillar", "hsl(48 100% 66%)", "hsl(30 100% 60%)", "ember", { glyph: "hex", trail: "none", motion: "pulse", burst: "fountain" }],
  ["solar-crown", "hsl(46 100% 66%)", "hsl(30 100% 60%)", "ember", { glyph: "star", trail: "streak", motion: "spin", burst: "scatter" }],
  ["apex", "hsl(0 0% 100%)", GOLD, "star", { glyph: "eye", trail: "none", motion: "pulse", burst: "ring" }],
  ["starcrown-rain", "hsl(46 100% 72%)", "hsl(232 80% 70%)", "star", { glyph: "star", trail: "sparkle", motion: "spin", burst: "crack" }],
];
const kindOf = new Map([...ZENITH.moves, ...ZENITH_PHASES.flatMap((f) => f.moves)].map((m) => [m.id, m.kind]));
for (const [id, a, b, p, d] of looks) designLook(id, a, b, p, { kind: kindOf.get(id) ?? "projectile", ...d });

