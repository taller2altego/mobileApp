import { useRef, useState } from "react";
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { MapStyles, TravelStyles } from "../styles";
import MapViewDirections from "react-native-maps-directions";
import { View, Text, Pressable, Image, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import envs from "../../config/env";
import { useEffect } from "react";
import * as Location from "expo-location";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const { API_URL, GOOGLE_API_KEY } = envs;

export default function TravelInProgressDriver({ navigation }) {
  // refs
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  // redux
  const tripData = useSelector((store) => store.travelDetailsData);
  const [locationSubscription, setLocationSubscription] = useState(null);

  // state
  const [actualTripState, setActualTripState] = useState({
    currentLoc: {
      latitude: tripData.origin.latitude,
      longitude: tripData.origin.longitude,
    },
    destinationCoords: {
      latitude: tripData.userLocation.latitude,
      longitude: tripData.userLocation.longitude,
    },
    animatedcoords: new AnimatedRegion({
      latitude: tripData.origin.latitude,
      longitude: tripData.origin.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  });
  const [tripToFinalDestiny, setTripToFinalDestiny] = useState(false);

  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const updateDriverPosition = async () => {
    const x = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 10 },
      (location) => {
        const newLatitude = location.coords.latitude;
        const newLongitude = location.coords.longitude;
        animate(newLatitude, newLongitude);
        setActualTripState({
          ...actualTripState,
          currentLoc: { latitude: newLatitude, longitude: newLongitude },
        });
      },
      (error) => {
        console.log("hay error aca"), console.log(error);
      }
    );

    setLocationSubscription(x);
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (markerRef.current) {
      actualTripState.animatedcoords.timing(newCoordinate).start();
      mapRef.current.animateToRegion({
        latitude: newCoordinate.latitude,
        longitude: newCoordinate.longitude,
        longitudeDelta: LONGITUDE_DELTA,
        latitudeDelta: LATITUDE_DELTA,
      });
    }
  };

  useEffect(
    (async () => {
      console.log("logs");
      console.log(actualTripState);
      if (actualTripState.tripStarted) {
        await updateDriverPosition();
      }
    })(),
    [actualTripState]
  );

  useEffect(() => {
    console.log("ENTRO A USE EFFECT");
    updateDriverPosition();
    return () => {
      locationSubscription.remove();
    };
  }, []);

  const updateDistance = (args) => {
    if (args.distance.toFixed(2) < 0.05) {
      setTripToFinalDestiny(true);
    }
  };

  const startTrip = () => {
    locationSubscription.remove();
    setActualTripState({
      ...actualTripState,
      destinationCoords: {
        latitude: tripData.destination.latitude,
        longitude: tripData.destination.longitude,
      },
      tripStarted: true,
    });
  };

  const cancelTravel = (navigation) => {
    // request para eliminar el driver del tralel
    // limpiar inputs de destino y origen en main
    navigation.navigate("Home");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <MapView
        ref={mapRef}
        style={MapStyles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: tripData.origin.latitude,
          longitude: tripData.origin.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker.Animated
          ref={markerRef}
          coordinate={actualTripState.animatedcoords}
        />
        <Marker
          coordinate={actualTripState.destinationCoords}
          identifier="destMark"
        />
        {actualTripState.currentLoc && actualTripState.destinationCoords && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={actualTripState.currentLoc}
            destination={actualTripState.destinationCoords}
            strokeColor="black"
            optimizeWaypoints={true}
            strokeWidth={5}
            onReady={updateDistance}
          />
        )}
      </MapView>
      {tripToFinalDestiny ? (
        <Pressable onPress={startTrip}>
          <Text> INICIAR VIAJE </Text>
        </Pressable>
      ) : (
        <></>
      )}
    </View>
  );
}
