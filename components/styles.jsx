import { StyleSheet, Dimensions } from "react-native";

const PRIMARY_BLUE = "#1d9bc2";
const SECONDARY_BLUE = "#0b0e12";

const LandingStyles = StyleSheet.create({
  land_container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: SECONDARY_BLUE,
  },
  regButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 10,
    width: 175,
    height: 65,
  },
  textButton: {
    textAlign: "center",
    textJustify: "center",
    color: "white",
    lineHeight: 65,
    fontSize: 20,
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
    color: PRIMARY_BLUE,
    fontSize: 45,
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
    fontSize: 18,
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
    borderRadius: 10,
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
    fontSize: 15,
    textAlign: "justify",
    marginLeft: 30,
    marginRight: 30,
    outlineStyle: "none",
  },
  modal_picker: {
    width: 300,
    alignSelf: "center",
    fontSize: 15,
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
    fontSize: 15,
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
    fontSize: 15,
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
    borderRadius: 10,
    width: 175,
  },
  edit_button_text: {
    textAlign: "center",
    textJustify: "center",
    paddingBottom: 15,
    fontSize: 15,
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
    alignSelf: "center",
    fontSize: 15,
  },
  driver_subtitle: {
    alignSelf: "center",
    fontSize: 10,
    marginTop: 30,
  },
  driver_inputs: {
    flex: 4,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  profile_input: {
    fontSize: 10,
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
  },
  confirm_button: {
    borderRadius: 10,
    width: 150,
    height: 65,
    alignSelf: "center",
    borderWidth: 3,
  },
  confirm_button_text: {
    textAlign: "center",
    textJustify: "center",
    lineHeight: "3.5rem",
    fontSize: 15,
  },
  error_modal: {
    textAlign: "center",
    color: "#C73E1D",
    marginBottom: 50,
  },
});

const Homestyles = StyleSheet.create({
  searchContainer: {
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  },
  searchInput: {
    borderColor: "#888",
    borderWidth: 1,
  },
});

const MapStyles = StyleSheet.create({
  map: {
    top: 0,
    width: Dimensions.get("window").width,
    height: (80 * Dimensions.get("window").height) / 100,
  },
  searchContainer: {
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  },
  searchInput: {
    borderColor: "#888",
    borderWidth: 1,
  },
  tripInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#e4e4e4",
    borderBottomColor: "black",
  },
  carImage: { height: 100, width: 110 },
  confirmTripButton: {
    alignSelf: "center",
    height: 40,
    width: 200,
    backgroundColor: "black",
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 15,
  },
});

export { DriverStyles, LandingStyles, modalStyles, Profilestyles, Homestyles };
