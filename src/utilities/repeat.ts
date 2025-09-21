// ————————————————
// ———— TYPES —————

export type RepeatType = "relative" | "calendar";
export type RepeatUnit = "day" | "week" | "month" | "year";
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Repeat =
  | { type: "relative"; unit: RepeatUnit; interval: number }
  | { type: "calendar"; unit: Exclude<RepeatUnit, "week">; interval: number }
  | { type: "calendar"; unit: "week"; interval: number; on: WeekDayIndex[] };

// ——————————————————
// ———— CONSTANTS ————

export const DEFAULT_REPEAT: Repeat = {
  type: "relative",
  unit: "day",
  interval: 1,
};

export const DEFAULT_ON: WeekDayIndex[] = [0];

export const WEEKDAYS: Record<WeekDayIndex, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

// —————————————————
// ———— GETTERS ————

export function getNextType(repeat: Repeat) {
  return repeat.type === "calendar" ? "relative" : "calendar";
}

export function getNextUnit(repeat: Repeat) {
  const units: RepeatUnit[] = ["day", "week", "month", "year"];

  return units[(units.indexOf(repeat.unit) + 1) % units.length];
}

export function getNextOn(
  repeat: Extract<Repeat, { type: "calendar"; unit: "week" }>,
  last: WeekDayIndex,
) {
  const { on } = repeat;
  const indices: WeekDayIndex[] = [0, 1, 2, 3, 4, 5, 6];
  const availableIndices = indices.filter((i) => !on.includes(i));

  return availableIndices.find((d) => d > last) ?? availableIndices[0];
}

// —————————————————
// ———— SETTERS ————

export function setType(repeat: Repeat, type: RepeatType): Repeat {
  const { unit, interval } = repeat;

  if (unit === "week" && type === "calendar") {
    const on = "on" in repeat ? repeat.on : DEFAULT_ON;
    return { type, unit, interval, on };
  }

  return { type, unit, interval } as Repeat;
}

export function setUnit(repeat: Repeat, unit: RepeatUnit): Repeat {
  const { type, interval } = repeat;

  if (unit === "week" && type === "calendar") {
    return { type, unit, interval, on: DEFAULT_ON };
  }

  return { type, unit, interval } as Repeat;
}

export function setInterval(repeat: Repeat, interval: number): Repeat {
  return { ...repeat, interval };
}

export function setOn(repeat: Repeat, on: WeekDayIndex[]): Repeat {
  const { type, unit } = repeat;
  if (unit === "week" && type === "calendar") return { ...repeat, on };

  return repeat;
}

// —————————————————
// ———— HELPERS ————

export function repeatToString(repeat: Repeat) {
  const { unit, interval } = repeat;
  const plural = interval > 1;
  const base = `every ${plural ? interval : ""} ${unit}${plural ? "s" : ""}`;

  return base;
}
