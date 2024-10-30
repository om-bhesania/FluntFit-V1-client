import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { serviceParams } from "../utils/interfaces";
import { baseUrl } from "./../utils/apiUrls";

const service = async <T>({
  method,
  url,
  data,
  headers,
  config = {},
}: serviceParams): Promise<T> => {
  try {
    const axiosConfig: AxiosRequestConfig = {
      ...config,
      method: method.toLowerCase() as AxiosRequestConfig["method"],
      url: baseUrl + url,
      data,
      headers: {
        ...config.headers,
        ...headers,
      },
    };

    // Make the request and return the response data
    const response: AxiosResponse<T> = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    console.error(`Error during ${method} request to ${url}:`, error);
    throw error;
  }
};

export default service;
