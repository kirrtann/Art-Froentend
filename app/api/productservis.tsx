
import axios from "axios";

const API_URL = "http://localhost:3001/product";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`, {
      headers: getAuthHeaders(),
    });
    return response.data?.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
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

export const deleteProduct = async (id: string) => {
  return axios.delete(`${API_URL}/delete/${id}`, {
    headers: getAuthHeaders(),
  });
};
