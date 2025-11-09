import React, { useMemo } from "react";
import { Miembro } from "../services/MiembroService";
import jsPDF from "jspdf";

interface Props {
  miembros: Miembro[];
}

const Estadisticas: React.FC<Props> = ({ miembros }) => {
  const stats = useMemo(() => {
    const total = miembros.length;
    const porCiudad: Record<string, number> = {};
    const porRango: Record<string, number> = {};
    const porMarca: Record<string, number> = {};
    const porEstatus: Record<string, number> = {};
    
    let edadTotal = 0;
    let cilindrajeTotal = 0;
    let conLicenciaVigente = 0;
    let conSOATVigente = 0;

    const hoy = new Date();

    miembros.forEach(m => {
      if (m.ciudad) porCiudad[m.ciudad] = (porCiudad[m.ciudad] || 0) + 1;
      if (m.rango) porRango[m.rango] = (porRango[m.rango] || 0) + 1;
      if (m.marca) porMarca[m.marca] = (porMarca[m.marca] || 0) + 1;
      if (m.estatus) porEstatus[m.estatus] = (porEstatus[m.estatus] || 0) + 1;
      
      if (m.fechaNacimiento) {
        const edad = hoy.getFullYear() - new Date(m.fechaNacimiento).getFullYear();
        edadTotal += edad;
      }
      
      cilindrajeTotal += m.cilindrajeCC || 0;
      
      if (m.fechaExpedicionLicenciaConduccion) {
        const fechaLic = new Date(m.fechaExpedicionLicenciaConduccion);
        const vigenciaLic = new Date(fechaLic);
        vigenciaLic.setFullYear(vigenciaLic.getFullYear() + 10);
        if (vigenciaLic > hoy) conLicenciaVigente++;
      }
      
      if (m.fechaExpedicionSOAT) {
        const fechaSOAT = new Date(m.fechaExpedicionSOAT);
        const vigenciaSOAT = new Date(fechaSOAT);
        vigenciaSOAT.setFullYear(vigenciaSOAT.getFullYear() + 1);
        if (vigenciaSOAT > hoy) conSOATVigente++;
      }
    });

    const edadPromedio = total > 0 ? Math.round(edadTotal / total) : 0;
    const cilindrajePromedio = total > 0 ? Math.round(cilindrajeTotal / total) : 0;

    return {
      total,
      porCiudad,
      porRango,
      porMarca,
      porEstatus,
      edadPromedio,
      cilindrajePromedio,
      conLicenciaVigente,
      conSOATVigente
    };
  }, [miembros]);

  const exportarPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("L.A.M.A Medellín - Estadísticas", 14, 20);
      
      doc.setFontSize(12);
      let y = 35;
      
      doc.text(`Total de Miembros: ${stats.total}`, 14, y);
      y += 10;
      doc.text(`Edad Promedio: ${stats.edadPromedio} años`, 14, y);
      y += 10;
      doc.text(`Cilindraje Promedio: ${stats.cilindrajePromedio} CC`, 14, y);
      y += 10;
      doc.text(`Licencias Vigentes: ${stats.conLicenciaVigente}`, 14, y);
      y += 10;
      doc.text(`SOATs Vigentes: ${stats.conSOATVigente}`, 14, y);
      y += 15;
      
      doc.setFontSize(14);
      doc.text("Distribución por Ciudad:", 14, y);
      y += 8;
      doc.setFontSize(11);
      Object.entries(stats.porCiudad).forEach(([ciudad, count]) => {
        doc.text(`  ${ciudad}: ${count}`, 14, y);
        y += 6;
      });
      
      y += 10;
      doc.setFontSize(14);
      doc.text("Distribución por Marca:", 14, y);
      y += 8;
      doc.setFontSize(11);
      Object.entries(stats.porMarca).slice(0, 10).forEach(([marca, count]) => {
        doc.text(`  ${marca}: ${count}`, 14, y);
        y += 6;
      });
      
      doc.save("estadisticas-lama.pdf");
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  const exportarCSV = () => {
    try {
      const data = [
        ["Métrica", "Valor"],
        ["Total de Miembros", stats.total],
        ["Edad Promedio", `${stats.edadPromedio} años`],
        ["Cilindraje Promedio", `${stats.cilindrajePromedio} CC`],
        ["Licencias Vigentes", stats.conLicenciaVigente],
        ["SOATs Vigentes", stats.conSOATVigente],
        [""],
        ["Ciudad", "Cantidad"],
        ...Object.entries(stats.porCiudad),
        [""],
        ["Marca", "Cantidad"],
        ...Object.entries(stats.porMarca)
      ];

      const csv = data.map(row => row.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "estadisticas-lama.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al generar el CSV. Por favor, intente nuevamente.");
    }
  };

  return (
    <div className="estadisticas-container">
      <div className="estadisticas-header">
        <h2>📊 Estadísticas del Club</h2>
        <div className="export-buttons">
          <button onClick={exportarPDF} className="btn-export">📄 Exportar PDF</button>
          <button onClick={exportarCSV} className="btn-export">📊 Exportar CSV</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Miembros</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎂</div>
          <div className="stat-content">
            <h3>{stats.edadPromedio}</h3>
            <p>Edad Promedio</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏍️</div>
          <div className="stat-content">
            <h3>{stats.cilindrajePromedio} CC</h3>
            <p>Cilindraje Promedio</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.conLicenciaVigente}</h3>
            <p>Licencias Vigentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <h3>{stats.conSOATVigente}</h3>
            <p>SOATs Vigentes</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <h3>{Object.keys(stats.porCiudad).length}</h3>
            <p>Ciudades</p>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>🌆 Distribución por Ciudad</h3>
          <div className="chart-bars">
            {Object.entries(stats.porCiudad)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([ciudad, count]) => (
                <div key={ciudad} className="bar-item">
                  <span className="bar-label">{ciudad}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>🏆 Distribución por Rango</h3>
          <div className="chart-bars">
            {Object.entries(stats.porRango)
              .sort((a, b) => b[1] - a[1])
              .map(([rango, count]) => (
                <div key={rango} className="bar-item">
                  <span className="bar-label">{rango}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>🏍️ Marcas Más Populares</h3>
          <div className="chart-bars">
            {Object.entries(stats.porMarca)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([marca, count]) => (
                <div key={marca} className="bar-item">
                  <span className="bar-label">{marca}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>✅ Estatus de Miembros</h3>
          <div className="chart-bars">
            {Object.entries(stats.porEstatus)
              .sort((a, b) => b[1] - a[1])
              .map(([estatus, count]) => (
                <div key={estatus} className="bar-item">
                  <span className="bar-label">{estatus}</span>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="bar-value">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
