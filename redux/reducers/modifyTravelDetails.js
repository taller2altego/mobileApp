import { SET_DETAILS } from "../actions/UpdateTravelDetails";

const initialState = { srcDetails: "", destDetails: "" };

const modifyTravelDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DETAILS:
      return { ...state, srcDetails: action.details.srcDetails, destDetails: action.details.destDetails };
    default:
      return state;
  }
};

export default modifyTravelDetailsReducer;