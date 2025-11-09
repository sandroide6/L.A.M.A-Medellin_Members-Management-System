import React, { useEffect, useState } from "react";
import Inicio from "../components/Inicio";
import MiembroForm from "../components/MiembroForm";
import MiembrosList from "../components/MiembrosList";
import Estadisticas from "../components/Estadisticas";
import Reportes from "../components/Reportes";
import { getMiembros, deleteMiembro, Miembro } from "../services/MiembroService";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

interface HomePageProps {
  user: any;
}

type TabType = "inicio" | "registro" | "listado" | "estadisticas" | "reportes";

export default function HomePage({ user }: HomePageProps) {
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [seleccionado, setSeleccionado] = useState<Miembro | null>(null);
  const [tabActiva, setTabActiva] = useState<TabType>("inicio");

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
    }
  }, [user]);

  const handleSave = () => {
    setSeleccionado(null);
    cargarMiembros();
    setTabActiva("listado");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Seguro que quieres eliminar este miembro?")) {
      await deleteMiembro(id);
      cargarMiembros();
    }
  };

  const handleEdit = (miembro: Miembro) => {
    setSeleccionado(miembro);
    setTabActiva("registro");
  };

  const logout = async () => await signOut(auth);

  const renderContent = () => {
    switch (tabActiva) {
      case "inicio":
        return <Inicio onNavigate={setTabActiva} />;
      case "registro":
        return (
          <MiembroForm
            miembroSeleccionado={seleccionado}
            onSave={handleSave}
            onCancel={() => {
              setSeleccionado(null);
              setTabActiva("inicio");
            }}
          />
        );
      case "listado":
        return (
          <MiembrosList
            miembros={miembros}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        );
      case "estadisticas":
        return <Estadisticas miembros={miembros} />;
      case "reportes":
        return <Reportes miembros={miembros} />;
      default:
        return <Inicio onNavigate={setTabActiva} />;
    }
  };

  return (
    <div className="homepage-container">
      <header className="header-modern">
        <div className="header-left">
          <h1 className="logo">
            <span className="bike-icon">🏍️</span> L.A.M.A Medellín
          </h1>
        </div>

        <nav className="navigation-tabs">
          <button
            className={`nav-tab ${tabActiva === "inicio" ? "active" : ""}`}
            onClick={() => {
              setTabActiva("inicio");
              setSeleccionado(null);
            }}
          >
            Inicio
          </button>
          <button
            className={`nav-tab ${tabActiva === "registro" ? "active" : ""}`}
            onClick={() => {
              setTabActiva("registro");
              setSeleccionado(null);
            }}
          >
            Registro
          </button>
          <button
            className={`nav-tab ${tabActiva === "listado" ? "active" : ""}`}
            onClick={() => {
              setTabActiva("listado");
              setSeleccionado(null);
            }}
          >
            Listado
          </button>
          <button
            className={`nav-tab ${tabActiva === "estadisticas" ? "active" : ""}`}
            onClick={() => {
              setTabActiva("estadisticas");
              setSeleccionado(null);
            }}
          >
            Estadísticas
          </button>
          <button
            className={`nav-tab ${tabActiva === "reportes" ? "active" : ""}`}
            onClick={() => {
              setTabActiva("reportes");
              setSeleccionado(null);
            }}
          >
            Reportes
          </button>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <img src={user.photoURL} alt="avatar" className="user-avatar" />
            <span className="user-name">{user.displayName || user.email}</span>
          </div>
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}
