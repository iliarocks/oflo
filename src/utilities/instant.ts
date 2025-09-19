import { init, id as _id, User as _User } from "@instantdb/react-native";
import schema from "@/instant.schema";

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;

export const db = init({ appId: APP_ID, schema });

export const id = _id;
export type User = _User;
