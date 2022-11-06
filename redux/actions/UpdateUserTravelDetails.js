export const SET_ORIGIN = "SET_ORIGIN";
export const SET_DESTINATION = "SET_DESTINATION";

export const setOrigin = (payload) => {
  return { type: SET_ORIGIN, payload };
};

export const setDestination = (payload) => {
  return { type: SET_DESTINATION, payload };
};
