// src/services/apii.ts
import api from "../api";

// Ejemplo: obtener datos privados
export const getPrivateData = async () => {
  try {
    const res = await api.get("/private/test");
    return res.data;
  } catch (err) {
    console.error("Error al obtener datos privados:", err);
    throw err;
  }
};

// Ejemplo: obtener datos públicos
export const getPublicData = async () => {
  try {
    const res = await api.get("/public/test");
    return res.data;
  } catch (err) {
    console.error("Error al obtener datos públicos:", err);
    throw err;
  }
};
