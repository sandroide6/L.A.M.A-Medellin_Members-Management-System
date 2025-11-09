import React, { useEffect, useState } from "react";
import MiembroForm from "../components/MiembroForm";
import MiembrosList from "../components/MiembrosList";
import { getMiembros, deleteMiembro, Miembro } from "../services/MiembroService";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import api from "../api"; // ✅ Importa Axios con autenticación Firebase

interface HomePageProps {
  user: any;
}

export default function HomePage({ user }: HomePageProps) {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [seleccionado, setSeleccionado] = useState<Miembro | null>(null);

  const cargarMiembros = async () => {
    try {
      const data = await getMiembros();
      setMiembros(data);
    } catch (err) {
      console.error("Error cargando miembros:", err);
    }
  };

  useEffect(() => {
    if (user) {
      cargarMiembros();

      // 🔹 Prueba de conexión con backend autenticado
      const testUser = async () => {
        try {
          const res = await api.get("/miembros/check-user");
          console.log("✅ Backend reconoce al usuario:", res.data);
        } catch (err) {
          console.error("❌ Error al verificar usuario:", err);
        }
      };

      testUser();
    }
  }, [user]);

  const handleSave = () => {
    setSeleccionado(null);
    cargarMiembros();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este miembro?")) {
      await deleteMiembro(id);
      cargarMiembros();
    }
  };

  const logout = async () => await signOut(auth);

  // 🔹 Estilos con animaciones y modernización
  const containerStyle: React.CSSProperties = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#f5f5f5",
    padding: "30px 40px",
    transition: "background 0.3s ease",
  };

  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    padding: "14px 24px",
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 30,
    margin: 0,
    color: "#ffffff",
    transition: "color 0.3s ease",
  };

  const spanHighlightStyle: React.CSSProperties = {
    color: "#4dabf7",
  };

  const userInfoStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  const avatarStyle: React.CSSProperties = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "2px solid #4dabf7",
    transition: "transform 0.3s ease",
  };

  const userNameStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#e0e0e0",
    transition: "color 0.3s ease",
  };

  const logoutButtonStyle: React.CSSProperties = {
    padding: "8px 16px",
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.3s ease",
    boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
  };

  const mainStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 28,
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 28,
    borderRadius: 18,
    boxShadow: "0 14px 35px rgba(0,0,0,0.6)",
    backdropFilter: "blur(12px)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>
          🏍️ <span style={spanHighlightStyle}>L.A.M.A Medellín</span>
        </h1>
        <div style={userInfoStyle}>
          <img
            src={user.photoURL}
            alt="avatar"
            style={avatarStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
          <span style={userNameStyle}>{user.displayName}</span>
          <button
            style={logoutButtonStyle}
            onClick={logout}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#c62828")}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main style={mainStyle}>
        {/* Formulario */}
        <div
          style={cardStyle}
          onMouseOver={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(-4px)";
            el.style.boxShadow = "0 20px 45px rgba(0,0,0,0.7)";
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 14px 35px rgba(0,0,0,0.6)";
          }}
        >
          <MiembroForm
            miembroSeleccionado={seleccionado}
            onSave={handleSave}
            onCancel={() => setSeleccionado(null)}
          />
        </div>

        {/* Lista */}
        <div
          style={cardStyle}
          onMouseOver={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(-4px)";
            el.style.boxShadow = "0 20px 45px rgba(0,0,0,0.7)";
          }}
          onMouseOut={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0)";
            el.style.boxShadow = "0 14px 35px rgba(0,0,0,0.6)";
          }}
        >
          <MiembrosList
            miembros={miembros}
            onEdit={setSeleccionado}
            onDelete={handleDelete}
          />
        </div>
      </main>
    </div>
  );
}

export {};
