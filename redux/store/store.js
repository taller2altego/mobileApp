import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import modifyUserDataReducer from "../reducers/modifyUserData";

const rootReducer = () => ({
  updateUser: modifyUserDataReducer,
});
const store = configureStore({ reducer: rootReducer });

export default store;
