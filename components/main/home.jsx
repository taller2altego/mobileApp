import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get, handlerUnauthorizedError } from "../../utils/requests";
import { useDispatch } from "react-redux";
import { setIsDriver, setUserData } from "../../redux/actions/UpdateUserData";

import * as SecureStore from "expo-secure-store";
import HomeTab from "./homeTab";
import ProfileTab from "./profileTab";
import envs from "../../config/env";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const { API_URL, _ } = envs;

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      get(`${API_URL}/users/${id}`, token)
        .then(({ data: { name, lastname, email, phoneNumber, isDriver } }) => {
          dispatch(setUserData({ name, lastname, email, phoneNumber }));
          dispatch(setIsDriver({ isDriver }));
        })
        .catch(error => handlerUnauthorizedError(navigation, error));
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
