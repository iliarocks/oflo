import { View, Alert } from "react-native";
import Header from "@/components/Header";
import { TextInput, ListSelect } from "@/components/Inputs";
import { TextButton } from "@/components/Buttons";
import DateTimeOptions from "@/components/DateTimeOptions";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { FormContext } from "@/context/FormContext";
import { db, id } from "@/utilities/database";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "@/hooks/useUser";

export default function Edit() {
  const router = useRouter();
  const user = useUser();
  const {
    editingTodo,
    editingTemplate,
    label,
    date,
    time,
    repeat,
    setLabel,
    setDate,
    reset,
  } = useContext(FormContext);

  const isTemplate = !!editingTemplate;
  const placeOptions = [
    { key: "inbox", value: null },
    { key: "date", value: date || new Date() },
  ];

  const handleSave = async () => {
    if (editingTodo) {
      await db.transact(
        db.tx.todos[editingTodo.id].update({
          label,
          date: date ? format(date, "yyyy-MM-dd") : null,
          time,
        })
      );
      close();
    } else if (editingTemplate) {
      // Check if repeat changed from original
      const repeatChanged = JSON.stringify(repeat) !== JSON.stringify(editingTemplate.repeat);
      
      if (repeatChanged) {
        // If repeat changed, only allow updating template
        Alert.alert(
          "Update Repeat",
          "Repeat changes can only be applied to the template.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Update Template",
              onPress: async () => {
                await db.transact(
                  db.tx.templates[editingTemplate.id].update({
                    label,
                    time,
                    repeat,
                  })
                );
                close();
              },
            },
          ]
        );
      } else {
        // If repeat didn't change, offer both options
        Alert.alert(
          "Save Changes",
          "Apply changes to template or just this instance?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Just This Instance",
              onPress: async () => {
                await db.transact(
                  db.tx.todos[id()].create({
                    label,
                    date: date ? format(date, "yyyy-MM-dd") : null,
                    time,
                    position: "a0",
                    completed: false,
                  }).link({ user: user.id })
                );
                close();
              },
            },
            {
              text: "Update Template",
              onPress: async () => {
                await db.transact(
                  db.tx.templates[editingTemplate.id].update({
                    label,
                    time,
                    repeat,
                  })
                );
                close();
              },
            },
          ]
        );
      }
    }
  };

  const handleDelete = () => {
    const message = isTemplate ? "Delete this template?" : "Delete this todo?";
    Alert.alert("Delete", message, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (editingTodo) {
            await db.transact(db.tx.todos[editingTodo.id].delete());
          } else if (editingTemplate) {
            await db.transact(db.tx.templates[editingTemplate.id].delete());
          }
          close();
        },
      },
    ]);
  };

  const close = () => {
    reset();
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 justify-between bg-neutral-50">
      <View className="gap-md">
        <Header>
          <TextButton onPress={close}>cancel</TextButton>
          <TextButton onPress={handleDelete}>delete</TextButton>
        </Header>
        <View className="gap-lg px-xl">
          <TextInput value={label || ""} label="label" onChangeText={setLabel} />
          {!isTemplate && (
            <ListSelect options={placeOptions} selected={date} onSelect={setDate} unique />
          )}
          {(date || isTemplate) && <DateTimeOptions />}
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={handleSave}>save</TextButton>
      </View>
    </SafeAreaView>
  );
}