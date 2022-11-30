import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { get } from "../../utils/requests";
import { useDispatch, useSelector } from "react-redux";
import {
  setDefaultLocation,
  setIsDriver,
  setUserData,
} from "../../redux/actions/UpdateUserData";
import { Ionicons } from "@expo/vector-icons";

import * as SecureStore from "expo-secure-store";
import HomeTab from "./homeTab";
import ProfileTab from "./profileTab";
import envs from "../../config/env";
import { setDriverData } from "../../redux/actions/UpdateDriverData";

export default function Home({ navigation }) {
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const currentUserData = useSelector((store) => store.userData);
  const { API_URL, _ } = envs;

  useEffect(() => {
    (async () => {
      console.log("ENTRO ACA");
      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/users/${id}`, token)
        .then(
          async ({
            data: {
              name,
              lastname,
              email,
              phoneNumber,
              isDriver,
              driverId,
              defaultAddress,
            },
          }) => {
            if (driverId) {
              await SecureStore.setItemAsync("driverId", driverId.toString());
            }
            dispatch(
              setUserData({
                name,
                lastname,
                email,
                phoneNumber: phoneNumber.toString(),
              })
            );
            dispatch(setDefaultLocation({ defaultLocation: defaultAddress }));
            dispatch(setIsDriver({ isDriver }));
          }
        )
        .then(async () => {
          if (currentUserData.isDriver === true) {
            const driver_id = await SecureStore.getItemAsync("driverId");
            await get(`${API_URL}/drivers/${driver_id}`, token).then(
              ({ data: { model, licensePlate, license } }) => {
                dispatch(setDriverData({ model, licensePlate, license }));
              }
            );
          }
        });
    })();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeTab}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileTab}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color="black"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
