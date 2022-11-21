import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get } from "../../utils/requests";
import { useDispatch } from "react-redux";
import { setIsDriver, setUserData } from "../../redux/actions/UpdateUserData";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import HomeTab from "./homeTab";
import ProfileTab from "./profileTab";
import envs from "../../config/env";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { handleNewNotification } from "../notifications/Notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      SecureStore.setItemAsync("pushToken", token)
    );
    const setIinitialData = async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      get(`${API_URL}/users/${id}`, token).then(
        ({ data: { name, lastname, email, phoneNumber, isDriver } }) => {
          dispatch(setUserData({ name, lastname, email, phoneNumber }));
          dispatch(setIsDriver({ isDriver }));
        }
      );
    };

    setIinitialData();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        throw new Error("Permission not granted!");
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      return token;
    } catch (error) {
      console.error(error);
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
  };

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Main"
        component={HomeTab}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileTab}
        options={({ navigation }) => ({
          headerShown: false,
        })}
      />
    </Tab.Navigator>
  );
}
