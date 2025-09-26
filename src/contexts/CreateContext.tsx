import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
	getNextRepeatUnit,
	getNextRepeatVariant,
	repeatWithUnit,
	repeatWithVariant,
	type Repeat,
} from "@/utilities/repeat";
import { AuthContext } from "./AuthContext";
import {
	DEFAULT_EVENT,
	DEFAULT_TODO,
	getNextVariant,
	ItemVariant,
} from "@/utilities/items";

type CreateState = {
	variant: ItemVariant;
	label: string;
	notes: string;
	date: Date | null;
	repeat: Repeat | null;
	setVariant: (variant: ItemVariant) => void;
	setLabel: (label: string) => void;
	setNotes: (notes: string) => void;
	setDate: (date: Date | null) => void;
	setRepeat: (repeat: Repeat | null) => void;
	push: () => void;
	reset: () => void;
	resetDate: () => void;
	resetRepeat: () => void;
	toggleVariant: () => void;
	toggleRepeatVariant: () => void;
	cycleRepeatUnit: () => void;
	initializeRepeat: () => void;
};

export const CreateContext = createContext<CreateState>({
	variant: "todo",
	label: "",
	notes: "",
	date: null,
	repeat: null,
	setVariant: () => {},
	setLabel: () => {},
	setNotes: () => {},
	setDate: () => {},
	setRepeat: () => {},
	push: () => {},
	reset: () => {},
	resetDate: () => {},
	resetRepeat: () => {},
	toggleVariant: () => {},
	toggleRepeatVariant: () => {},
	cycleRepeatUnit: () => {},
	initializeRepeat: () => {},
});

export function CreateProvider({ children }: PropsWithChildren) {
	const [variant, setVariant] = useState<ItemVariant>("todo");
	const [label, setLabel] = useState<string>("");
	const [notes, setNotes] = useState<string>("");
	const [date, setDate] = useState<Date | null>(null);
	const [repeat, setRepeat] = useState<Repeat | null>(null);
	const { user } = useContext(AuthContext);

	const push = async () => {
		if (!user) return;

		console.log("Label: ", label);
		console.log("Notes: ", notes);
		console.log("Date: ", date);
		console.log("Repeat: ", repeat);
		reset();
	};

	const reset = () => {
		setVariant("todo");
		setLabel("");
		setNotes("");
		setDate(null);
		setRepeat(null);
	};

	const resetDate = () => {
		if (variant === "event") setDate(DEFAULT_EVENT.date);

		if (variant === "todo") setDate(DEFAULT_TODO.date);
	};

	const resetRepeat = () => {
		setRepeat(null);
	};

	const toggleVariant = () => {
		const next = getNextVariant(variant);

		setVariant(next);

		if (next === "event") {
			setDate(DEFAULT_EVENT.date);
			setRepeat(DEFAULT_EVENT.repeat);
		}

		if (next === "todo") {
			setDate(DEFAULT_TODO.date);
			setRepeat(DEFAULT_EVENT.repeat);
		}
	};

	const toggleRepeatVariant = () => {
		if (!repeat || variant === "event") return;

		const next = getNextRepeatVariant(repeat.variant);

		setRepeat(repeatWithVariant(repeat, next));
	};

	const cycleRepeatUnit = () => {
		if (!repeat) return;

		const next = getNextRepeatUnit(repeat.unit);

		setRepeat(repeatWithUnit(repeat, next));
	};

	const initializeRepeat = () => {
		setRepeat({
			variant: variant === "todo" ? "relative" : "calendar",
			unit: "day",
			interval: 1,
		});
	};

	return (
		<CreateContext.Provider
			value={{
				variant,
				label,
				notes,
				date,
				repeat,
				setVariant,
				setLabel,
				setNotes,
				setDate,
				setRepeat,
				push,
				reset,
				resetDate,
				resetRepeat,
				toggleVariant,
				toggleRepeatVariant,
				cycleRepeatUnit,
				initializeRepeat,
			}}
		>
			{children}
		</CreateContext.Provider>
	);
}
