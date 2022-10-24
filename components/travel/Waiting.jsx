import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import { get } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import * as SecureStore from "expo-secure-store";
import { Pressable, Image } from "react-native";

export default function WaitingDriverModal({ ...props }) {
  const [seconds, setSeconds] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const token = await SecureStore.getItemAsync("token");
  //     await get(`http://10.0.2.2:5000/travels/${props.travelId}/driver`)
  //       .then(({ data }) => {
  //         if (data.driverId) {
  //           // cambiar vista
  //         }
  //       })
  //       .catch(() => {
  //         console.log("No se pudo hacer la request");
  //       });
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(async () => {
    await sleep(3000);
    props.navigation.navigate("DriverIncoming");
  }, []);

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <View style={modalStyles.modal_extern_view}>
        <View style={[modalStyles.modal_view]}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={[{ flex: 0.5 }]}>
              <Text
                style={{
                  fontSize: 32,
                  padding: 60,
                  paddingBottom: 10,
                  textAlign: "center",
                }}
              >
                Buscando conductor para su viaje
              </Text>
            </View>
            <Pressable
              onPress={() => props.navigation.navigate("ConfirmationTravel")}
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
            <ActivityIndicator size={80} color="#000000" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
