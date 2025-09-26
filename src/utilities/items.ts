import { startOfToday } from "date-fns";

// ———————————————
// ———— TYPES ————

export type ItemVariant = "event" | "todo";

// ———————————————————
// ———— CONSTANTS ————

export const DEFAULT_TODO = {
	date: null,
	repeat: null,
};

export const DEFAULT_EVENT = {
	date: startOfToday(),
	repeat: null,
};

// —————————————————
// ———— GETTERS ————

export function getNextVariant(variant: ItemVariant) {
	if (variant === "event") return "todo";

	return "event";
}
