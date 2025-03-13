
import apiHelper from "../apiHelper";
import axiosInstance from "../axiosInstance";

interface GetArtParams {
  user_id: string;
  id?: string;
}

export const getallart = () => {
  return axiosInstance.get("product/all");
};

export const getArt = async ({ user_id }: GetArtParams) => {
  return axiosInstance.get(`product/art/${user_id}`);
};

export const updateArt = async (id: string, formData: FormData) => {
  try {
    const response = await axiosInstance.put(`product/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const Cartdata = async (credentials: {
  user_id: string;
  product_id: string;
}) => {
  return apiHelper(axiosInstance.post("order/Postorder", credentials));
};

export const Getorder = async ({ user_id }: GetArtParams) => {
  const response = await axiosInstance.get(`order/history/${user_id}`);
  return response.data;
};

export const searchproduct = async (query: string) => {
  const response = await axiosInstance.get(`/product/search?q=${query}`);
  return response.data?.data || []
};

export const deleteart = async (id: string) => {
  const response = await axiosInstance.delete(`product/delete/${id}`);
  console.log(response);
  
};
