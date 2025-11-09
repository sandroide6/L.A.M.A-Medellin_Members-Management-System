import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import api from "../api"; // 👈 tu archivo con el interceptor axios

export default function LoginPage() {
  const [mensaje, setMensaje] = useState("");

  const login = async () => {
    try {
      // 🔹 Inicia sesión con Google (Firebase)
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setMensaje(`Sesión iniciada como: ${user.email}`);

      // 🔹 Prueba la ruta privada en tu backend (usa el token automáticamente)
      const res = await api.get("/private/test");

      // 🔹 Mostrar respuesta del backend
      setMensaje(`✅ ${res.data}`);
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      setMensaje(
        error.response?.data || "❌ No se pudo conectar al servidor o token inválido"
      );
    }
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    textAlign: "center",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "40px 50px",
    borderRadius: "16px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    backdropFilter: "blur(6px)",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 25px",
    fontSize: "16px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(66,133,244,0.3)",
    fontWeight: "bold",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>🏍️ L.A.M.A Medellín</h1>
        <p style={{ fontSize: 16, marginBottom: 25, color: "#ddd" }}>
          Inicia sesión para acceder al sistema
        </p>

        <button
          style={buttonStyle}
          onClick={login}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#357ae8";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#4285F4";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          Iniciar sesión con Google
        </button>

        {mensaje && (
          <p style={{ marginTop: 25, color: "#00ff99", fontWeight: "bold" }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}
