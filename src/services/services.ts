import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { serviceParams } from "../utils/interfaces";
import { baseUrl } from "./../utils/apiUrls";
import { LogOutApi } from "../pages/auth/login/AuthApis";
import useToast from "../hooks/useToast";

const service = async <T>({
  method,
  url,
  data,
  headers,
  config = {},
  withCredentials, // New prop added
}: serviceParams): Promise<T> => {
  const { notify } = useToast();
  try {
    // Get the token from local storage (or another storage method)
    const token = sessionStorage.getItem("authToken"); // Adjust this based on your storage method

    // Build the request configuration
    const axiosConfig: AxiosRequestConfig = {
      ...config,
      method: method.toLowerCase() as AxiosRequestConfig["method"],
      url: baseUrl + url,
      data,
      headers: {
        ...config.headers,
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }), // Add token if available
      },
      withCredentials, // Include the withCredentials prop here
    };

    // Make the request and return the response data
    const response: AxiosResponse<T> = await axios(axiosConfig);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Log out the user and clear the session
      await LogOutApi(notify); // Assuming this is the function that handles logging out
      sessionStorage.clear();
      window.location.href = "/login"; // Redirect to login page
    } else {
      console.error(`Error during ${method} request to ${url}:`, error);
      throw error;
    }
    return Promise.reject(error);
  }
};

export default service;
