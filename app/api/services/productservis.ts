import apiHelper from "../apiHelper";
import axiosInstance from "../axiosInstance";

interface GetArtParams {
  user_id: string;
  id?: string;
}

export const getArt = async ({ user_id }: GetArtParams) => {
  return axiosInstance.get(`product/art/${user_id}`);
};

export const deteleart = async ({ id }: GetArtParams) => {
  return axiosInstance.delete(`product/delete${id}`);
};

export const Updateart = async (credentials: {
  email: string;
  password: string;
  mobile_number: string;
  role: string;
  name: string;
}) => {
  return apiHelper(axiosInstance.post("product/ ", credentials));
};
