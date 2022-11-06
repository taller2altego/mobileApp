import { SET_DESTINATION, SET_ORIGIN } from "../actions/UpdateUserTravelDetails";

const initialState = { origin: {}, destination: {} };

const modifyUserTravelDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORIGIN:
      return { ...state, origin: action.payload.origin };
    case SET_DESTINATION:
      return { ...state, destination: action.payload.destination };
    default:
      return state;
  }
};

export default modifyUserTravelDetailsReducer;
