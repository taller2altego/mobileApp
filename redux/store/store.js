import { configureStore } from "@reduxjs/toolkit";
import modifyDriverDataReducer from "../reducers/modifyDriverData";
import modifyUserDataReducer from "../reducers/modifyUserData";
import modifyTravelDetailsReducer from "../reducers/modifyTravelDetails";

const store = configureStore({
  reducer: {
    userData: modifyUserDataReducer,
    driverData: modifyDriverDataReducer,
    travelDetailsData: modifyTravelDetailsReducer
  },
});

export default store;
