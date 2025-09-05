import Text from "@/components/Text";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo, useState } from "react";
import { Pressable } from "react-native";
import { View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SWIPE_THRESHOLD = 50;

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const selected = selectedDate;
  const [viewDate, setViewDate] = useState<Date>(selected);

  const weeks = useMemo(() => buildMonthMatrix(viewDate), [viewDate]);

  const swipeGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-SWIPE_THRESHOLD, SWIPE_THRESHOLD])
    .onEnd((event) => {
      const direction = event.translationX > 0 ? -1 : 1;
      setViewDate((date) => addMonths(date, direction));
    });

  return (
    <View className="gap-lg border border-neutral-75 bg-neutral-25 p-md">
      <View className="flex-row justify-between">
        <Text color="50">{format(viewDate, "LLL").toLowerCase()}</Text>
        <Text color="50">{format(viewDate, "yyyy")}</Text>
      </View>
      <GestureDetector gesture={swipeGesture}>
        <View className="gap-lg">
          {weeks.map((week, i) => (
            <View key={i} className="flex-row justify-between">
              {week.map((date, k) => {
                return (
                  <DayCell
                    key={k}
                    date={date}
                    isOutside={!isSameMonth(date, viewDate)}
                    isSelected={isSameDay(date, selected)}
                    onPress={onDateSelect}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </GestureDetector>
    </View>
  );
}

interface DayCellProps {
  date: Date;
  isOutside: boolean;
  isSelected: boolean;
  onPress: (date: Date) => void;
}

function DayCell({ date, isOutside, isSelected, onPress }: DayCellProps) {
  const baseStyles = "aspect-square justify-center items-center h-2xl";
  const invisibleStyles = isOutside ? "opacity-30" : "";
  const activeStyles = isSelected ? "bg-primary-50" : "";

  const handlePress = () => {
    onPress(date);
  };

  return (
    <Pressable
      disabled={isOutside}
      onPress={handlePress}
      className={[baseStyles, invisibleStyles, activeStyles].join(" ")}
    >
      <Text color={isSelected ? "25" : "75"}>{format(date, "d")}</Text>
    </Pressable>
  );
}

function buildMonthMatrix(viewDate: Date) {
  const start = startOfWeek(startOfMonth(viewDate));
  const end = endOfWeek(endOfMonth(viewDate));
  const days = eachDayOfInterval({ start, end });

  const weeks: Date[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
}
