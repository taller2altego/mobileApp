import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get } from "../../utils/requests";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions/UpdateUserData";

import * as SecureStore from "expo-secure-store";
import HomeTab from "./homeTab";
import ProfileTab from "./profileTab";
import ProfileVisualization from "./profileVisualization";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      get(`http://10.0.2.2:5000/users/${id}`, token).then(
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
      <Tab.Screen
        name="Buscar"
        component={ProfileVisualization}
        options={({ navigation }) => ({
          headerShown: false
        })
        }
      />
    </Tab.Navigator>
  );
}
