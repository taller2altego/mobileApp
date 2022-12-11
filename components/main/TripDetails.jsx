import { useState, useCallback } from "react";
import { View, Text, TextInput, Pressable, Dimensions } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { MapStyles, TravelStyles } from "../styles";
import {
  get,
  patch,
  handlerUnauthorizedError,
  authPost,
} from "../../utils/requests";
import envs from "../../config/env";
import { ScrollView } from "react-native-gesture-handler";

export default function TripDetails({ route, navigation }) {
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [price, setPrice] = useState();
  const [driver, setDriver] = useState();
  const [date, setDate] = useState();
  const [driverScore, setDriverScore] = useState();
  const [driverId, setDriverId] = useState();
  const [userIdDriver, serUserIdDriver] = useState();
  const [comment, setComment] = useState("");

  const { API_URL, _ } = envs;

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const token = await SecureStore.getItemAsync("token");
        await get(`${API_URL}/travels/${route.params.travelId}`, token)
          .then(({ data: { data } }) => {
            if (data.driverScore != 0) {
              setAlreadyRated(true);
            }
            setSource(data.sourceAddress);
            setDestination(data.destinationAddress);
            setPrice(data.price);
            setDate(data.date);
            setDriverScore(data.driverScore);
            setDriverId(data.driverId);
            return data;
          })
          .then(async ({ driverId }) => {
            await get(`${API_URL}/drivers/${driverId}`, token)
              .then(({ data: { userId, user: { name, lastname } } }) => {
                setDriver(`${name} ${lastname}`);
                serUserIdDriver(userId);
              });
          })
          .catch((err) => handlerUnauthorizedError(navigation, err));
      })();
    }, [])
  );

  const sendRatingToDriver = async () => {
    const token = await SecureStore.getItemAsync("token");
    setAlreadyRated(true);
    return patch(`${API_URL}/drivers/${driverId}`, token, {
      score: Math.floor(driverScore),
    })
      .then(() => {
        return patch(`${API_URL}/travels/${route.params.travelId}`, token, {
          driverScore: Math.floor(driverScore),
        })
          .then(async () => {
            if (comment != "") {
              await authPost(`${API_URL}/comments/driver`, token, {
                userId: userIdDriver,
                description: comment,
              });
            }
            navigation.replace("Home");
          })
          .catch((error) => handlerUnauthorizedError(navigation, error));
      })
      .catch((error) => handlerUnauthorizedError(navigation, error));
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
      driverId,
    });
  };

  const comeBack = (navigation) => {
    navigation.navigate("Home");
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          style={{ top: 35, left: 15, position: "absolute" }}
          onPress={() => navigation.goBack()}
        />

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View style={{ marginBottom: "10%", marginTop: "15%" }}>
            <Text
              style={{
                fontFamily: "poppins-bold",
                fontSize: 25,
                textAlign: "center",
              }}
            >
              Informacion Del Viaje
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
              {source}
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
              {destination}
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
              {price + " eth."}
            </Text>
            <Text style={{ fontFamily: "poppins", fontSize: 18 }}>
              {day}/{months[month]}/{year}
            </Text>
            {alreadyRated && (<Text style={{ fontFamily: "poppins", fontSize: 18 }}>
              {driverScore} estrellas
            </Text>)}
          </View>
        </View>
        {!alreadyRated && (<Text style={{ fontFamily: "poppins", fontSize: 20, marginBottom: 20, }}>
          Puntua tu viaje con el driver {driver}
        </Text>)}
        {!alreadyRated && (
          <AirbnbRating
            defaultRating={driverScore}
            size={35}
            selectedColor="black"
            showRating={false}
            isDisabled={alreadyRated}
            onFinishRating={(rating) => setDriverScore(rating)}
          />
        )}
        {!alreadyRated && (
          <View style={TravelStyles.comment_container}>
            <TextInput
              style={[TravelStyles.input_text, { width: 300 }]}
              placeholder="Comente su experiencia aqui..."
              onChangeText={(newText) => setComment(newText)}
              defaultValue={comment}
              maxLength={500}
            />
          </View>
        )}
        <View style={[TravelStyles.travelContainer, { marginBottom: 10 }]}>
          <View style={TravelStyles.buttonContainer}>
            <Text style={{ fontFamily: "poppins", fontSize: 20 }}></Text>
            {!alreadyRated ? (
              <Pressable
                style={[
                  driverScore != 0
                    ? [
                      MapStyles.confirmTripButton,
                      {
                        width: (50 * Dimensions.get("window").width) / 100,
                        marginTop: "10%",
                      },
                    ]
                    : [
                      MapStyles.confirmTripButton,
                      {
                        backgroundColor: "#bbb",
                        width: (50 * Dimensions.get("window").width) / 100,
                        marginTop: "10%",
                      },
                    ],
                ]}
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
                  Puntuar
                </Text>
              </Pressable>
            ) : (
              <></>
            )}
            <Pressable
              style={[
                {
                  width: (50 * Dimensions.get("window").width) / 100,
                  alignSelf: "center",
                },
              ]}
              onPress={() => sendReport(navigation)}
            >
              <Text
                style={{
                  fontFamily: "poppins-bold",
                  color: "#d55",
                  textAlign: "center",
                  lineHeight: 38,
                }}
              >
                Denunciar Conductor
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
