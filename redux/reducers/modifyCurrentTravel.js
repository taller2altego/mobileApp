import { SET_NEW_TRAVEL, SET_DRIVER } from "../actions/UpdateCurrentTravel";

const initialState = { _id: '', driverId: 0 };

const modifyTravelDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_TRAVEL:
      return { ...state, _id: action.payload._id };
    case SET_DRIVER:
      return { ...state, driverId: action.payload.driverId };
    default:
      return state;
  }
};

export default modifyTravelDetailsReducer;
