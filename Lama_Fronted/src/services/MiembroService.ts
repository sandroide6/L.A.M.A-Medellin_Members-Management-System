import api from "../api";
import { getAuth } from "firebase/auth"; // 🔥 Importa Firebase Auth

// ✅ Interfaz completa de miembro sincronizada con backend (.NET / Firestore)
export interface Miembro {
  id?: string;
  UserId?: string; // 🔹 Asociado al usuario autenticado

  // 🧍 Datos personales
  nombre: string;
  apellido: string;
  cedula?: string;
  fechaNacimiento?: string;
  rh?: string;
  eps?: string;
  ciudad?: string;
  direccion?: string;
  celular: string;
  correoElectronico: string;
  contactoEmergencia?: string;

  // 🏍️ Información del miembro
  fechaIngreso?: string;
  member?: number;
  cargo?: string;
  rango?: string;
  estatus?: string;
  padrino?: string;
  foto?: string;

  // 🏍️ Moto
  moto: string;
  marca: string;
  anoModelo?: number;
  cilindrajeCC?: number;
  placaMatricula?: string;

  // 📄 Fechas de documentos
  fechaExpedicionLicenciaConduccion?: string;
  fechaExpedicionSOAT?: string;
}

// ✅ Obtener SOLO los miembros del usuario autenticado
export const getMiembros = async (): Promise<Miembro[]> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Usuario no autenticado");

    const res = await api.get(`/miembros`);
    return res.data;
  } catch (err) {
    console.error("❌ Error obteniendo miembros:", err);
    throw err;
  }
};

// ✅ Crear miembro (agrega automáticamente el UserId con mayúscula)
export const createMiembro = async (miembro: Miembro) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Usuario no autenticado");

    // 🔹 Añadimos el UserId con el UID de Firebase (mayúscula)
    const miembroConUsuario = { ...miembro, UserId: user.uid };

    // 🔹 Formateamos las fechas
    const miembroFormateado = formatearFechas(miembroConUsuario);

    // 🔹 Eliminamos campos vacíos o undefined
    const miembroFiltrado = Object.fromEntries(
      Object.entries(miembroFormateado).filter(([_, v]) => v !== undefined && v !== "")
    );

    console.log("📤 Enviando miembro al backend (POST):", miembroFiltrado);

    const res = await api.post("/miembros", miembroFiltrado, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Error creando miembro:", err);
    throw err;
  }
};

// ✅ Actualizar miembro (también con UserId)
export const updateMiembro = async (id: string, miembro: Miembro) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("Usuario no autenticado");

    const miembroConUsuario = { ...miembro, UserId: user.uid };
    const miembroFormateado = formatearFechas(miembroConUsuario);

    const miembroFiltrado = Object.fromEntries(
      Object.entries(miembroFormateado).filter(([_, v]) => v !== undefined && v !== "")
    );

    console.log("📤 Enviando miembro al backend (PUT):", miembroFiltrado);

    const res = await api.put(`/miembros/${id}`, miembroFiltrado, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    console.error("❌ Error actualizando miembro:", err);
    throw err;
  }
};

// ✅ Eliminar miembro
export const deleteMiembro = async (id: string) => {
  try {
    await api.delete(`/miembros/${id}`);
  } catch (err) {
    console.error("❌ Error eliminando miembro:", err);
    throw err;
  }
};

// 🔹 Formatea fechas a ISO
const formatearFechas = (miembro: Miembro): Miembro => {
  const convertirFecha = (f?: string) => (f ? new Date(f).toISOString() : undefined);

  return {
    ...miembro,
    fechaNacimiento: convertirFecha(miembro.fechaNacimiento),
    fechaIngreso: convertirFecha(miembro.fechaIngreso),
    fechaExpedicionLicenciaConduccion: convertirFecha(miembro.fechaExpedicionLicenciaConduccion),
    fechaExpedicionSOAT: convertirFecha(miembro.fechaExpedicionSOAT),
  };
};
