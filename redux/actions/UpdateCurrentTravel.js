export const SET_NEW_TRAVEL = "SET_NEW_TRAVEL";
export const SET_DRIVER = "SET_DRIVER";

export const setNewTravel = (payload) => {
  return { type: SET_NEW_TRAVEL, payload };
};

export const setDriverId = (payload) => {
  return { type: SET_DRIVER, payload };
};