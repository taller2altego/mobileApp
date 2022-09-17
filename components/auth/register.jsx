import React, { useEffect, useState } from "react";
import { Button, Modal, Pressable, Text, TextInput, View } from "react-native";
import { post } from "../../utils/requests";
import styles from "../styles";
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

  const onSignUp = () => {
    return post("http://127.0.0.1:5001/users", {
      name,
      lastname,
      phoneNumber: Number(phone),
      email,
      password,
    })
      .then(({ data: { id } }) => {
        if (isDriver) {
          setIsDriverSelected(true);
        } else {
          props.toggle;
        }
      });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
    >
      <View style={styles.centeredView2}>
        {isDriverSelected
          ? (
            <View>
              <Text>SOY CONDUCTOR</Text>
            </View>
          )
          : (
            <View style={[styles.modal_view]}>
              <Pressable onPress={props.toggle}>
                <Entypo name="cross" size={24} color="black" />
              </Pressable>
              <TextInput
                placeholder="Name"
                onChangeText={(name) => setName(name)}
              />
              <TextInput
                placeholder="Lastname"
                onChangeText={(password) => setLastName(password)}
              />
              <TextInput
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
              />
              <TextInput
                placeholder="Phone Number"
                keyboardType="numeric"
                onChangeText={(phone) => {
                  setPhone(phone.replace(/[^0-9]/, ""));
                }}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(password) => setPassword(password)}
              />
              <Picker
                selectedValue={isDriver}
                onValueChange={(isDriver, ItemIndex) => setIsDriver(isDriver)}
              >
                <Picker.Item label="Conductor" value={true} />
                <Picker.Item label="Pasajero" value={false} />
              </Picker>
              <Pressable style={styles.regButton} onPress={() => onSignUp()}>
                <Text style={styles.textButton}>Sign Up</Text>
              </Pressable>
            </View>
          )}
      </View>
    </Modal>
  );
}
