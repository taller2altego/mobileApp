import { useState } from "react";
import { MapStyles, TravelStyles, Profilestyles, RecoverStyles } from "../styles";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { post } from "../../utils/requests";
import validator from 'validator';
import envs from "../../config/env";

const edgePadding = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
};

export default function RecoverPassword({ navigation }) {
    // redux

    const [email, setEmailText] = useState('');
    const [invalidEmail, setInvalidEmail] = useState(false);
    // states
    const { API_URL } = envs;
    const [fontsLoaded] = useFonts({
        "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    const sendMail = (navigation) => {
        if (validator.isEmail(email) === false) {
            setInvalidEmail(true);
        } else {
            setInvalidEmail(false);
            return post(`${API_URL}/recover`, { email: email })
                .then(() => {
                    navigation.navigate("AuthToken");
                });
        }
    };

    const comeBack = (navigation) => {
        navigation.navigate("Landing")
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={Profilestyles.profile_container}>
            <View style={RecoverStyles.info_container}>
                <Text style={RecoverStyles.other_info_text}>{"Ingresa tu correo electronico, y te enviaremos un enlace para que recuperes el acceso a tu cuenta."}</Text>
            </View>
            <View style={RecoverStyles.input_text}>
                <TextInput
                    style={RecoverStyles.report_container}
                    placeholder={"example@hotmail.com"}
                    defaultValue={""}
                    onChangeText={newText => setEmailText(newText)}
                    maxLength={100}
                />
            </View>
            {invalidEmail && <View style={RecoverStyles.info_container}>
                <Text style={RecoverStyles.invalid_email}>{"Ingrese un correo valido"}</Text>
            </View>}
            <View style={TravelStyles.travelContainer}>
                <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => comeBack(navigation)}
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
                </View>
                <View style={TravelStyles.buttonContainer}>
                    <Pressable
                        style={MapStyles.confirmTripButton}
                        onPress={() => sendMail(navigation)}
                    >
                        <Text
                            style={{
                                fontFamily: "poppins-bold",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 38,
                            }}
                        >
                            Enviar Mail
                        </Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
}