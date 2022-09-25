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

const modifyUserDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NAME:
      return { ...state, name: action.payload.name };
    case SET_EMAIL:
      return { ...state, email: action.payload.email };
    case SET_LASTNAME:
      return { ...state, lastname: action.payload.lastname };
    case SET_PHONENUMBER:
      return { ...state, phoneNumber: action.payload.phoneNumber };
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
    default:
      return state;
  }
};

export default modifyUserDataReducer;
