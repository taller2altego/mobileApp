import React, { useEffect, useState } from "react";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import { LandingStyles, modalStyles } from "../styles";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";

export default function RegisterModal({ ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [isDriver, setIsDriver] = useState(false);
  const [isDriverSelected, setIsDriverSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSignUp = () => {
    return post("http://127.0.0.1:5000/users", {
      name,
      lastname,
      phoneNumber: Number(phone),
      email,
      password,
    })
      .then(() => {
        if (isDriver == "true") {
          setIsDriverSelected(true);
        } else {
          props.toggle();
        }
      }).catch((e) => setErrorMessage(e.response.data.message));
  };

  const submitDriverData = () => {
    // TODO request para datos de conductor
    props.toggle();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={modalStyles.modal_extern_view}>
        {isDriverSelected
          ? (
            <View style={[modalStyles.modal_view]}>
              <View style={[modalStyles.flex_modal]}>
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Modelo de auto"
                  onChangeText={(name) => setName(name)}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Numero de licencia"
                  onChangeText={(name) => setName(name)}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Patente"
                  onChangeText={(name) => setName(name)}
                />
                <Pressable
                  style={modalStyles.modal_button}
                  onPress={() => submitDriverData()}
                >
                  <Text style={LandingStyles.textButton}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          )
          : (
            <View style={[modalStyles.modal_view]}>
              <Pressable onPress={props.toggle}>
                <Entypo name="cross" size={24} color="black" />
              </Pressable>
              <View style={[modalStyles.flex_modal]}>
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Nombre"
                  placeholderTextColor="#343437"
                  onChangeText={(name) => setName(name)}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Apellido"
                  placeholderTextColor="#343437"
                  onChangeText={(password) => setLastName(password)}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Email"
                  placeholderTextColor="#343437"
                  onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Telefono"
                  placeholderTextColor="#343437"
                  keyboardType="numeric"
                  onChangeText={(phone) => {
                    setPhone(phone.replace(/[^0-9]/, ""));
                  }}
                />
                <TextInput
                  style={[modalStyles.modal_input]}
                  placeholder="Contraseña"
                  placeholderTextColor="#343437"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
                <Picker
                  selectedValue={isDriver}
                  onValueChange={(isDriver, ItemIndex) => setIsDriver(isDriver)}
                  style={[modalStyles.modal_picker]}
                >
                  <Picker.Item label="Conductor" value={true} />
                  <Picker.Item label="Pasajero" value={false} />
                </Picker>
                <Pressable
                  style={modalStyles.modal_button}
                  onPress={() => onSignUp()}
                >
                  <Text style={LandingStyles.textButton}>Sign Up</Text>
                </Pressable>
                <Text
                  style={modalStyles.error_modal}
                >
                  {errorMessage}
                </Text>
              </View>
            </View>
          )}
      </View>
    </Modal>
  );
}