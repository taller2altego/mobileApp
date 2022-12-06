import { SET_NEW_TRAVEL, SET_DRIVER, CLEAR_CURRENT_TRAVEL } from "../actions/UpdateCurrentTravel";

const initialState = { _id: '', driverId: 0, userId: 0 };

const modifyCurrentTravel = (state = initialState, action) => {
  switch (action.type) {
    case SET_NEW_TRAVEL:
      return { ...state, _id: action.payload._id, userId: action.payload.userId };
    case SET_DRIVER:
      return { ...state, driverId: action.payload.driverId };
    case CLEAR_CURRENT_TRAVEL:
        return { ...state, _id: initialState._id, driverId: initialState.driverId };
    default:
      return state;
  }
};

export default modifyCurrentTravel;
