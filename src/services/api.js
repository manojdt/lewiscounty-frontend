import axios from "axios";

let refresh = false;

// const baseUrl = "http://52.88.78.226:8000/api";

const baseUrl = "https://mentor-backend.dataterrain-dev.net/api"

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // console.log("Res", response);
    if (response.status && (response.status === 200 || response.status === 201)) {
      return {
        data: response.data,
        status: response.status
      };
    }
    return response;
  },
  async (error) => {
    console.log('error', error)
    console.log(error.response)
    const reasons = ["ERR_BAD_REQUEST", "ERR_NETWORK", "ERR_BAD_RESPONSE"]
    if (error.code && (error.code === "ERR_NETWORK" || error.code === "ERR_BAD_RESPONSE")) {
      error.message = "There is a Server Error. Please try again later."
    }
    if (error.code && error.code === "ERR_BAD_REQUEST" && error.response.status === 401) {
      error.message = "Invalid Credentials"
    }
    if (error.code && error.code === "ERR_BAD_REQUEST" && error.response.status === 400) {
      error.message = "Something went wrong. Please try again later"
    }
    if (!reasons.includes(error.code) && error.response.status === 401 && !refresh) {
      refresh = true;
      console.log(localStorage.getItem("refresh_token"));
      try {
        const response = await axios.post(
          `${baseUrl}/token/refresh`, {
            refresh: localStorage.getItem("refresh_token")
          }, {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data["access"]}`;
          localStorage.setItem("access_token", response.data.access);
          localStorage.setItem("refresh_token", response.data.refresh);
          return axios(error.config);
        }
      } catch (error) {
        console.error("Token refresh error:", error);
      }
    }
    refresh = false;
    return Promise.reject(error);
  }
);

export default api;