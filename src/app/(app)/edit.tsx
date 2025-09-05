import Header from "@/components/Header";
import { format } from "date-fns";
import { View } from "react-native";
import Text from "@/components/Text";
import { TextInput, ListSelect } from "@/components/Inputs";
import { useRouter } from "expo-router/build/hooks";
import { useContext, useState } from "react";
import Calendar from "@/components/Calendar";
import { StatusButton, TextButton } from "@/components/Buttons";
import { EditContext } from "@/context/EditContext";
import { Option } from "@/utilities/types";
import { startOfToday } from "date-fns";
import { Repeat } from "@/entities/Repeat";
import { db, id } from "@/utilities/database";
import { useUser } from "@/hooks/useUser";
import { generateKeyBetween } from "fractional-indexing";
import _ from "lodash";
import { Alert } from "react-native";

export default function Edit() {
  const router = useRouter();
  const {
    editingTodo,
    editingTemplate,
    label,
    date,
    time,
    repeat,
    setLabel,
    setDate,
    setTime,
    setRepeat,
    resetEdit,
  } = useContext(EditContext);
  const user = useUser();
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);

  const handleSave = async () => {
    if (editingTodo) {
      // Update existing todo
      await db.transact(
        db.tx.todos[editingTodo.id].update({
          label: label,
          date: date ? format(date, "yyyy-MM-dd") : null,
          time: time,
        }),
      );
      close();
    } else if (editingTemplate) {
      // Show options for template editing
      setShowTemplateOptions(true);
    }
  };

  const handleTemplateUpdate = async (instanceOnly: boolean) => {
    if (!editingTemplate) return;

    if (instanceOnly) {
      // Create a todo instance from the template with edits
      const { data } = await db.queryOnce({
        todos: {
          $: {
            where: {
              user: user.id,
            },
          },
        },
      });

      const first = _.orderBy(data.todos, ["position"], ["asc"])[0]?.position ?? null;
      const todoId = id();
      const todo = {
        label: label,
        date: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        time: time,
        completed: false,
        position: generateKeyBetween(null, first),
      };
      await db.transact(
        db.tx.todos[todoId].create(todo).link({ user: user.id, template: editingTemplate.id }),
      );
    } else {
      // Update the template itself
      const repeatData = repeat
        ? {
            type: repeat.type,
            frequency: repeat.frequency,
            reference: repeat.reference ? format(repeat.reference, "yyyy-MM-dd") : null,
          }
        : editingTemplate.repeat;

      await db.transact(
        db.tx.templates[editingTemplate.id].update({
          label: label,
          time: time,
          date: date ? format(date, "yyyy-MM-dd") : null,
          repeat: repeatData,
        }),
      );
    }
    close();
  };

  const handleDelete = () => {
    Alert.alert("Delete", editingTodo ? "Delete this todo?" : "Delete this template?", [
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
    resetEdit();
    setShowTemplateOptions(false);
    router.back();
  };

  const openTime = () => {
    // Time-options will now use EditContext since we have editingTodo or editingTemplate set
    router.push({ pathname: "/time-options", params: { mode: "edit" } });
  };

  const openRepeat = () => {
    // Initialize repeat if it doesn't exist
    if (!repeat && editingTemplate) {
      setRepeat(new Repeat("calendar"));
    } else if (!repeat) {
      setRepeat(new Repeat("todo"));
    }
    // Repeat-options will now use EditContext since we have editingTodo or editingTemplate set
    router.push({ pathname: "/repeat-options", params: { mode: "edit" } });
  };

  const getTimeLabel = () => {
    if (!time) return "time";
    if (time === "all-day") return "all-day";
    return time;
  };

  const placeOptions: Option[] = [
    { key: "inbox", value: null },
    { key: "date", value: date || startOfToday },
  ];

  if (showTemplateOptions) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <View className="gap-lg px-xl">
          <Text type="title" size="lg">
            Apply changes to:
          </Text>
          <View className="gap-md">
            <TextButton onPress={() => handleTemplateUpdate(false)}>
              Template (all future occurrences)
            </TextButton>
            <TextButton onPress={() => handleTemplateUpdate(true)}>Just this instance</TextButton>
            <TextButton onPress={() => setShowTemplateOptions(false)}>Cancel</TextButton>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-between bg-neutral-50">
      <View className="gap-md">
        <Header>
          <TextButton onPress={close}>cancel</TextButton>
          <TextButton onPress={handleDelete}>delete</TextButton>
        </Header>
        <View className="gap-lg px-xl">
          <View className="gap-sm">
            <Text style="secondary">label</Text>
            <TextInput value={label ?? ""} onChangeText={setLabel} />
          </View>
          {!editingTemplate && (
            <ListSelect options={placeOptions} selected={date} onSelect={setDate} unique />
          )}
          {(date || editingTemplate) && (
            <DateOptions
              repeat={repeat}
              date={date || new Date()}
              setRepeat={setRepeat}
              onDateChange={setDate}
              openTime={openTime}
              openRepeat={openRepeat}
              getTimeLabel={getTimeLabel}
              isTemplate={!!editingTemplate}
            />
          )}
        </View>
      </View>
      <View className="px-xl">
        <TextButton onPress={handleSave}>save</TextButton>
      </View>
    </View>
  );
}

type DateOptionsProps = {
  repeat: Repeat | null;
  date: Date;
  setRepeat: (repeat: Repeat | null) => void;
  onDateChange: (date: Date) => void;
  openTime: () => void;
  openRepeat: () => void;
  getTimeLabel: () => string;
  isTemplate: boolean;
};

function DateOptions({
  repeat,
  date,
  onDateChange,
  openTime,
  openRepeat,
  getTimeLabel,
  isTemplate,
}: DateOptionsProps) {
  return (
    <>
      {!isTemplate && <Calendar selectedDate={date} onDateSelect={onDateChange} />}
      <StatusButton status={getTimeLabel() !== "time" ? "active" : "none"} onPress={openTime}>
        {getTimeLabel()}
      </StatusButton>
      {isTemplate && (
        <StatusButton status={repeat ? repeat.type : "none"} onPress={openRepeat}>
          repeat
        </StatusButton>
      )}
    </>
  );
}

