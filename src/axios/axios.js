import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";

// Memecah hostname berdasarkan tanda titik
const theUrl = window.location.hostname;
// var parts = theUrl.split(".");

// Mengambil elemen yang sesuai indeks (indeks ke-1 dalam hal ini)
// var desiredPart = parts[1];
// const protocol = window.location.protocol;
const instance = axios.create({
  withCredentials: true,
  // baseURL: `https://apx.${desiredPart}.com`,
  baseURL: `https://api-gbvh.ontidecorp.com`,
});
instance.defaults.headers.common["Content-Type"] = "application/json";

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
loadProgressBar(undefined, instance);
export default instance;
