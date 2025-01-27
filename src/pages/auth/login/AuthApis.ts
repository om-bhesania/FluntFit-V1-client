import service from "../../../services/services";
import apiUrls from "../../../utils/apiUrls";

export const LoginApi = async (data: any, notify: any) => {
  try {
    const res = await service({
      url: apiUrls.auth.login,
      method: "post",
      data: data,
    });

    notify("User Successfully Logged In", {
      type: "success",
    });
    return res;
  } catch (error: any) {
    notify(error?.response?.data.message, {
      type: "error",
    });
  }
};

export const LogOutApi = async (notify: any) => {
  try {
    const res = await service({
      url: apiUrls.auth.logout,
      method: "post",
    });
    return res;
  } catch (error: any) {
    notify(error?.response?.data.message, {
      type: "error",
    });
  }
};

export const PingApi = async (notify: any) => {
  try {
    const res = await service({
      url: apiUrls.auth.ping,
      method: "post",
    });
    return res;
  } catch (error: any) {
    notify(error?.response?.data.message, {
      type: "error",
    });
  }
};
