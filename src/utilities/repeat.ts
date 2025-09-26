// ————————————————
// ———— TYPES —————

export type RepeatVariant = "relative" | "calendar";
export type RepeatUnit = "day" | "week" | "month" | "year";
export type WeekDayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type Repeat =
	| { variant: "relative"; unit: RepeatUnit; interval: number }
	| { variant: "calendar"; unit: Exclude<RepeatUnit, "week">; interval: number }
	| { variant: "calendar"; unit: "week"; interval: number; on: WeekDayIndex[] };

// ——————————————————
// ———— CONSTANTS ————

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

export function getNextRepeatVariant(variant: RepeatVariant) {
	return variant === "calendar" ? "relative" : "calendar";
}

export function getNextRepeatUnit(unit: RepeatUnit) {
	const units: RepeatUnit[] = ["day", "week", "month", "year"];

	return units[(units.indexOf(unit) + 1) % units.length];
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

export function repeatWithVariant(
	repeat: Repeat,
	variant: RepeatVariant,
): Repeat {
	const { unit, interval } = repeat;

	if (unit === "week" && variant === "calendar") {
		const on = "on" in repeat ? repeat.on : DEFAULT_ON;
		return { variant, unit, interval, on };
	}

	return { variant, unit, interval } as Repeat;
}

export function repeatWithUnit(repeat: Repeat, unit: RepeatUnit): Repeat {
	const { variant, interval } = repeat;

	if (unit === "week" && variant === "calendar") {
		return { variant, unit, interval, on: DEFAULT_ON };
	}

	return { variant, unit, interval } as Repeat;
}

export function repeatWithInterval(repeat: Repeat, interval: number): Repeat {
	return { ...repeat, interval };
}

export function repeatWithOn(repeat: Repeat, on: WeekDayIndex[]): Repeat {
	const { variant, unit } = repeat;
	if (unit === "week" && variant === "calendar") return { ...repeat, on };

	return repeat;
}

// —————————————————
// ———— HELPERS ————

export function repeatToString(repeat: Repeat): string {
	const { unit, interval } = repeat;
	const plural = interval > 1;
	const base = `every ${plural ? interval + " " : ""}${unit}${plural ? "s" : ""}`;

	return base;
}
