export const SET_IS_DRIVER = "SET_IS_DRIVER";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_DEFAULT_LOCATION = "SET_DEFAULT_LOCATION";

export const setIsDriver = (payload) => {
  return { type: SET_IS_DRIVER, payload };
};

export const setUserData = (payload) => {
  return { type: SET_USER_DATA, payload };
};

export const setDefaultLocation = (payload) => {
  return { type: SET_DEFAULT_LOCATION, payload };
};
