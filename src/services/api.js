import axios from "axios";

let refresh = false;

const baseUrl = "http://52.88.78.226:8000/api";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.response.use(
  (response) => {
    console.log("Res", response);
    if (response.status === 200) {
      return { data: response.data, status : response.status };
    }
    return response;
  },
  async (error) => {
    if (error.response.status === 401 && !refresh) {
      refresh = true;
      console.log(localStorage.getItem("refresh_token"));
      try {
        const response = await axios.post(
          `${baseUrl}/token/refresh`,
          { refresh: localStorage.getItem("refresh_token") },
          {
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
