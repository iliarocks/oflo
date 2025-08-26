import { TextButton } from "@/components/Buttons";
import FormSection from "@/components/FormSection";
import Header from "@/components/Header";
import { ListSelect, TimeInput } from "@/components/Inputs";
import View from "@/components/View";
import { useRouter } from "expo-router";
import {useContext} from "react";
import {TodoContext} from "@/context/TodoContext";

const OPTIONS = {
  type: [
    { key: "interval", value: true },
    { key: "none", value: null },
  ],
};

export default function TimeOptions() {
  const router = useRouter();
  const {time, setTime} = useContext(TodoContext);

  return (
    <View className="gap-md bg-neutral-0" grow safe>
      <Header>
        <TextButton onPress={router.back}>done</TextButton>
      </Header>
      <View className="gap-lg px-xl">
        <FormSection title="type">
          <ListSelect options={OPTIONS.type} selected={null} onSelect={() => {}} unique />
        </FormSection>
        <TimeInput label="start"/>
        <TimeInput label="end"/>
      </View>
    </View>
  );
}
