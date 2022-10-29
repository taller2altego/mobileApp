import { useState, useEffect } from "react";
import { MapStyles, TravelStyles, Profilestyles } from "../styles";
import { View, Text, Pressable, Image } from "react-native";
import { useFonts } from "expo-font";
import { Rating } from "react-native-ratings";
import { get, patch } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";

const API_KEY = "AIzaSyCa-kIrd3qRNKDJuHylT3VdLywUwWRbgXQ";

export default function TripDetails({ route, navigation }) {
  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });
  const [rating, handleRating] = useState();
  const { travelId } = route.params;
  const [source, setSource] = useState();
  const [destination, setDestination] = useState();
  const [price, setPrice] = useState();
  const [driver, setDriver] = useState();
  const [date, setDate] = useState();
  const [driverScore, setDriverScore] = useState();

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      await get(`http://10.0.2.2:5000/travels/${travelId}`, token)
        .then(
          ({ data: { data } }) => {
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + data.source.latitude + ',' + data.source.longitude + '&key=' + API_KEY)
              .then((response) => response.json())
              .then((responseJson) => {
                setSource(responseJson.results[0].formatted_address);
              });
            fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + data.destination.latitude + ',' + data.destination.longitude + '&key=' + API_KEY)
              .then((response) => response.json())
              .then((responseJson) => {
                setDestination(responseJson.results[0].formatted_address)
              });
            setDriver(data.driver);
            setPrice(data.price);
            setDate(data.date);
            setDriverScore(data.driverScore);
          });
    })();
  }, []);

  const sendRatingToDriver = async (navigation) => {
    const token = await SecureStore.getItemAsync("token");
    return patch(`http://10.0.2.2:5000/travels/${travelId}`, token, { driverScore: rating })
      .then(() => {
        navigation.navigate("Home");
      });
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <View style={Profilestyles.profile_container}>
          <Text style={Profilestyles.profile_visualization}>Desde: {source}</Text>
          <Text style={Profilestyles.profile_visualization}>Hasta: {destination}</Text>
          <Text style={Profilestyles.profile_visualization}>Precio: {price}</Text>
          <Text style={Profilestyles.profile_visualization}>Conductor: {driver}</Text>
          {(driverScore == 0) && (<Text style={Profilestyles.profile_visualization}>Puntaje del Viaje: {driverScore}</Text>)}
          <Text style={Profilestyles.profile_visualization}>Fecha: {date}</Text>
        </View>
      </View>
      {(driverScore == 0) && <Rating
        style={{ alignSelf: "center", paddingBottom: 60 }}
        type="custom"
        minValue={1}
        ratingCount={5}
        imageSize={40}
        ratingBackgroundColor="white"
        ratingColor="black"
        tintColor="grey"
        startingValue={1}
        fractions={1}
        onFinishRating={(rating) => handleRating(rating)}
      />}
      <View style={TravelStyles.travelContainer}>

        <View style={TravelStyles.buttonContainer}>
          <Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => navigation.navigate("Home")}
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
          {(driverScore == 0) && (<Pressable
            style={MapStyles.confirmTripButton}
            onPress={() => sendRatingToDriver(navigation)}
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