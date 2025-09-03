import { RepeatData, RepeatType, RepeatUnit } from "@/utilities/types";

export class Repeat {
  type: RepeatType;
  frequency: {
    unit: RepeatUnit;
    multiple: number;
    on?: number[];
  };
  reference: Date | null;

  constructor(type: RepeatType, reference: Date | null = null) {
    this.type = type;
    this.frequency = {
      unit: "day",
      multiple: 1,
      ...(type === "calendar" && { on: [0] }),
    };
    this.reference = reference;
  }

  withUnit(unit: RepeatUnit): Repeat {
    return this.with({ frequency: { ...this.frequency, unit } });
  }

  withMultiple(multiple: number): Repeat {
    return this.with({ frequency: { ...this.frequency, multiple } });
  }

  withOn(on: number[]): Repeat {
    return this.with({ frequency: { ...this.frequency, on } });
  }

  with(updates: Partial<RepeatData>): Repeat {
    const newRepeat = Object.create(Repeat.prototype);
    return Object.assign(newRepeat, this, updates, {
      frequency: updates.frequency
        ? { ...this.frequency, ...updates.frequency }
        : this.frequency,
    });
  }

  toString(): string {
    const { unit, multiple, on } = this.frequency;
    let str = `every ${multiple} ${unit}`;
    if (on && on.length > 0) {
      str += ` on ${on.join(",")}`;
    }
    return str;
  }
}
