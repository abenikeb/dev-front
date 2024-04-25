/** @format */

import axios from "axios";
import Cookies from "js-cookie";

// Function to retrieve the token from the cookie
const getToken = async () => {
  return Cookies.get("token");
};

// const axiosInstance = axios.create({
//   timeout: 6000000,
//   baseURL: "/",
//   headers: {
//     Authorization: "Bearer " + Cookies.get("token"),
//     "Content-Type": "application/json",
//   },
// });

const axiosInstance = axios.create({
  timeout: 6000000,
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken();
      console.log({ token });
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.log({ error });
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  patch: axiosInstance.patch,
  delete: axiosInstance.delete,
};
