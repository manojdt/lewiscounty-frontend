import axios from "axios";

let refresh = false;

// const baseUrl = "http://192.168.3.60:8000/api/";

const baseUrl = `${process.env.REACT_APP_BASE_URL}/api/`

// const baseUrl = "https://fe9b-2401-4900-2324-12cc-bce2-16d4-825c-4231.ngrok-free.app/api/"

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.status && (response.status === 200 || response.status === 201)) {
      return {
        data: response.data,
        status: response.status
      };
    }
    return response;
  },
  async (error) => {
    const reasons = ["ERR_BAD_REQUEST", "ERR_NETWORK", "ERR_BAD_RESPONSE"]
    if (error.code && (error.code === "ERR_NETWORK" || error.code === "ERR_BAD_RESPONSE")) {
      error.message = "There is a Server Error. Please try again later."
    }
    if (error.code && error.code === "ERR_BAD_REQUEST" && error.response.status === 401) {
      if (localStorage.getItem('access_token')) {
        window.location.replace(window.location.origin + '/logout')
      }
      error.message = error.response.data?.error || error.response.data?.message
    }
    if (error.code && error.code === "ERR_BAD_REQUEST" && error.response.status === 400) {
      error.message = error.response.data?.error || error.response.data?.message || error.response.data?.email[0]
    }
    if (!reasons.includes(error.code) && error.response.status === 401 && !refresh) {
      refresh = true;
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