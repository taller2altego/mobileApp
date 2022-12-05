export const SET_TRAVEL_DETAILS = "SET_TRAVEL_DETAILS";
export const SET_TRAVEL_INFO = "SET_TRAVEL_INFO";
export const SET_USER_LOCATION = "SET_USER_LOCATION";
export const CLEAR_TRAVEL_DETAILS = "CLEAR_TRAVEL_DETAILS";

export const setTravelDetails = (payload) => {
  return { type: SET_TRAVEL_DETAILS, payload };
};

export const setTravelInfo = (payload) => {
  return { type: SET_TRAVEL_INFO, payload };
};

export const setUserLocation = (payload) => {
  return { type: SET_USER_LOCATION, payload };
};

export const clearTravelDetails = () => {
  return { type: CLEAR_TRAVEL_DETAILS };
};
