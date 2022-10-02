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
    borderTopRightRadius: 80,
    overflow: "hidden",
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
    backgroundColor: PRIMARY_BLUE,
    borderColor: SECONDARY_BLUE,
    textAlign: "center",
  },
  error_modal: {
    textAlign: "center",
    color: "#C73E1D",
  },
});

const Profilestyles = StyleSheet.create({
  profile_text: {
    fontSize: "2rem",
    fontFamily: "poppins-bold",
  },
  profile_container: {
    flex: 1,
  },
  profile_text_container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  profile_inputs: {
    flex: 2,
    justifyContent: "space-evenly",
  },
  profile_input: {
    fontSize: "1.2rem",
    marginLeft: 50,
    width: 300,
    borderWidth: 1,
    borderColor: "#343437",
    borderRadius: 10,
    height: 50,
    paddingLeft: 10,
    marginLeft: 30,
    marginRight: 30,
    outlineStyle: "none",
    fontFamily: "poppins",
  },
  edit_profile: {
    flex: 1,
    alignItems: "center",
  },
  edit_profile_button_container: {
    flex: 1,
    alignItems: "center",
  },
  edit_profile_button: {
    borderRadius: "10px",
    width: 175,
  },
  profile_buttons: {
    flex: 1,
    justifyContent: "space-between",
  },
  edit_button_text: {
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: "1.2rem",
  },
  delete_button_text: {
    textAlign: "center",
    fontFamily: "poppins",
    fontSize: "0.7rem",
    paddingBottom: 5,
    color: "red",
  },
  delete_account_modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  delete_account_view: {
    backgroundColor: "white",
    borderRadius: 25,
    height: 150,
    width: 350,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  delete_modal_text_title: {
    fontFamily: "poppins-bold",
  },
  delete_modal_text: {
    fontFamily: "poppins",
    marginTop: 10,
  },
});

const DriverStyles = StyleSheet.create({
  driver_container: {
    flex: 1,
  },
  driver_text: {
    flex: 1,
    marginTop: 20,
    textAlign: "center",
  },
  driver_title: {
    fontFamily: "poppins-bold",
    alignSelf: "center",
    fontSize: "1.5rem",
  },
  driver_subtitle: {
    fontFamily: "poppins",
    alignSelf: "center",
    fontSize: "1rem",
    marginTop: 30,
  },
  driver_inputs: {
    flex: 4,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  profile_input: {
    fontSize: "1rem",
    marginLeft: 50,
    width: 250,
    borderWidth: 1,
    borderColor: "#343437",
    borderRadius: 10,
    height: 40,
    paddingLeft: 10,
    marginLeft: 30,
    marginRight: 30,
    outlineStyle: "none",
    fontFamily: "poppins",
  },
  confirm_button: {
    borderRadius: "10px",
    width: 150,
    height: 65,
    alignSelf: "center",
    borderWidth: 3,
  },
  confirm_button_text: {
    textAlign: "center",
    textJustify: "center",
    fontFamily: "poppins",
    lineHeight: "3.5rem",
    fontSize: "1.3rem",
  },
  error_modal: {
    textAlign: "center",
    color: "#C73E1D",
    marginBottom: 50,
  },
});

export { DriverStyles, LandingStyles, modalStyles, Profilestyles };
