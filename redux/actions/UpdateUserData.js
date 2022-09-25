export const SET_NAME = "SET_NAME";
export const SET_LASTNAME = "SET_LASTNAME";
export const SET_EMAIL = "SET_EMAIL";
export const SET_PHONENUMBER = "SET_PHONENUMBER";
export const SET_IS_DRIVER = "SET_IS_DRIVER";
export const SET_USER_DATA = "SET_USER_DATA";

export const setName = (payload) => {
  return { type: SET_NAME, payload };
};

export const setLastname = (payload) => {
  return { type: SET_LASTNAME, payload };
};

export const setEmail = (payload) => {
  return { type: SET_EMAIL, payload };
};

export const setPhonenumber = (payload) => {
  return { type: SET_PHONENUMBER, payload };
};

export const setIsDriver = (payload) => {
  return { type: SET_IS_DRIVER, payload };
};

export const setUserData = (payload) => {
  return { type: SET_USER_DATA, payload };
};
