import { configureStore } from "@reduxjs/toolkit";
import modifyDriverDataReducer from "../reducers/modifyDriverData";
import modifyUserDataReducer from "../reducers/modifyUserData";
import modifyUserTravelDetailsReducer from "../reducers/modifyUserTravelDetails";
import modifyCurrentTravel from "../reducers/modifyCurrentTravel";

const store = configureStore({
  reducer: {
    userData: modifyUserDataReducer,
    driverData: modifyDriverDataReducer,
    travelDetailsData: modifyUserTravelDetailsReducer,
    currentTravel: modifyCurrentTravel
  },
});

export default store;