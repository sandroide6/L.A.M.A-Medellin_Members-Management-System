import axios from "axios";
import { getAuth } from "firebase/auth";

const api = axios.create({
  baseURL: "https://l-a-m-a-medell-n-members-management.onrender.com/api",
});

api.interceptors.request.use(async (config) => {
  try {
    const user = getAuth().currentUser;
    if (user) {
      const token = await user.getIdToken();

      // ✅ Aseguramos que headers exista y tenga tipo compatible
      config.headers = config.headers || {};
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.warn("No se pudo obtener el token de Firebase:", err);
  }

  return config;
});


export default api;



