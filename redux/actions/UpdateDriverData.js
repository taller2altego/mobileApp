export const SET_DRIVER_DATA = "SET_DRIVER_DATA";
export const CLEAR_DRIVER_DATA = "CLEAR_DRIVER_DATA";

export const setDriverData = (payload) => {
  return { type: SET_DRIVER_DATA, payload };
};

export const clearDriverData = () => {
  return { type: CLEAR_DRIVER_DATA };
};
