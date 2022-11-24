import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ReportTravel from "./components/travel/ReportTravel";
import LandingScreen from "./components/auth/landing";
import RegisterModal from "./components/auth/register";
import LoginModal from "./components/auth/login";
import HomeScreen from "./components/main/home";
import DriverScreen from "./components/auth/driver";
import TravelSearch from "./components/driver/TravelSearch";
import ProfileVisualization from "./components/main/profileVisualization";
import store from "./redux/store/store";
import { Provider } from "react-redux";
import ConfirmationTravel from "./components/travel/ConfirmationTravel";
import DriverSearch from "./components/travel/DriverSearch";
import DriverIncoming from "./components/travel/DriverIncoming";
import TravelFindedModal from "./components/driver/TravelFindedModal";
import TravelInProgressDriver from "./components/driver/TravelInProgressDriver";
import TripDetailsScreen from "./components/main/TripDetails";
import RecoverPassword from "./components/auth/recoverPassword";
import ResetPassword from "./components/auth/resetPassword";
import AuthToken from "./components/auth/authToken";

import * as SecureStore from "expo-secure-store";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

import { get } from "./utils/requests";
import envs from "./config/env";
const { API_URL, _ } = envs;

const Stack = createNativeStackNavigator();

const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;
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
      interval = setInterval(async () => {
        console.log(`estoy buscando un travel después de 10 segundos con las coords: ${JSON.stringify(location.coords, undefined, 2)}`);
        const flag = await SecureStore.getItemAsync('askForTravel');

        if (flag === 'true') {
          const token = await SecureStore.getItemAsync("token");
          const pushToken = await SecureStore.getItemAsync("pushToken")
          const url = `${API_URL}/travels?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&token=${pushToken}`;
          console.log("HAGO REQUEST");
          await get(url, token)
            .then(({ data: { data } }) => {
              console.log(data);
              return data;
            })
            .then(data => SecureStore.setItemAsync('travelInfo'. JSON.stringify(data)))
            .then(response => {
              console.log(response);
            });
        } else {
          console.log('La busqueda no ha iniciado');
        }

      }, 20000);
    }
  }
});

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
    console.log("Already started");
    return;
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
  .then(() => {
    console.log(response => {
      console.log('startLocationUpdatesAsync');
      console.log(response);
    })
  });
}

const requestPermissions = async () => {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
}

requestPermissions()
  .then(response => {
    console.log('requestPermission');
    console.log(response);
  })
  .then(() => {
    return startBackgroundUpdate()
  })
  .then(response => {
    console.log(response);
  });

export default function App() {
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}