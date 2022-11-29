import React, { useEffect } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from "react-redux";

// modules
import { get, functionError } from "../../utils/requests";
import { setDriverId } from "../../redux/actions/UpdateCurrentTravel";
import { modalStyles } from "../styles";
import envs from "../../config/env";

export default function WaitingDriverModal({ navigation, ...props }) {

  // redux
  const currentTravelData = useSelector((store) => store.currentTravel);
  const id = currentTravelData._id;
  const dispatch = useDispatch();

  const { API_URL, GOOGLE_API_KEY } = envs;

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      await get(`${API_URL}/travels/${id}/driver`, token, functionError(navigation))
        .then(({ data }) => {
          if (data.data.driverId) {
            dispatch(setDriverId({ driverId: data.data.driverId }));
            navigation.navigate("DriverIncoming");
            clearInterval(interval);
          }
        });

    }, 10000);
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
            <ActivityIndicator size={80} color="#000000" />
          </View>
        </View>
      </View>
    </Modal>
  );
}
