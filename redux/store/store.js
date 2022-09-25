import { configureStore } from "@reduxjs/toolkit";
import modifyUserDataReducer from "../reducers/modifyUserData";

const store = configureStore({
  reducer: { updateUser: modifyUserDataReducer },
});

export default store;
