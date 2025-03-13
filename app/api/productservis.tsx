
import axios from "axios";

const API_URL = "http://localhost:3001/product";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};



export const createProduct = async (formData: FormData) => {
  return axios.post(`${API_URL}/create`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
};

export const updateProduct = async (id: string, formData: FormData) => {
  return axios.put(`${API_URL}/update/${id}`, formData, {
    headers: { ...getAuthHeaders(), "Content-Type": "multipart/form-data" },
  });
};



