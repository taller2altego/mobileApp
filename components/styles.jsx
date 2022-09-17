import { StyleSheet } from "react-native";
import * as Font from "expo-font";

const PRIMARY_BLUE = "#1d9bc2";
const SECONDARY_BLUE = "#0b0e12";

Font.loadAsync({
  "poppins": require("../assets/fonts/Poppins-Regular.ttf"),
  "poppins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
});

const LandingStyles = StyleSheet.create({
  land_container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: SECONDARY_BLUE,
  },
  regButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: "10px",
    width: 175,
    height: 65,
  },
  textButton: {
    textAlign: "center",
    textJustify: "center",
    color: "white",
    fontFamily: "poppins",
    lineHeight: "4rem",
    fontSize: "1.3rem",
  },
  tinyLogo: {
    width: 150,
    height: 150,
  },
  logo: {
    paddingTop: 100,
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 50,
  },
  land_text_container: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  land_text: {
    fontFamily: "poppins-bold",
    color: PRIMARY_BLUE,
    fontSize: "3rem",
  },
  land_buttons_container: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  land_sub_text: {
    textAlign: "center",
    textJustify: "center",
    color: "white",
    fontFamily: "poppins",
    fontSize: "1.1rem",
  },
});

const modalStyles = StyleSheet.create({
  modal_view: {
    height: "75%",
    backgroundColor: PRIMARY_BLUE,
  },
  modal_container: {
    flex: 1,
    position: "absolute",
    justifyContent: "flex-end",
  },
  reg_modal: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modal_extern_view: {
    flex: 1,
    justifyContent: "flex-end",
  },
  flex_modal: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  modal_button: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: "10px",
    width: 150,
    height: 65,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  modal_input: {
    borderWidth: 1,
    borderColor: "#343437",
    borderRadius: 10,
    height: 50,
    paddingLeft: 10,
    fontSize: "1.3rem",
    textAlign: "justify",
    marginLeft: 30,
    marginRight: 30,
    outlineStyle: "none",
    fontFamily: "poppins",
  },
  modal_picker: {
    width: 300,
    alignSelf: "center",
    fontSize: "1.2rem",
    fontFamily: "poppins",
  },
});

const Profilestyles = StyleSheet.create({
  profile_text: {
    fontSize: "2rem",
    fontFamily: "poppins-bold",
  },
  profile_container: {
    flex: 0.5,
  },
  profile_text_container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  profile_inputs: {
    flex: 2,
    justifyContent: "space-evenly",
  },
  profile_input: {
    fontSize: "1.5rem",
    textAlign: "justify",
    marginLeft: 50,
    width: 250,
  },
  edit_profile_button: {
    flex: 1,
    alignItems: "center",
  },
});

export { LandingStyles, modalStyles, Profilestyles };
