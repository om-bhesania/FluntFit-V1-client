import service from "../../services/services";
import apiUrls from "../../utils/apiUrls";


export const AddCustomersApi = async (data: any, notify: any) => {
  try {
    await service({
      url: apiUrls.customer.post,
      method: "post",
      data: data,
    });
    notify("Product added successfully", {
      type: "success",
    });
  } catch (error: any) { 
    notify(error.response.data.message, {
      type: "error",
    });
  }
};


export const GetCustomerApi = async (notify: any) => {
  try {
    const result: any = await service({
      method: "get",
      url: apiUrls.customer.get,
    }); 
    return result?.response.customers;
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};
