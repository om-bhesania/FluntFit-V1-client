import service from "../../services/services";
import apiUrls from "../../utils/apiUrls";

export const AddEmployeeApi = async (data: any, notify: any) => {
  try {
    const res: any = await service({
      url: apiUrls.employee.create,
      method: "post",
      data: data,
    });
    notify(res?.response?.message, { type: "success" });
    return res;
  } catch (error: any) {
    console.log("error api", error);
    notify(error?.response?.data?.message || "Something went wrong", {
      type: "error",
    });
    return { status: "error", error }; // Ensure function always returns something
  }
};

export const GetEmployeeApi = async (notify: any) => {
  try {
    const result: any = await service({
      method: "get",
      url: apiUrls.users.get,
    });
    return result;
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};

export const UpdateEmployeeApi = async (data: any, notify: any) => {
  console.log("data", data);
  try {
    const res: any = await service({
      url: `${apiUrls.employee.update}/${data._id}`,
      method: "put",
      data: data,
    });
    console.log("res api", res);
    notify(res?.response?.message, { type: "success" });
    return res;
  } catch (error: any) {
    console.log("error api", error);
    notify(error?.response?.data?.message || "Something went wrong", {
      type: "error",
    });
    return { status: "error", error }; // Ensure function always returns something
  }
};
