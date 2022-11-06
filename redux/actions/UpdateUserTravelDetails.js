export const SET_TRAVEL_DETAILS = "SET_TRAVEL_DETAILS";
export const SET_TRAVEL_INFO = "SET_TRAVEL_INFO";

export const setTravelDetails = (payload) => {
  return { type: SET_TRAVEL_DETAILS, payload };
};

export const setTravelInfo = (payload) => {
  return { type: SET_TRAVEL_INFO, payload };
};
