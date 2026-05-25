// Game-like progress layer on top of the CRMI calendar.
// All math is derived — no extra storage required.
import { TOTAL_WEEKS } from "./rotation";

export type LevelInfo = {
  level: number;
  title: string;
  xp: number;
  xpForNext: number;
  totalXp: number;
  pct: number;
};

const LEVEL_TITLES = [
  "Day 1 Intern",
  "Trainee Resident",
  "Junior Houseman",
  "Floor Specialist",
  "Senior Houseman",
  "Block Champion",
  "Multi-Specialty Pro",
  "Chief Intern",
  "Certification Ready",
];

// Each completed week = 100 XP. Total = 5,200 XP across 52 weeks.
// 9 levels with thresholds at every ~6 weeks.
const XP_PER_WEEK = 100;
const LEVEL_THRESHOLDS = [0, 6, 13, 19, 26, 33, 39, 45, 52].map((w) => w * XP_PER_WEEK);

export function levelFromWeeks(weeksCompleted: number): LevelInfo {
  const xp = weeksCompleted * XP_PER_WEEK;
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  const next = LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)];
  const prev = LEVEL_THRESHOLDS[level - 1];
  const span = Math.max(1, next - prev);
  const into = xp - prev;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
    xp,
    xpForNext: next,
    totalXp: TOTAL_WEEKS * XP_PER_WEEK,
    pct: Math.min(100, Math.round((into / span) * 100)),
  };
}

export type Badge = {
  code: string;
  label: string;
  icon: string; // emoji fallback; the UI can swap for SVG/Lucide
  earned: boolean;
  description: string;
};

export function badges(weeksCompleted: number, completedDeptCodes: Set<string>): Badge[] {
  return [
    { code: "first-day", label: "First Day", icon: "🩺", earned: weeksCompleted >= 1, description: "Reported on day one." },
    { code: "first-posting", label: "First Posting", icon: "📘", earned: completedDeptCodes.size >= 1, description: "Cleared first department." },
    { code: "block-1", label: "Block I Closed", icon: "🏥", earned: weeksCompleted >= 13, description: "Completed Block I." },
    { code: "halfway", label: "Halfway", icon: "⚡", earned: weeksCompleted >= 26, description: "26 weeks done." },
    { code: "three-quarter", label: "On The Home Stretch", icon: "🚀", earned: weeksCompleted >= 39, description: "39 weeks done." },
    { code: "full-year", label: "Internship Champion", icon: "🏆", earned: weeksCompleted >= 52, description: "All 52 weeks complete." },
    { code: "all-blocks", label: "All Four Blocks", icon: "🎖️", earned: completedDeptCodes.size >= 17, description: "Completed every department." },
  ];
}
