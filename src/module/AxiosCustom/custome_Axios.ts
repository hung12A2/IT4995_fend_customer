import axios from "axios";

// const BASE_URL = "http://localhost:5050";
const BASE_URL = "https://it4995-bend-kr70.onrender.com/";

const instance = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    let token: any = localStorage.getItem("token");
    if (token) {
      token = JSON.parse(token);
      token = token.token;
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      return config;
    } else {
      return config;
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error.response?.status || 500;
    // we can handle global errors here
    switch (status) {
      // authentication (token related issues)
      case 401: {
        //toast.error("Unauthorized the user.Please login... ");
        return error.response;
      }

      // forbidden (permission related issues)
      case 403: {
        //toast.error("You don't have permission to access this resource...");
        return error.response;
      }

      // bad request
      case 400: {
        //toast.error("Something wrong from server");

        return error.response;
      }

      // not found
      case 404: {
        //toast.error("Not found... ");

        return error.response;
      }

      // conflict
      case 409: {
        return error.response;
      }

      // unprocessable
      case 422: {
        return error.response;
      }

      // generic api error (server related) unexpected
      default: {
        //toast.error("Something wrong... ");
        return error.response;
      }
    }
  }
);
export default instance;
