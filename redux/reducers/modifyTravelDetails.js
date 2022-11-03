import { SET_DESTINATION, SET_ORIGIN } from "../actions/UpdateTravelDetails";

const initialState = { origin: {}, destination: {} };

const modifyTravelDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORIGIN:
      return { ...state, origin: action.payload.origin };
    case SET_DESTINATION:
      return { ...state, destination: action.payload.destination };
    default:
      return state;
  }
};

export default modifyTravelDetailsReducer;
