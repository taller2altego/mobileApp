import React, { useEffect } from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useSelector, useDispatch } from "react-redux";

// modules
import { get } from "../../utils/requests";
import { setDriverId } from "../../redux/actions/UpdateCurrentTravel";
import { modalStyles } from "../styles";

export default function WaitingDriverModal({ navigation, ...props }) {

  // redux
  const currentTravelData = useSelector((store) => store.currentTravel);
  const id = currentTravelData._id;
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await SecureStore.getItemAsync("token");

      await get(`http://10.0.2.2:5000/travels/${id}/driver`, token)
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
