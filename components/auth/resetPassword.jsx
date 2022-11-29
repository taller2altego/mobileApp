import { useState } from "react";
import { MapStyles, TravelStyles, Profilestyles, RecoverStyles } from "../styles";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFonts } from "expo-font";
import { patch, functionError } from "../../utils/requests";
import envs from "../../config/env";
import jwt from 'jwt-decode'

export default function ResetPassword({ route, navigation }) {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [email, setEmail] = useState(jwt(route.params.token).email);

    // states
    const { API_URL } = envs;
    const [fontsLoaded] = useFonts({
        "poppins": require("../../assets/fonts/Poppins-Regular.ttf"),
        "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    });

    const changePassword = (navigation) => {
        if (password == '' || (password != confirmPassword)) {
            setPasswordMatch(false);
            return;
        }
        const { token } = route.params;
        const userEmail = jwt(token).email;
        return patch(`${API_URL}/users`, token, { email: userEmail, password: password })
            .then(() => {
                navigation.navigate("Landing");
            }).catch(error => functionError(navigation, error))
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
                <Text style={RecoverStyles.other_info_text}>{"Ingrese una nueva contraseña para "}{email}</Text>
            </View>
            <View>
                <TextInput
                    style={RecoverStyles.report_container}
                    placeholder={"contraseña"}
                    secureTextEntry={true}
                    defaultValue={""}
                    onChangeText={newText => setPassword(newText)}
                    maxLength={100}
                />
            </View>
            <View>
                <TextInput
                    style={RecoverStyles.report_container}
                    placeholder={"confirmar contraseña"}
                    secureTextEntry={true}
                    defaultValue={""}
                    onChangeText={newText => setConfirmPassword(newText)}
                    maxLength={100}
                />
            </View>
            {!passwordMatch && <View style={RecoverStyles.info_container}>
                <Text style={RecoverStyles.invalid_email}>{"Las contraseñas no coinciden, intente nuevamente"}</Text>
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
                        onPress={() => changePassword(navigation)}
                    >
                        <Text
                            style={{
                                fontFamily: "poppins-bold",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 38,
                            }}
                        >
                            Cambiar Contraseña
                        </Text>
                    </Pressable>
                </View>
            </View>

        </View>
    );
}
