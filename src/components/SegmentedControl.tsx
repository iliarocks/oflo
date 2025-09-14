import { View } from "react-native";
import IconButton from "./IconButton";
import { usePathname, useRouter } from "expo-router";

export default function SegmentedControl() {
	const router = useRouter();

	const is = (path: string) => usePathname().endsWith(path);

	const goToIndex = () => router.navigate("/");
	const goToInbox = () => router.navigate("/inbox");
	const goToUpcoming = () => router.navigate("/upcoming");

	return (
		<View className="h-4xl flex-row rounded-full bg-neutral-50">
			<IconButton name="tray" active={is("/inbox")} onPress={goToInbox} />
			<IconButton name="sun.max" active={is("/")} onPress={goToIndex} />
			<IconButton
				name="calendar"
				active={is("/upcoming")}
				onPress={goToUpcoming}
			/>
		</View>
	);
}
