import { useRouter } from "expo-router/build/hooks";
import Calendar from "@/components/Calendar";
import { StatusButton } from "@/components/Buttons";
import { Repeat } from "@/entities/Repeat";
import { FormContext } from "@/context/FormContext";
import { useContext } from "react";

export default function DateTimeOptions() {
  const router = useRouter();
  const { date, time, repeat, setDate, setTime, setRepeat, editingTemplate } = useContext(FormContext);

  // Show for templates even without date, for todos need date
  if (!date && !editingTemplate) return null;

  const handleTimePress = () => {
    if (!time) {
      setTime("09:00-10:00");
    }
    router.navigate("/time");
  };

  const handleRepeatPress = () => {
    if (!repeat) {
      const defaultType = editingTemplate ? "calendar" : "on-complete";
      setRepeat(new Repeat(defaultType, null));
    }
    router.navigate("/repeat");
  };

  const getTimeDisplay = () => {
    if (!time) return "none";
    if (time === "all-day") return "all-day";
    return time;
  };

  // Show calendar for todos, show repeat for templates, show time for both
  return (
    <>
      {date && !editingTemplate && <Calendar selectedDate={date} onDateSelect={setDate} />}
      <StatusButton label="time" onPress={handleTimePress}>
        {getTimeDisplay()}
      </StatusButton>
      {(date || editingTemplate) && (
        <StatusButton label="repeat" onPress={handleRepeatPress}>
          {repeat?.type ?? "none"}
        </StatusButton>
      )}
    </>
  );
}
