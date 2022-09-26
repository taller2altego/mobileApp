import { configureStore } from "@reduxjs/toolkit";
import modifyDriverDataReducer from "../reducers/modifyDriverData";
import modifyUserDataReducer from "../reducers/modifyUserData";

const store = configureStore({
  reducer: {
    userData: modifyUserDataReducer,
    driverData: modifyDriverDataReducer,
  },
});

export default store;
