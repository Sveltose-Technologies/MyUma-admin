import axios from "axios";
import { store } from "../store/store";
import { setLogout } from "../store/slices/authSlice";
import { APP_MESSAGES } from "../constants/messages";
import { BASE_URL } from "../hook/useUtils";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  console.log("Request Interceptor Called");
  console.log("Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization Header:", config.headers.Authorization);
  } else {
    console.log("No token found");
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(setLogout());
      window.location.href = "/login";
      console.error(APP_MESSAGES.ERROR_401);
    }
    return Promise.reject(error);
  },
);

export default api;
