import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from "./components/auth/landing";
import RegisterModal from "./components/auth/register";
import LoginModal from "./components/auth/login";
import HomeScreen from "./components/main/home";
import DriverScreen from "./components/auth/driver";
import TravelInProgress from "./components/travel/TravelInProgress"
import TravelSearch from "./components/driver/TravelSearch"
import ProfileVisualization from "./components/main/profileVisualization"
import store from "./redux/store/store";
import { Provider } from "react-redux";
import ConfirmationTravel from "./components/travel/ConfirmationTravel";
import DriverSearch from "./components/travel/DriverSearch";


const Stack = createNativeStackNavigator();

export default function App(props) {
  return (
    <Provider store={store}>
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
            name="ConfirmationTravel"
            component={ConfirmationTravel}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverSearch"
            component={DriverSearch}
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
          <Stack.Screen
            name="TravelInProgress"
            component={TravelInProgress}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProfileVisualization"
            component={ProfileVisualization}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TravelSearch"
            component={TravelSearch}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
