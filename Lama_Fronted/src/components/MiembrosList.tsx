import React, { useState } from "react";
import { Miembro } from "../services/MiembroService";

interface Props {
  miembros: Miembro[];
  onEdit: (miembro: Miembro) => void;
  onDelete: (id: string) => void;
}

const MiembrosList: React.FC<Props> = ({ miembros, onEdit, onDelete }) => {
  const [campoFiltro, setCampoFiltro] = useState<keyof Miembro>("nombre");
  const [valorFiltro, setValorFiltro] = useState<string>("");

  const camposOpciones: (keyof Miembro)[] = [
    "nombre","apellido","cedula","ciudad","direccion","celular",
    "correoElectronico","moto","marca","anoModelo","cilindrajeCC","placaMatricula",
    "cargo","rango","estatus","padrino"
  ];

  const miembrosFiltrados = miembros.filter((m) => {
    const valor = m[campoFiltro];
    if (!valor) return false;
    return valor.toString().toLowerCase().includes(valorFiltro.toLowerCase());
  });

  const exportCSV = () => {
    if (miembrosFiltrados.length === 0) return;
    const headers = Object.keys(miembrosFiltrados[0]);
    const rows = miembrosFiltrados.map((m) =>
      headers.map((h) => `"${(m as any)[h] ?? ""}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "miembros.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="miembros-container-premium">
      <div className="miembros-header-premium">
        <h2>🧾 Lista de Miembros</h2>
        <button className="btn-export-premium" onClick={exportCSV}>
          Exportar CSV
        </button>
      </div>

      <div className="miembros-filtro-premium responsive-filtro">
        <select
          value={campoFiltro}
          onChange={(e) => setCampoFiltro(e.target.value as keyof Miembro)}
        >
          {camposOpciones.map((campo) => (
            <option key={campo} value={campo}>{campo}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="🔍 Buscar..."
          value={valorFiltro}
          onChange={(e) => setValorFiltro(e.target.value)}
        />
      </div>

      <div className="table-scroll-premium">
        <table>
          <thead>
            <tr>
              {["Nombre","Apellido","Cédula","Ciudad","Dirección","Celular","Correo",
                "Moto","Marca","Año","Cilindraje","Placa","Cargo","Rango","Estatus","Padrino","Acciones"]
                .map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {miembrosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={17} className="td-center-premium">Sin miembros registrados</td>
              </tr>
            ) : (
              miembrosFiltrados.map((m) => (
                <tr key={m.id} className="tr-hover-premium">
                 <td>{m.nombre}</td>
<td>{m.apellido}</td>
<td>{m.cedula}</td>
<td>{m.ciudad}</td>
<td>{m.direccion}</td>
<td>{m.celular}</td>
<td>{m.correoElectronico}</td>
<td>{m.moto}</td>
<td>{m.marca}</td>
<td>{m.anoModelo}</td>
<td>{m.cilindrajeCC}</td>
<td>{m.placaMatricula}</td>
<td>{m.cargo}</td>
<td>{m.rango}</td>
<td>{m.estatus}</td>
<td>{m.padrino}</td>
                
                  <td data-label="Acciones" className="td-acciones-premium">
                    <button className="btn-edit-premium" onClick={() => onEdit(m)}>✏️</button>
                    <button className="btn-delete-premium" onClick={() => onDelete(m.id!)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MiembrosList;
