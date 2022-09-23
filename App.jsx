import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/landing";
import RegisterModal from "./components/auth/register";
import LoginModal from "./components/auth/login";
import HomeScreen from "./components/main/home";
import DriverScreen from "./components/auth/driver";

const Stack = createStackNavigator();

export default function App(props) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        <Stack.Screen
          name="Landing"
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterModal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginModal}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Driver"
          component={DriverScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
