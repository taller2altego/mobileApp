import {
  SET_TRAVEL_DETAILS,
  SET_TRAVEL_INFO,
} from "../actions/UpdateTravelDetails";

const initialState = {
  origin: {},
  destination: {},
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
