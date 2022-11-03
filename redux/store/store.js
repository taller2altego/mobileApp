import { configureStore } from "@reduxjs/toolkit";
import modifyDriverDataReducer from "../reducers/modifyDriverData";
import modifyUserDataReducer from "../reducers/modifyUserData";
import modifyTravelDetailsReducer from "../reducers/modifyTravelDetails";
import modifyCurrentTravel from "../reducers/modifyCurrentTravel";

const store = configureStore({
  reducer: {
    userData: modifyUserDataReducer,
    driverData: modifyDriverDataReducer,
    travelDetailsData: modifyTravelDetailsReducer,
    currentTravel: modifyCurrentTravel
  },
});

export default store;