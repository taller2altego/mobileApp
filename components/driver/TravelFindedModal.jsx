import React, { useEffect } from "react";
import { Pressable, Modal, Text, View } from "react-native";
import { Entypo } from "@expo/vector-icons";

import { LandingStyles, modalStyles } from "../styles";
import { useSelector } from "react-redux";

export default function TravelFindedModal({
  navigation,
  setModalTravelFindedVisible,
  ...props
}) {
  const currentTravel = useSelector((store) => store.travelDetailsData);

  const acceptTravel = async () => {
    return  post(`/travels/${currentTravel._id}/accept`).then(
      navigation.navigate("TravelInProgressDriver")
    )
  };

  return (
    <Modal animationType="slide" transparent={false} visible={props.visible}>
      <View style={[modalStyles.modal_extern_view, { fontFamily: "poppins" }]}>
        <View style={[modalStyles.modal_view, { fontFamily: "poppins" }]}>
          <Pressable onPress={props.toggle}>
            <Entypo name="cross" size={24} color="black" />
          </Pressable>
          <View style={[modalStyles.flex_modal]}>
            <Text style={{ fontSize: 25, alignSelf: "center" }}>
              {" "}
              {currentTravel.originAddress}
            </Text>
            <Text style={{ fontSize: 25, alignSelf: "center" }}>
              {" "}
              {currentTravel.destinationAddress}{" "}
            </Text>
            <Pressable
              style={{ alignSelf: "center" }}
              onPress={acceptTravel}
            >
              <Text style={{ fontSize: 25 }}> Aceptar Viaje </Text>
            </Pressable>

            <Pressable style={{ alignSelf: "center" }} onPress={props.toggle}>
              <Text style={{ fontSize: 25 }}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
