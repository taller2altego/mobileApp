import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ReportTravel from "./components/travel/ReportTravel";
import LandingScreen from "./components/auth/landing";
import RegisterModal from "./components/auth/register";
import LoginModal from "./components/auth/login";
import HomeScreen from "./components/main/home";
import DriverScreen from "./components/auth/driver";
import TravelInProgress from "./components/travel/TravelInProgress";
import TravelSearch from "./components/driver/TravelSearch";
import DriverProfileVisualization from "./components/main/DriverProfileVisualization";
import UserProfileVisualization from "./components/driver/UserProfileVisualization";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import ConfirmationTravel from "./components/travel/ConfirmationTravel";
import DriverIncoming from "./components/travel/DriverIncoming";
import TravelFindedModal from "./components/driver/TravelFindedModal";
import RateUser from "./components/driver/RateUser";
import TravelInProgressDriver from "./components/driver/TravelInProgressDriver";
import TripDetailsScreen from "./components/main/TripDetails";
import RecoverPassword from "./components/auth/recoverPassword";
import ResetPassword from "./components/auth/resetPassword";
import AuthToken from "./components/auth/authToken";
import DefaultLocationRequest from "./components/auth/DefaultLocationRequest";

import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { get } from "./utils/requests";
import envs from "./config/env";
const { API_URL, _ } = envs;

const Stack = createNativeStackNavigator();

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let interval = undefined;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (interval !== undefined) {
      clearInterval(interval);
    }

    if (location) {
      console.log(location);

      const updatePositionIsRequired = await SecureStore.getItemAsync('updatingLocation');

      if (updatePositionIsRequired) {
        await SecureStore.setItemAsync("updatingLocation", JSON.stringify({ driverLocation: location.coords }));
      } else {
        interval = setInterval(async () => {
          const flag = await SecureStore.getItemAsync('askForTravel');
  
          console.log(flag);
  
          if (flag === 'true') {
            const token = await SecureStore.getItemAsync("token");
            const pushToken = await SecureStore.getItemAsync("pushToken");
  
            const url = `${API_URL}/travels?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&token=${pushToken}`;
            await get(url, token)
              .then(({ data: { data } }) => data)
              .then(data => SecureStore.setItemAsync('travelInfo', JSON.stringify({ ...data, driverLocation: location.coords })))
              .then(() => {});
          }
  
        }, 20000);
      }
    }
  }
});

export default function App() {
  const startBackgroundUpdate = async () => {
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }
  
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
      console.log("Task is not defined");
      return;
    }
  
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
  
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    }
  
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.BestForNavigation,
      showsBackgroundLocationIndicator: true,
      distanceInterval: 100,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      }
    })
    .catch(() => Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.BestForNavigation,
        showsBackgroundLocationIndicator: true,
        distanceInterval: 100,
        foregroundService: {
          notificationTitle: "Location",
          notificationBody: "Location tracking in background",
          notificationColor: "#fff",
        }
      })
    )
    .then(res => res);
  }
  
  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
  }
  
  requestPermissions()
    .then(() => startBackgroundUpdate())
    .then(() => {});

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
            name="DefaultLocationRequest"
            component={DefaultLocationRequest}
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
            name="TravelInProgressDriver"
            component={TravelInProgressDriver}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverIncoming"
            component={DriverIncoming}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DriverProfileVisualization"
            component={DriverProfileVisualization}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TravelSearch"
            component={TravelSearch}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="TravelFindedModal"
            component={TravelFindedModal}
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
          <Stack.Screen
            name="UserProfileVisualization"
            component={UserProfileVisualization}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RateUser"
            component={RateUser}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}