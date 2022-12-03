import { useState, useCallback } from "react";
import { MapStyles, TravelStyles } from "../styles";
import { View, Text, Pressable } from "react-native";
import { get, patch, handlerUnauthorizedError } from "../../utils/requests";
import { AirbnbRating } from "react-native-ratings";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import envs from "../../config/env";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

export default function TripDetails({ route, navigation }) {
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [price, setPrice] = useState();
  const [driver, setDriver] = useState();
  const [date, setDate] = useState();
  const [driverScore, setDriverScore] = useState();
  const { API_URL, _ } = envs;

  useFocusEffect(useCallback(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/travels/${route.params.travelId}`, token).then(
        ({ data: { data } }) => {
          if (data.driverScore != 0) {
            setAlreadyRated(true);
          }
          setSource(data.sourceAddress);
          setDestination(data.destinationAddress);
          setDriver(data.driverId);
          setPrice(data.price);
          setDate(data.date);
          setDriverScore(data.driverScore);
        }
      ).then(err => handlerUnauthorizedError(navigation, err));
    })();
  }, []));

  const sendRatingToDriver = async () => {
    const token = await SecureStore.getItemAsync("token");
    setAlreadyRated(true);
    return patch(`${API_URL}/drivers/${driver}`, token, {
      score: driverScore,
    }).then(() => {
      return patch(`${API_URL}/travels/${route.params.travelId}`, token, {
        driverScore,
      }).then(() => {
        navigation.navigate("Home");
      }).catch(error => functionError(navigation, error));
    }).catch(error => functionError(navigation, error));
  };

  const months = {
    January: 1,
    February: 2,
    March: 3,
    April: 4,
    May: 5,
    June: 6,
    July: 7,
    August: 8,
    September: 9,
    October: 10,
    November: 11,
    December: 12,
  };

  const a = moment(date);
  const year = a.format("YYYY");
  const month = a.format("MMMM");
  const day = a.format("DD");

  const sendReport = (navigation) => {
    const dateTravel = `${day}/${months[month]}/${year}`;
    const { travelId } = route.params;
    navigation.navigate("ReportTravel", {
      travelId,
      destination,
      dateTravel,
      driver,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Ionicons
        name="arrow-back"
        size={24}
        color="black"
        style={{ top: 35, left: 15 }}
        onPress={() => navigation.navigate("Home")}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          left: 30,
        }}
      >
        <View>
          <Text
            style={{
              fontFamily: "poppins-bold",
              fontSize: 25,
              marginBottom: 30,
            }}
          >
            Informacion Del Viaje
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 18 }}>{source}</Text>
          <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
            {destination}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
            {price + "$"}
          </Text>
          <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
            {day}/{months[month]}/{year}
          </Text>
        </View>
      </View>
      <Text
        style={{
          fontFamily: "poppins",
          left: 30,
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        {!alreadyRated
          ? `Puntua tu viaje con ${driver}`
          : `Gracias por puntuar a ${driver}`}
      </Text>
      <AirbnbRating
        defaultRating={driverScore}
        size={35}
        selectedColor="black"
        showRating={false}
        isDisabled={alreadyRated}
        onFinishRating={(rating) => setDriverScore(rating)}
      />
      <View style={TravelStyles.travelContainer}>
        <View style={[TravelStyles.buttonContainer, { marginTop: 100 }]}>
          <Text style={{ fontFamily: "poppins", fontSize: 20 }}></Text>
          {!alreadyRated ? (
            <Pressable
              style={
                driverScore != 0
                  ? MapStyles.confirmTripButton
                  : [MapStyles.confirmTripButton, { backgroundColor: "#bbb" }]
              }
              disabled={driverScore == 0}
              onPress={() => sendRatingToDriver()}
            >
              <Text
                style={{
                  fontFamily: "poppins-bold",
                  textAlign: "center",
                  lineHeight: 38,
                  color: "white",
                }}
              >
                Enviar Puntuacion
              </Text>
            </Pressable>
          ) : (
            <></>
          )}
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => sendReport(navigation)}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Denunciar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
