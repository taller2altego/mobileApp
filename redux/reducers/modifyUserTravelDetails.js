import {
  SET_TRAVEL_DETAILS,
  SET_TRAVEL_INFO,
  SET_USER_LOCATION,
} from "../actions/UpdateTravelDetails";

const initialState = {
  origin: {},
  destination: {},
  userLocation: {},
  originAddress: "",
  destinationAddress: "",
};

const modifyUserTravelDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRAVEL_DETAILS:
      return {
        ...state,
        origin: action.payload.origin,
        destination: action.payload.destination,
      };
    case SET_USER_LOCATION:
      return {
        ...state,
        userLocation: action.payload.userLocation,
      };
    case SET_TRAVEL_INFO:
      return {
        ...state,
        originAddress: action.payload.originAddress,
        destinationAddress: action.payload.destinationAddress,
      };
    default:
      return state;
  }
};

export default modifyUserTravelDetailsReducer;
