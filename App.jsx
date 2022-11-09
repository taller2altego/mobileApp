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
import ReportTravel from "./components/travel/ReportTravel"
import TravelSearch from "./components/driver/TravelSearch"
import ProfileVisualization from "./components/main/profileVisualization"
import store from "./redux/store/store";
import { Provider } from "react-redux";
import ConfirmationTravel from "./components/travel/ConfirmationTravel";
import DriverSearch from "./components/travel/DriverSearch";
import DriverIncoming from "./components/travel/DriverIncoming";
import TripDetailsScreen from "./components/main/TripDetails";
import RecoverPassword from "./components/auth/recoverPassword";
import ResetPassword from "./components/auth/resetPassword";
import AuthToken from "./components/auth/authToken";

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
            name="DriverIncoming"
            component={DriverIncoming}
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
          <Stack.Screen
            name="TripDetails"
            component={TripDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RecoverPassword"
            component={RecoverPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AuthToken"
            component={AuthToken}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ReportTravel"
            component={ReportTravel}
            options={{ headerShown: false }}
          />     
          
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
