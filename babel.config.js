export default function (api) {
  api.cache(true);
  return {
    presets: ["nativewind/babel", "babel-preset-expo"],
    plugins: ["react-native-reanimated/plugin"],
  };
}
