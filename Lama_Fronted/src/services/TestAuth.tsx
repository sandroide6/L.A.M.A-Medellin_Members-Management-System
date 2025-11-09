// import React, { useEffect, useState } from "react";
// import api from "../api";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// export default function TestAuth() {
//   const [mensaje, setMensaje] = useState("Verificando...");
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           // ✅ Llamada a la ruta privada
//           const res = await api.get("/private/test");
//           setMensaje(res.data);
//         } catch (error: any) {
//           if (error.response?.status === 401) {
//             setMensaje("No autorizado (token faltante o inválido)");
//           } else {
//             setMensaje("Error al conectar con la API");
//           }
//         }
//       } else {
//         setMensaje("Usuario no autenticado");
//       }
//     });

//     return () => unsubscribe();
//   }, [auth]);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Ruta privada:</h2>
//       <p>{mensaje}</p>
//     </div>
//   );
// }
export {};
