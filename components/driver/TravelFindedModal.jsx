import React, { useEffect } from "react";
import { Pressable, Modal, Text, View } from "react-native";


import { modalStyles } from "../styles";

export default function WaitingDriverModal({ navigation, setModalTravelFindedVisible, ...props }) {

  return (
    <Modal animationType="slide" transparent={true} visible={props.visible}>
      <Pressable
        onPress={() => { navigation.navigate("TravelInProgressDriver"); }}>
        <Text> Aceptar Viaje </Text>
      </Pressable>
      <Pressable
        onPress={setModalTravelFindedVisible(false)}>
        <Text>
          Volver
        </Text>
      </Pressable>
    </Modal>
  );
}
