import axios from "axios";
import { getAuth } from "firebase/auth";

const getBackendUrl = () => {
  const replitDomain = process.env.REPLIT_DEV_DOMAIN;
  if (replitDomain) {
    return `https://${replitDomain}:8000/api`;
  }
  return process.env.REACT_APP_API_URL || "http://localhost:8000/api";
};

const api = axios.create({
  baseURL: getBackendUrl(),
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



