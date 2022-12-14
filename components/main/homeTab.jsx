import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  FlatList,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import * as SecureStore from "expo-secure-store";
import envs from "../../config/env";
import { useFocusEffect } from '@react-navigation/native';

import { Homestyles, Profilestyles } from "../styles";
import TravelItem from "../travel/TravelItem";
import { setTravelDetails, setTravelInfo } from "../../redux/actions/UpdateTravelDetails";
import { get, handlerUnauthorizedError } from "../../utils/requests";

import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeTab({ navigation }) {
  // redux
  const currentUserData = useSelector((store) => store.userData);
  const dispatch = useDispatch();

  // envs
  const { API_URL, GOOGLE_API_KEY } = envs;

  // state
  const originRef = useRef();
  const destinationRef = useRef();
  const [srcDetails, setSrcDetails] = useState("");
  const [destDetails, setDestDetails] = useState("");
  const [data_travels, setData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [correctSrcInput, setCorrectSrcInput] = useState(true);
  const [correctDestInput, setCorrectDestInput] = useState(false);

  const handleSelectedTrip = (item) => {
    setSelectedId(item.id);
    const travelId = item._id;
    navigation.navigate("TripDetails", { travelId });
  };

  function renderItem({ item }) {
    const backgroundColor = item.id === selectedId ? "#f2f2f200" : "white";
    return (
      <TravelItem
        item={item}
        onPress={() => handleSelectedTrip(item)}
        backgroundColor={{ backgroundColor }}
      />
    );
  }

  useEffect(() => {
    if (currentUserData.defaultLocation.address) {
      originRef.current?.setAddressText(currentUserData.defaultLocation.address)
    }

    setSrcDetails({
      latitude: currentUserData.defaultLocation.latitude,
      longitude: currentUserData.defaultLocation.longitude,
    });
  }, [currentUserData]);

  useEffect(() => {
    (async () => {
      await SecureStore.deleteItemAsync('askForTravel');
      await registerForPushNotificationsAsync()
        .then(async token => {
          
          console.log(token);
          await SecureStore.setItemAsync("pushToken", token);
        })
        .catch(err => console.log(err));

      const id = await SecureStore.getItemAsync("id");
      const token = await SecureStore.getItemAsync("token");
      const params = { page: 1, limit: 4 };
      await get(`${API_URL}/travels/users/${id}`, token, {}, params)
        .then(({ data: { data } }) => {
          const dataFiltered = data.filter(item => item.status === 'finished');
          setData(dataFiltered);
        })
        .catch(err => handlerUnauthorizedError(navigation, err));
    })();
  }, []);

  const onConfirmationTravel = () => {
    let originAddress = originRef.current?.getAddressText().split(",")[0];
    let destinationAddress = destinationRef.current?.getAddressText().split(",")[0];
    dispatch(
      setTravelDetails({ origin: srcDetails, destination: destDetails  })
    );
    dispatch(setTravelInfo({originAddress: originAddress, destinationAddress: destinationAddress}))
    navigation.navigate("ConfirmationTravel");
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("Permission not granted!");
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C"
        });
      }

      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <View
      style={[styles.container, { flexDirection: "column" }]}
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <ScrollView keyboardShouldPersistTaps={"handled"}>
          <View style={[{ flex: 0.3 }]}></View>
          <View style={[{ flex: 0.5, alignItems: "center" }]}>
            <Text
              style={{
                fontSize: 30,
                padding: 25,
                paddingBottom: 10,
                fontFamily: "poppins-bold",
              }}
            >
              Actividades
            </Text>
          </View>
          <View style={[{ flex: 0.2 }]}></View>

          <View style={{ flex: 3 }}>
            <FlatList
              data={data_travels}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              extraData={selectedId}
            />
          </View>

          <View style={[{ flex: 1, padding: 20 }]}>
            <GooglePlacesAutocomplete
              ref={originRef}
              styles={{ textInput: Homestyles.searchInput, flex: 1 }}
              placeholder="Punto de partida"
              fetchDetails
              enablePoweredByContainer={false}
              textInputProps={{
                onChangeText: (text) => {
                  if (text != "") {
                    setCorrectSrcInput(false);
                  }
                },
              }}
              listEmptyComponent={() => (
                <View style={{ flex: 1 }}>
                  <Text>No se encontraron resultados</Text>
                </View>
              )}
              onPress={(data, details) => {
                setCorrectSrcInput(true);
                setSrcDetails({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: "en",
              }}
            />
            <GooglePlacesAutocomplete
              ref={destinationRef}
              styles={{ textInput: Homestyles.searchInput, flex: 1 }}
              placeholder="Punto de llegada"
              fetchDetails
              enablePoweredByContainer={false}
              textInputProps={{
                onChangeText: (_) => {
                  setCorrectDestInput(false);
                },
              }}
              listEmptyComponent={() => (
                <View style={{ flex: 1 }}>
                  <Text>No se encontraron resultados</Text>
                </View>
              )}
              onPress={(data, details) => {
                setCorrectDestInput(true);
                setDestDetails({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: "en",
              }}
            />
            {currentUserData.isDriver && (
              <View style={Profilestyles.edit_profile_button_container}>
                <Pressable
                  onPress={() => {
                    navigation.navigate("TravelSearch");
                  }}
                  style={Profilestyles.edit_profile_button}
                >
                  <Text style={[Profilestyles.edit_button_text, {fontFamily: "poppins"}]}>
                    Iniciar trabajo
                  </Text>
                </Pressable>
              </View>
            )}
            <Button
              title="Confirmar viaje"
              color="#696c6e"
              disabled={!correctSrcInput || !correctDestInput}
              onPress={() => onConfirmationTravel()}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
