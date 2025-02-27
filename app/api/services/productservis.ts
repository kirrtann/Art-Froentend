import axiosInstance from "../axiosInstance";

interface GetArtParams {
  id: string;
}

export const getArt = async ({ id }: GetArtParams) => {
  return axiosInstance.get(`/art/${id}`);
}