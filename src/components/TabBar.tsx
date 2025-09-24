import { MenuView, NativeActionEvent } from "@react-native-menu/menu";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import COLOR from "@/constants/color";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const navigationMenuItems = [
	{ id: "/upcoming", title: "Upcoming" },
	{ id: "/", title: "Today" },
	{ id: "/inbox", title: "Inbox", imageSystemName: "tray" },
];

const extraMenuItems = [
	{ id: "signOut", title: "Sign out", attributes: { destructive: true } },
];

export default function TabBar() {
	const { user, signOut } = useContext(AuthContext);
	const router = useRouter();
	const iconProps = { tintColor: COLOR["text-0"], size: 24 };

	const handleNavigation = ({ nativeEvent }: NativeActionEvent) => {
		router.navigate(nativeEvent.event);
	};

	const handleExtra = ({ nativeEvent }: NativeActionEvent) => {
		if (nativeEvent.event === "signOut") signOut();
	};

	const handleCreate = () => router.navigate("/create");

	return (
		<View className="w-full bg-neutral-50 absolute bottom-0 pb-safe">
			<View className="flex-row justify-between pt-xl pb-md px-4xl">
				<MenuView
					onPressAction={handleNavigation}
					actions={navigationMenuItems}
				>
					<SymbolView name="list.bullet" {...iconProps} />
				</MenuView>
				<Pressable onPress={handleCreate}>
					<SymbolView name="square.and.pencil" {...iconProps} />
				</Pressable>
				<MenuView
					onPressAction={handleExtra}
					title={user?.email}
					actions={extraMenuItems}
				>
					<SymbolView name="ellipsis" {...iconProps} />
				</MenuView>
			</View>
		</View>
	);
}
