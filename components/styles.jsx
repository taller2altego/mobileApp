import { StyleSheet, Dimensions } from "react-native";
const PRIMARY_BLUE = "#121111";
const SECONDARY_BLUE = "#f7f4f3";

const LandingStyles = StyleSheet.create({
  land_container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: SECONDARY_BLUE,
  },
  regButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 10,
    width: 200,
    height: 50,
  },
  textButton: {
    textAlign: "center",
    textJustify: "center",
    color: "white",
    lineHeight: 55,
    fontSize: 20,
  },
  simpleText: {
    textAlign: "center",
    textJustify: "center",
    color: "white",
    lineHeight: 65,
    fontWeight: "bold",
    fontSize: 13,
  },
  tinyLogo: {
    width: 250,
    height: 250,
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
  land_buttons_login: {
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
  land_container_v2: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "space-around",
  },
  land_buttons_container_v2: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 5,
  },
});

const modalStyles = StyleSheet.create({
  modal_view: {
    height: "75%",
    backgroundColor: "white",
    borderRadius: 15,
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
    width: 200,
    height: 60,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  modal_input: {
    borderWidth: 1,
    borderColor: "black",
    color: "black",
    fontFamily: "poppins",
    borderRadius: 5,
    height: 45,
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
  centered_view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modal_view_travel: {
    margin: 20,
    padding: 25,
    borderColor: "black",
    borderRadius: 15,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  button_close: {
    backgroundColor: "black",
    height: 40,
    width: 150
  },
  text_style: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  text_modal_style: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "red"
  }
});

const RecoverStyles = StyleSheet.create({
  info_container: {
    flex: 3,
    marginTop: 100,
    textAlign: "center",
  },
  input_text: {
    flex: 2,
  },
  destination_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  other_info_text: {
    fontSize: 14,
    textAlign: "center",
    padding: 20,
    color: "grey",
    marginTop: 10,
  },
  invalid_email: {
    fontSize: 14,
    textAlign: "center",
    padding: 20,
    color: "red",
    marginTop: 10,
  },
  report_container: {
    height: (5 * Dimensions.get("window").height) / 100,
    width: (90 * Dimensions.get("window").width) / 100,
    backgroundColor: "white",
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    shadowColor: "black",
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 20,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  },
  input_text_container: {
    height: (20 * Dimensions.get("window").height) / 100,
    width: (90 * Dimensions.get("window").width) / 100,
    backgroundColor: "white",
    fontSize: 16,
    color: "grey",
    textAlign: "center",
    shadowColor: "black",
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 20,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  }
});

const Profilestyles = StyleSheet.create({
  profile_text: {
    fontSize: 35,
  },
  profile_container: {
    flex: 1,
    alignItems: "center",
  },
  profile_text_container: {
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    paddingTop: 30,
  },
  profile_inputs: {
    flex: 3,
    justifyContent: "space-evenly",
  },
  profile_input: {
    fontSize: 15,
    width: 300,
    borderWidth: 1,
    borderColor: "#343437",
    borderRadius: 10,
    height: 50,
    paddingLeft: 10,
    outlineStyle: "none",
  },
  profile_visualization: {
    fontSize: 15,
    marginLeft: 50,
    width: 300,
    height: 50,
    marginLeft: 30,
    marginRight: 30,
    textAlign: "center",
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
    fontSize: 22,
  },
  driver_subtitle: {
    alignSelf: "center",
    fontSize: 12,
  },
  driver_inputs: {
    flex: 4,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  profile_input: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#343437",
    borderRadius: 5,
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
    lineHeight: 60,
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
    height: (75 * Dimensions.get("window").height) / 100,
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
    padding: 8,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 5,
  },
});
const TravelStyles = StyleSheet.create({
  travelContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  comment_container: {
    height: (15 * Dimensions.get("window").height) / 100,
    width: (75 * Dimensions.get("window").width) / 100,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
    shadowColor: "black",
    borderColor: 'black',
    borderWidth: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  },
  input_text: {
    flex: 2,
    textAlign: "center",
  }
});

const ReportStyles = StyleSheet.create({
  info_container: {
    flex: 3,
    marginTop: 100,
    textAlign: "center",
  },
  input_text: {
    flex: 2,
  },
  destination_text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  other_info_text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  report_container: {
    height: (25 * Dimensions.get("window").height) / 100,
    width: (90 * Dimensions.get("window").width) / 100,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
    shadowColor: "black",
    borderColor: 'black',
    borderWidth: 2,
    marginBottom: 20,
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 35,
  }
});

const customMap = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#8ff0a4"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#99c1f1"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
]
export {
  DriverStyles,
  LandingStyles,
  modalStyles,
  Profilestyles,
  Homestyles,
  MapStyles,
  TravelStyles,
  RecoverStyles,
  ReportStyles,
  customMap
};
