import {
  SET_IS_DRIVER,
  SET_USER_DATA,
  SET_DEFAULT_LOCATION,
} from "../actions/UpdateUserData";

const initialState = {
  name: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  defaultLocation: "",
  isDriver: "false",
};

const modifyUserDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_DRIVER:
      return { ...state, isDriver: action.payload.isDriver };
    case SET_USER_DATA:
      return {
        ...state,
        name: action.payload.name,
        lastname: action.payload.lastname,
        email: action.payload.email,
        phoneNumber: action.payload.phoneNumber,
      };
    case SET_DEFAULT_LOCATION:
      return {
        ...state,
        defaultLocation: action.payload.defaultLocation,
      };
    default:
      return state;
  }
};

export default modifyUserDataReducer;
