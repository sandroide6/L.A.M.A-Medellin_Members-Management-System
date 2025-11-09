import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api",
});

api.interceptors.request.use(async (config) => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("No se pudo obtener el token de Firebase:", err);
  }
  return config;
});

export default api;
