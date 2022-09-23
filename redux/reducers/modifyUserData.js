import {
  SET_EMAIL,
  SET_IS_DRIVER,
  SET_LASTNAME,
  SET_NAME,
  SET_PHONENUMBER,
  SET_USER_DATA,
} from "../actions/UpdateUserData";

const initialState = {
  name: "",
  lastname: "",
  email: "",
  phoneNumber: "",
  isDriver: "false",
};

const modifyUserDataReducer = (state = initialState, action, payload) => {
  switch (action.type) {
    case SET_NAME:
      return { ...state, name: payload.name };
    case SET_EMAIL:
      return { ...state, email: payload.email };
    case SET_LASTNAME:
      return { ...state, lastname: payload.lastname };
    case SET_PHONENUMBER:
      return { ...state, email: payload.phoneNumber };
    case SET_IS_DRIVER:
      return { ...state, email: payload.isDriver };
    case SET_USER_DATA:
      return {
        ...state,
        name: payload.name,
        lastname: payload.lastname,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
      };
    default:
      return state;
  }
};

export default modifyUserDataReducer;
