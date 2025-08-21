export type Option = {
  key: string;
  value: any;
};

export type RepeatType = "todo" | "calendar";

export type RepeatUnit = "day" | "week" | "month" | "year";

export type RepeatData = {
  type: RepeatType;
  frequency: {
    unit: RepeatUnit;
    multiple: number;
    on?: number[];
  };
  reference: Date | null;
};
