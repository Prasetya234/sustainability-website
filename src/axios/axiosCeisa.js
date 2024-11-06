import axios from "axios";
import { loadProgressBar } from "axios-progress-bar";

export const AxiosInstance = (token) => {
  if (!token) return console.log("tidak ada token");
  const theUrl = `https://apis-gw.beacukai.go.id/openapi/`;

  const instance = axios.create({
    baseURL: theUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined, // Jika tidak ada token, biarkan header Authorization kosong
    },
  });

  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Interceptor untuk menangani response error
  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  // Load progress bar
  loadProgressBar(undefined, instance);

  return instance;
};
