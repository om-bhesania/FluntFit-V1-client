import service from "../../services/services";
import apiUrls from "../../utils/apiUrls";

export const AddInvoiceApi = async (data: any, notify: any) => {
  try {
    const res: any = await service({
      url: apiUrls.invoice.post,
      method: "post",
      data: data,
    });
    notify(res.response.message, {
      type: "success",
    });
    return res;
  } catch (error: any) {
    notify(error.response.data.message, {
      type: "error",
    });
  }
};

export const GetInvoiceApi = async (notify: any) => {
  try {
    const res: any = await service({
      url: apiUrls.invoice.get,
      method: "get",
    });
    // Notify and return data if available
    if (res?.data) {
      return res.data;
    }
  } catch (error: any) {
    notify(error?.response?.data?.message || "An error occurred", {
      type: "error",
    });
    return null;
  }
};

export const DeleteInvoiceApi = async (id: string, notify: any) => {
  try {
    const res: any = await service({
      url: `${apiUrls.invoice.delete}/${id}`,
      method: "delete",
    });
    notify(res.response.message, {
      type: "success",
    });
  } catch (error: any) {
    console.log(error);
    notify(error.response.data.message, {
      type: "error",
    });
    return null;
  }
};
