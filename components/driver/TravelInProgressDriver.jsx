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
      latitude: tripData.destination.latitude,
      longitude: tripData.destination.longitude,
    },
    userCoords: {
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
  const [arriveOnUserLocation, setArriveOnUserLocation] = useState(false);
  const [arriveOnDestination, setArriveOnDestination] = useState(false);
  const [roadTofinalDestination, setRoadTofinalDestination] = useState(false);

  const [fontsLoaded] = useFonts({
    poppins: require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const updateDriverPosition = async () => {
    const locSubscription = await Location.watchPositionAsync(
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

    setLocationSubscription(locSubscription);
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

  useEffect(() => {
    updateDriverPosition();
    return function cleanup() {
      locationSubscription.remove();
    };
  }, []);

  const updateDistance = (args, tripPart) => {
    const setArrive =
      tripPart === "start" ? setArriveOnUserLocation : setArriveOnDestination;
    if (args.distance.toFixed(2) < 0.05) {
      setArrive(true);
    } else {
      setArrive(false);
    }
  };

  const startTrip = () => {
    setRoadTofinalDestination(true);
    setArriveOnUserLocation(false);
  };

  const endTrip = () => {
    navigation.navigate("Home");
  };

  const finishTravel = (navigation) => {
    return post(`/travels/${tripData._id}/finish`, functionError(navigation)).then(
      navigation.navigate("Home")
    )
  };

  const cancelTravel = (navigation) => {
    // request para eliminar el driver del tralel
    // limpiar inputs de destino y origen en main
    return post(`/travels/${tripData._id}/reject?isTravelCancelled='true'`, functionError(navigation)).then(
      navigation.navigate("Home")
    )
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
        {!roadTofinalDestination && (
          <Marker
            coordinate={actualTripState.userCoords}
            identifier="userMark"
          />
        )}
        {!roadTofinalDestination &&
          actualTripState.currentLoc &&
          actualTripState.userCoords && (
            <MapViewDirections
              apikey={GOOGLE_API_KEY}
              origin={actualTripState.currentLoc}
              destination={actualTripState.userCoords}
              strokeColor="black"
              optimizeWaypoints={true}
              strokeWidth={5}
              onReady={(args) => updateDistance(args, "start")}
            />
          )}
        {actualTripState.userCoords && actualTripState.destinationCoords && (
          <MapViewDirections
            apikey={GOOGLE_API_KEY}
            origin={
              roadTofinalDestination
                ? actualTripState.currentLoc
                : actualTripState.userCoords
            }
            destination={actualTripState.destinationCoords}
            strokeColor="black"
            optimizeWaypoints={true}
            strokeWidth={5}
            onReady={(args) => updateDistance(args, "end")}
          />
        )}
      </MapView>
      {arriveOnUserLocation ? (
        <div>
          <Pressable onPress={startTrip}>
            <Text> INICIAR VIAJE </Text>
          </Pressable>
          <Pressable onPress={cancelTravel}>
            <Text> CANCELAR </Text>
          </Pressable>
        </div>
      ) : (
        <Pressable onPress={finishTravel}>
            <Text> FINALIZAR VIAJE </Text>
        </Pressable>
      )}
      {arriveOnDestination ? (
        <Pressable onPress={endTrip}>
          <Text> FINALIZAR VIAJE </Text>
        </Pressable>
      ) : (
        <></>
      )}
    </View>
  );
}
