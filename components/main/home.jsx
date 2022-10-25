import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get } from "../../utils/requests";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";
import Config from "react-native-config";

import * as SecureStore from "expo-secure-store";
import HomeTab from "./homeTab";
import ProfileTab from "./profileTab";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      get(`${Config.URL_DEV}/users/${id}`, token).then(
        ({ data: { name, lastname, email, phoneNumber } }) =>
          dispatch(setUserData({ name, lastname, email, phoneNumber }))
      );
    })();
  }, []);

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
          headerShown: false
        })
        }
      />
    </Tab.Navigator>
  );
}
