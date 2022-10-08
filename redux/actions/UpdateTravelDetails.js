export const SET_DETAILS = "SET_DETAILS";

export const setDetails = (srcDetails, destDetails) => {
  const details = { srcDetails, destDetails };
  return { type: SET_DETAILS, details };
}