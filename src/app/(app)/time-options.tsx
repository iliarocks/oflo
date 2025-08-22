import { TextButton } from "@/components/Buttons";
import Header from "@/components/Header";
import View from "@/components/View";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { format } from "date-fns";

export default function TimeOptions() {
  const router = useRouter();

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      console.log(format(date, "HH:mm"));
    }
  };

  return (
    <View className="bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <DateTimePicker mode="time" value={new Date()} onChange={onChange} />
    </View>
  );
}
