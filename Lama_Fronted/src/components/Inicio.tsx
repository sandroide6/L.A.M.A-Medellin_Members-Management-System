import React from "react";

type TabType = "inicio" | "registro" | "listado" | "estadisticas" | "reportes";

interface Props {
  onNavigate: (tab: TabType) => void;
}

const Inicio: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="inicio-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="bike-icon">🏍️</span> L.A.M.A Medellín
          </h1>
          <h2 className="hero-subtitle">Sistema de Gestión de Miembros</h2>
          <p className="hero-description">
            Administra de manera eficiente la información de todos los miembros del club, sus motos,
            documentación y datos de contacto en un solo lugar.
          </p>
          
          <div className="hero-buttons">
            <button className="btn-primary-hero" onClick={() => onNavigate("registro")}>
              Registrar Nuevo Miembro
            </button>
            <button className="btn-secondary-hero" onClick={() => onNavigate("listado")}>
              Ver Listado
            </button>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2 className="section-title">Características del Sistema</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Registro Completo</h3>
            <p>Captura toda la información personal, laboral y de contacto de manera organizada, con validaciones automáticas.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Listado y Filtros</h3>
            <p>Visualiza todos los miembros con opciones de búsqueda y filtrado por diferentes campos.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Exportar PDF</h3>
            <p>Genera reportes profesionales en PDF con la información completa para archivo e impresión.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Importar Datos</h3>
            <p>Carga información en lote desde archivos CSV, validando formato y datos automáticamente.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏍️</div>
            <h3>Información de Motos</h3>
            <p>Registra datos completos de los vehículos: marca, modelo, cilindraje, placas y documentación.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Seguridad</h3>
            <p>Autenticación con Google y validación por Firebase para proteger la información.</p>
          </div>
        </div>
      </div>

      <div className="management-section">
        <h2 className="section-title">Gestión Profesional</h2>
        <div className="management-grid">
          <div className="management-card">
            <div className="management-stat">100%</div>
            <div className="management-label">Responsivo</div>
          </div>

          <div className="management-card">
            <div className="management-stat">⚡</div>
            <div className="management-label">Rápido y Eficiente</div>
          </div>

          <div className="management-card">
            <div className="management-stat">🔒</div>
            <div className="management-label">Seguro</div>
          </div>

          <div className="management-card">
            <div className="management-stat">☁️</div>
            <div className="management-label">En la Nube</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
