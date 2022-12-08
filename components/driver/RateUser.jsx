import { useState, useEffect } from "react";
import { MapStyles, TravelStyles, Profilestyles } from "../styles";
import { View, Text, Pressable, TextInput } from "react-native";
import { useFonts } from "expo-font";
import {
  authPost,
  get,
  patch,
  handlerUnauthorizedError,
} from "../../utils/requests";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import envs from "../../config/env";
import { AirbnbRating } from "react-native-ratings";
import { useSelector } from "react-redux";

const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

export default function RateUser({ navigation }) {
  const [rating, handleRating] = useState();
  const [userScore, setUserScore] = useState();
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [comment, setComment] = useState("");
  const { API_URL, _ } = envs;

  const currentTravelData = useSelector((store) => store.currentTravel);
  const travelId = currentTravelData._id;
  const userId = currentTravelData.userId;

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      await get(`${API_URL}/travels/${travelId}`, token).then(
        ({ data: { data } }) => {
          if (data.userScore != 0) {
            setAlreadyRated(true);
          }
          setSource(data.sourceAddress);
          setDestination(data.destinationAddress);
          setPrice(data.price);
          setDate(data.date);
          setUserScore(data.userScore);
        }
      );
    })();
  }, []);

    const sendRatingToUser = async () => {
        setAlreadyRated(true);
        const token = await SecureStore.getItemAsync("token");
        return patch(`${API_URL}/users/${userId}`, token, { score: Math.floor(rating) }).then(() => {
            return patch(`${API_URL}/travels/${travelId}`, token, { userScore: Math.floor(rating) }).then(async () => {
                if (comment != "") {
                    await authPost(`${API_URL}/comments/user`, token, { userId, description: comment })
                }
                navigation.replace("Home");
            }).catch(error => handlerUnauthorizedError(navigation, error));
        }).catch(error => handlerUnauthorizedError(navigation, error));
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

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <View style={Profilestyles.profile_container}>
          <Text style={Profilestyles.profile_visualization}>
            Desde: {source}
          </Text>
          <Text style={Profilestyles.profile_visualization}>
            Hasta: {destination}
          </Text>
          <Text style={Profilestyles.profile_visualization}>
            Precio: ${price}
          </Text>
          <Text style={Profilestyles.profile_visualization}>
            Pasajero: {userId}
          </Text>
          {userScore > 0 && (
            <Text style={Profilestyles.profile_visualization}>
              Puntaje del Viaje: {userScore}
            </Text>
          )}
          <Text style={Profilestyles.profile_visualization}>
            Fecha: {day}/{months[month]}/{year}
          </Text>
        </View>
      </View>
      {!alreadyRated && (
        <AirbnbRating
          defaultRating={userScore}
          size={35}
          selectedColor="black"
          showRating={false}
          isDisabled={alreadyRated}
          onFinishRating={(rating) => handleRating(rating)}
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
      <View style={TravelStyles.travelContainer}>
        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              MapStyles.confirmTripButton,
              { backgroundColor: pressed ? "#333" : "black" },
            ]}
            onPress={() => navigation.navigate("UserProfileVisualization")}
          >
            <Text
              style={{
                fontFamily: "poppins-bold",
                color: "white",
                textAlign: "center",
                lineHeight: 38,
              }}
            >
              Volver atras
            </Text>
          </Pressable>
          {!alreadyRated && (
            <Pressable
              style={({ pressed }) => [
                MapStyles.confirmTripButton,
                { backgroundColor: pressed ? "#333" : "black" },
              ]}
              onPress={() => sendRatingToUser(navigation)}
            >
              <Text
                style={{
                  fontFamily: "poppins-bold",
                  color: "white",
                  textAlign: "center",
                  lineHeight: 38,
                }}
              >
                Enviar Puntuacion
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
