import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/landing";
import RegisterScreen from "./components/auth/register";
import LoginScreen from "./components/auth/login";
import HomeScreen from "./components/home";

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
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DriverData" component={DriverData} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
