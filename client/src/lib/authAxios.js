import axios from "axios";

export const authAxios = () => {
  const token = localStorage.getItem("token");
  return axios.create({
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  });
};
