import React, { useState, useMemo } from "react";
import { Miembro } from "../services/MiembroService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Props {
  miembros: Miembro[];
}

const Reportes: React.FC<Props> = ({ miembros }) => {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroCiudad, setFiltroCiudad] = useState<string>("todas");
  const [filtroRango, setFiltroRango] = useState<string>("todos");
  const [filtroEstatus, setFiltroEstatus] = useState<string>("todos");
  const [busqueda, setBusqueda] = useState<string>("");

  const ciudades = useMemo(() => {
    const unique = new Set(miembros.map(m => m.ciudad).filter(Boolean));
    return Array.from(unique).sort();
  }, [miembros]);

  const rangos = useMemo(() => {
    const unique = new Set(miembros.map(m => m.rango).filter(Boolean));
    return Array.from(unique).sort();
  }, [miembros]);

  const estatuses = useMemo(() => {
    const unique = new Set(miembros.map(m => m.estatus).filter(Boolean));
    return Array.from(unique).sort();
  }, [miembros]);

  const miembrosFiltrados = useMemo(() => {
    let resultado = [...miembros];

    if (filtroCiudad !== "todas") {
      resultado = resultado.filter(m => m.ciudad === filtroCiudad);
    }

    if (filtroRango !== "todos") {
      resultado = resultado.filter(m => m.rango === filtroRango);
    }

    if (filtroEstatus !== "todos") {
      resultado = resultado.filter(m => m.estatus === filtroEstatus);
    }

    if (filtroTipo === "licencias-vencer") {
      const hoy = new Date();
      const tresMeses = new Date();
      tresMeses.setMonth(tresMeses.getMonth() + 3);
      
      resultado = resultado.filter(m => {
        if (!m.fechaExpedicionLicenciaConduccion) return false;
        const fechaLic = new Date(m.fechaExpedicionLicenciaConduccion);
        const vigencia = new Date(fechaLic);
        vigencia.setFullYear(vigencia.getFullYear() + 10);
        return vigencia > hoy && vigencia < tresMeses;
      });
    }

    if (filtroTipo === "soat-vencer") {
      const hoy = new Date();
      const unMes = new Date();
      unMes.setMonth(unMes.getMonth() + 1);
      
      resultado = resultado.filter(m => {
        if (!m.fechaExpedicionSOAT) return false;
        const fechaSOAT = new Date(m.fechaExpedicionSOAT);
        const vigencia = new Date(fechaSOAT);
        vigencia.setFullYear(vigencia.getFullYear() + 1);
        return vigencia > hoy && vigencia < unMes;
      });
    }

    if (filtroTipo === "documentos-vencidos") {
      const hoy = new Date();
      
      resultado = resultado.filter(m => {
        let licVencida = false;
        let soatVencido = false;
        
        if (m.fechaExpedicionLicenciaConduccion) {
          const fechaLic = new Date(m.fechaExpedicionLicenciaConduccion);
          const vigencia = new Date(fechaLic);
          vigencia.setFullYear(vigencia.getFullYear() + 10);
          licVencida = vigencia < hoy;
        }
        
        if (m.fechaExpedicionSOAT) {
          const fechaSOAT = new Date(m.fechaExpedicionSOAT);
          const vigencia = new Date(fechaSOAT);
          vigencia.setFullYear(vigencia.getFullYear() + 1);
          soatVencido = vigencia < hoy;
        }
        
        return licVencida || soatVencido;
      });
    }

    if (busqueda.trim()) {
      const termino = busqueda.toLowerCase();
      resultado = resultado.filter(m => 
        m.nombre?.toLowerCase().includes(termino) ||
        m.apellido?.toLowerCase().includes(termino) ||
        m.cedula?.toLowerCase().includes(termino) ||
        m.celular?.toLowerCase().includes(termino)
      );
    }

    return resultado;
  }, [miembros, filtroTipo, filtroCiudad, filtroRango, filtroEstatus, busqueda]);

  const exportarPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text("L.A.M.A Medellín - Reporte de Miembros", 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Total: ${miembrosFiltrados.length} miembros`, 14, 25);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);

      const tableData = miembrosFiltrados.map(m => [
        m.nombre || "",
        m.apellido || "",
        m.cedula || "",
        m.ciudad || "",
        m.celular || "",
        m.moto || "",
        m.marca || "",
        m.rango || "",
        m.estatus || ""
      ]);

      autoTable(doc, {
        head: [['Nombre', 'Apellido', 'Cédula', 'Ciudad', 'Celular', 'Moto', 'Marca', 'Rango', 'Estatus']],
        body: tableData,
        startY: 35,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      doc.save(`reporte-lama-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error al exportar PDF:", error);
      alert("Error al generar el PDF. Por favor, intente nuevamente.");
    }
  };

  const exportarCSV = () => {
    try {
      const headers = [
        "Nombre", "Apellido", "Cédula", "Fecha Nacimiento", "RH", "EPS", "Ciudad", 
        "Dirección", "Celular", "Correo", "Contacto Emergencia", "Fecha Ingreso",
        "Número Miembro", "Cargo", "Rango", "Estatus", "Padrino", "Moto", "Marca",
        "Año", "Cilindraje", "Placa", "Fecha Licencia", "Fecha SOAT"
      ];

      const rows = miembrosFiltrados.map(m => [
        m.nombre, m.apellido, m.cedula, m.fechaNacimiento, m.rh, m.eps, m.ciudad,
        m.direccion, m.celular, m.correoElectronico, m.contactoEmergencia, 
        m.fechaIngreso, m.member, m.cargo, m.rango, m.estatus, m.padrino,
        m.moto, m.marca, m.anoModelo, m.cilindrajeCC, m.placaMatricula,
        m.fechaExpedicionLicenciaConduccion, m.fechaExpedicionSOAT
      ].map(v => `"${v ?? ""}"`));

      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reporte-lama-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al exportar CSV:", error);
      alert("Error al generar el CSV. Por favor, intente nuevamente.");
    }
  };

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-CO");
  };

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>📋 Reportes</h2>
        <div className="export-buttons">
          <button onClick={exportarPDF} className="btn-export">📄 Exportar PDF</button>
          <button onClick={exportarCSV} className="btn-export">📊 Exportar CSV</button>
        </div>
      </div>

      <div className="filtros-avanzados">
        <div className="filtro-grupo">
          <label>Tipo de Reporte:</label>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="todos">Todos los Miembros</option>
            <option value="licencias-vencer">Licencias por Vencer (3 meses)</option>
            <option value="soat-vencer">SOAT por Vencer (1 mes)</option>
            <option value="documentos-vencidos">Documentos Vencidos</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Ciudad:</label>
          <select value={filtroCiudad} onChange={(e) => setFiltroCiudad(e.target.value)}>
            <option value="todas">Todas</option>
            {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Rango:</label>
          <select value={filtroRango} onChange={(e) => setFiltroRango(e.target.value)}>
            <option value="todos">Todos</option>
            {rangos.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Estatus:</label>
          <select value={filtroEstatus} onChange={(e) => setFiltroEstatus(e.target.value)}>
            <option value="todos">Todos</option>
            {estatuses.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div className="filtro-grupo filtro-busqueda">
          <label>Buscar:</label>
          <input
            type="text"
            placeholder="🔍 Nombre, cédula, celular..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      <div className="resultados-info">
        <p>Mostrando <strong>{miembrosFiltrados.length}</strong> de <strong>{miembros.length}</strong> miembros</p>
      </div>

      <div className="tabla-reportes">
        <table>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Cédula</th>
              <th>Ciudad</th>
              <th>Celular</th>
              <th>Moto</th>
              <th>Marca</th>
              <th>Placa</th>
              <th>Rango</th>
              <th>Estatus</th>
              <th>Fecha Licencia</th>
              <th>Fecha SOAT</th>
            </tr>
          </thead>
          <tbody>
            {miembrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center">No se encontraron resultados</td>
              </tr>
            ) : (
              miembrosFiltrados.map(m => (
                <tr key={m.id}>
                  <td>{m.nombre} {m.apellido}</td>
                  <td>{m.cedula}</td>
                  <td>{m.ciudad}</td>
                  <td>{m.celular}</td>
                  <td>{m.moto}</td>
                  <td>{m.marca}</td>
                  <td>{m.placaMatricula}</td>
                  <td>{m.rango}</td>
                  <td>{m.estatus}</td>
                  <td>{formatearFecha(m.fechaExpedicionLicenciaConduccion)}</td>
                  <td>{formatearFecha(m.fechaExpedicionSOAT)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;
