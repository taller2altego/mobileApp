import { SET_DRIVER_DATA } from "../actions/UpdateDriverData";

const initialState = {
  license: "",
  model: "",
  licensePlate: "",
  working: "false",
};

const modifyDriverDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRIVER_DATA:
      return {
        ...state,
        license: action.payload.license,
        model: action.payload.model,
        licensePlate: action.payload.licensePlate,
        working: action.payload.working,
      };
    default:
      return state;
  }
};

export default modifyDriverDataReducer;
