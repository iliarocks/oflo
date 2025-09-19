export type RepeatType = "on-complete" | "calendar";
export type RepeatUnit = "day" | "week" | "month" | "year";

export default class Repeat {
  type: RepeatType;
	unit: RepeatUnit;
	interval: number;

	constructor() {
    this.type = "on-complete";
		this.interval = 1;
		this.unit = "day";
	}

  withType(type: RepeatType): Repeat {
    return this.with({ type });
  }

	withUnit(unit: RepeatUnit): Repeat {
		return this.with({ unit });
	}

	withInterval(interval: number): Repeat {
		return this.with({ interval });
	}

	with(updates: Partial<Repeat>): Repeat {
		const newRepeat = Object.create(Repeat.prototype);
		return Object.assign(newRepeat, this, updates);
	}

	toString(): string {
		const { unit, interval } = this;
		let str = `every ${interval} ${unit}`;
		return str;
	}
}
