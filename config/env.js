import { URL_DEV, URL_PROD, GOOGLE_API_KEY } from "@env";

const devEnvironmentVariables = {
  API_URL: URL_DEV,
  GOOGLE_API_KEY,
};

const prodEnvironmentVariables = {
  API_URL: URL_PROD,
  GOOGLE_API_KEY,
};

export default __DEV__ ? devEnvironmentVariables : prodEnvironmentVariables;
