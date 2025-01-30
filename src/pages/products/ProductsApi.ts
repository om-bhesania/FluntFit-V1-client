import service from "../../services/services";
import apiUrls from "../../utils/apiUrls";

export const AddProductApi = async (data: any, notify: any) => {
  try {
    await service({
      url: apiUrls.products.post,
      method: "post",
      data: data,
    });
    notify("Product added successfully", {
      type: "success",
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage?.[0], {
      type: "error",
    });
  }
  throw new Error()
};

export const GetProductApi = async (notify: any) => {
  try {
    const result: any = await service({
      method: "get",
      url: apiUrls.products.get,
    });
    return result;
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};

export const DeleteProductApi = async (id: string, notify: any) => {
  try {
    await service({
      method: "delete",
      url: `${apiUrls.products.delete}/${id}`,
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};

export const DeleteAllProductsApi = async (notify: any) => {
  try {
    await service({
      method: "delete",
      url: apiUrls.products.deleteAll,
    });
    notify("Product deleted successfully", {
      type: "success",
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};

export const EditProductApi = async (id: string, notify: any, data: any) => {
  try {
    await service({
      method: "put",
      url: `${apiUrls.products.put}/${id}`,
      data: data,
    });
    notify("Product Edited successfully", {
      type: "success",
    });
  } catch (error: any) {
    const errorMessage = error?.response?.data.messages;
    notify(errorMessage, {
      type: "error",
    });
  }
};
