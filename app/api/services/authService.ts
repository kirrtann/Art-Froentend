
import apiHelper from "../apiHelper"
import axiosInstance from "../axiosInstance";

export const signup = async (credentials: { email: string; password: string,mobile_number :string,role:string,name:string,   }) => {
  
  return apiHelper(axiosInstance.post('/auth/signup', credentials));
};

export const login = async (credentical:{email:string,password:string} ) =>{
return apiHelper(axiosInstance.post('auth/login',credentical))
}

export const logout = async () => {
  localStorage.removeItem("token")
}



