export type RepeatType = "on-complete" | "calendar";
export type RepeatUnit = "day" | "week" | "month" | "year";

export class Repeat {
  type: RepeatType;
  frequency: {
    unit: RepeatUnit;
    interval: number;
    on?: number[];
  };
  reference: Date | null;

  constructor(type: RepeatType, reference: Date | null) {
    this.type = type;
    this.frequency = {
      unit: "day",
      interval: 1,
      ...(type === "calendar" && { on: [0] }),
    };
    this.reference = reference;
  }

  withUnit(unit: RepeatUnit): Repeat {
    return this.with({ frequency: { ...this.frequency, unit } });
  }

  withInterval(interval: number): Repeat {
    return this.with({ frequency: { ...this.frequency, interval } });
  }

  withOn(on: number[]): Repeat {
    return this.with({ frequency: { ...this.frequency, on } });
  }

  with(updates: Partial<Repeat>): Repeat {
    const newRepeat = Object.create(Repeat.prototype);
    return Object.assign(newRepeat, this, updates, {
      frequency: updates.frequency ? { ...this.frequency, ...updates.frequency } : this.frequency,
    });
  }

  toString(): string {
    const { unit, interval, on } = this.frequency;
    let str = `every ${interval} ${unit}`;
    if (on && on.length > 0) {
      str += ` on ${on.join(",")}`;
    }
    return str;
  }
}
