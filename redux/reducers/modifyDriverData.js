import { SET_DRIVER_DATA, CLEAR_DRIVER_DATA } from "../actions/UpdateDriverData";

const initialState = {
  license: "",
  model: "",
  licensePlate: "",
};

const modifyDriverDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRIVER_DATA:
      return {
        ...state,
        license: action.payload.license,
        model: action.payload.model,
        licensePlate: action.payload.licensePlate,
      };
    case CLEAR_DRIVER_DATA:
      return {
        ...state,
        license: initialState.license,
        model: initialState.model,
        licensePlate: initialState.licensePlate,
      };
    default:
      return state;
  }
};

export default modifyDriverDataReducer;
