import React, { useEffect, useState } from "react";
import { createMiembro, updateMiembro, Miembro } from "../services/MiembroService";

interface Props {
  miembroSeleccionado: Miembro | null;
  onSave: () => void;
  onCancel: () => void;
}

const secciones = [
  {
    titulo: "Datos Personales",
    campos: [
      { name: "nombre", placeholder: "Nombre", tipo: "text", soloLetras: true },
      { name: "apellido", placeholder: "Apellido", tipo: "text", soloLetras: true },
      { name: "cedula", placeholder: "Cédula", tipo: "text", soloNumeros: true },
      { name: "fechaNacimiento", placeholder: "Fecha de Nacimiento", tipo: "date" },
      { name: "rh", placeholder: "RH", tipo: "text" },
      { name: "eps", placeholder: "EPS", tipo: "text", soloLetras: true },
      { name: "ciudad", placeholder: "Ciudad", tipo: "text", soloLetras: true },
      { name: "direccion", placeholder: "Dirección", tipo: "text" },
    ],
  },
  {
    titulo: "Información de Contacto",
    campos: [
      { name: "celular", placeholder: "Celular", tipo: "text", soloNumeros: true },
      { name: "correoElectronico", placeholder: "Correo Electrónico", tipo: "email" },
      { name: "contactoEmergencia", placeholder: "Contacto de Emergencia", tipo: "text" },
    ],
  },
  {
    titulo: "Datos Laborales y Administrativos",
    campos: [
      { name: "fechaIngreso", placeholder: "Fecha de Ingreso", tipo: "date" },
      { name: "member", placeholder: "Número de Miembro", tipo: "number" },
      { name: "cargo", placeholder: "Cargo", tipo: "text", soloLetras: true },
      { name: "rango", placeholder: "Rango", tipo: "text", soloLetras: true },
      { name: "estatus", placeholder: "Estatus", tipo: "text", soloLetras: true },
      { name: "padrino", placeholder: "Padrino", tipo: "text", soloLetras: true },
      { name: "foto", placeholder: "URL Foto", tipo: "text" },
    ],
  },
  {
    titulo: "Información de Vehículo",
    campos: [
      { name: "moto", placeholder: "Modelo de Moto", tipo: "text" },
      { name: "marca", placeholder: "Marca", tipo: "text", soloLetras: true },
      { name: "anoModelo", placeholder: "Año / Modelo", tipo: "number" },
      { name: "cilindrajeCC", placeholder: "Cilindraje (CC)", tipo: "number" },
      { name: "placaMatricula", placeholder: "Placa", tipo: "text" },
    ],
  },
  {
    titulo: "Documentación y Fechas",
    campos: [
      { name: "fechaExpedicionLicenciaConduccion", placeholder: "Fecha Licencia", tipo: "date" },
      { name: "fechaExpedicionSOAT", placeholder: "Fecha SOAT", tipo: "date" },
    ],
  },
];

type MiembroEditable = Partial<Miembro>;

const MiembroForm: React.FC<Props> = ({ miembroSeleccionado, onSave, onCancel }) => {
  const [miembro, setMiembro] = useState<MiembroEditable>({});
  const [errores, setErrores] = useState<Record<string, string>>({});

  useEffect(() => {
    setMiembro(miembroSeleccionado || {});
    setErrores({});
  }, [miembroSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const config = secciones.flatMap(s => s.campos).find(c => c.name === name);

    if (config?.soloLetras && /[0-9]/.test(value)) return;
    if (config?.soloNumeros && /[a-zA-Z]/.test(value)) return;

    setMiembro(m => ({ ...m, [name]: value }));
    setErrores(err => ({ ...err, [name]: "" }));
  };

  const validarCampos = () => {
    const nuevosErrores: Record<string, string> = {};
    const hoy = new Date();
    const añoActual = hoy.getFullYear();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
    const urlImagenRegex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;

    secciones.flatMap(s => s.campos).forEach(c => {
      const valor = (miembro as any)[c.name];

      if (!valor || valor.toString().trim() === "") {
        nuevosErrores[c.name] = `${c.placeholder} es obligatorio.`;
        return;
      }

      switch (c.name) {
        case "cedula":
          if (!/^\d{6,10}$/.test(valor))
            nuevosErrores[c.name] = "La cédula debe tener entre 6 y 10 dígitos.";
          break;
        case "correoElectronico":
          if (!emailRegex.test(valor))
            nuevosErrores[c.name] = "Correo electrónico inválido.";
          break;
        case "celular":
          if (!/^\d{10}$/.test(valor))
            nuevosErrores[c.name] = "El celular debe tener 10 dígitos.";
          break;
        case "placaMatricula":
          if (!/^[A-Z]{3}\d{3}$/.test(valor.toUpperCase()))
            nuevosErrores[c.name] = "Formato de placa inválido (ABC123).";
          break;
        case "foto":
          if (!urlImagenRegex.test(valor))
            nuevosErrores[c.name] = "Debe ser una URL válida de imagen.";
          break;
        case "fechaNacimiento":
        case "fechaIngreso":
        case "fechaExpedicionLicenciaConduccion":
        case "fechaExpedicionSOAT":
          if (new Date(valor) > hoy)
            nuevosErrores[c.name] = "La fecha no puede ser futura.";
          break;
        case "anoModelo":
          const año = Number(valor);
          if (año < 1990 || año > añoActual + 1)
            nuevosErrores[c.name] = `El año debe ser entre 1990 y ${añoActual + 1}.`;
          break;
        case "cilindrajeCC":
          const cc = Number(valor);
          if (cc < 50 || cc > 2000)
            nuevosErrores[c.name] = "Cilindraje fuera de rango (50 – 2000cc).";
          break;
      }
    });

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const miembroFinal: Miembro = {
      id: miembro.id ? String(miembro.id) : undefined, // ⚡ sin "0"
      nombre: miembro.nombre || "",
      apellido: miembro.apellido || "",
      cedula: miembro.cedula || "",
      fechaNacimiento: miembro.fechaNacimiento || "",
      rh: miembro.rh || "",
      eps: miembro.eps || "",
      ciudad: miembro.ciudad || "",
      direccion: miembro.direccion || "",
      celular: miembro.celular || "",
      correoElectronico: miembro.correoElectronico || "",
      contactoEmergencia: miembro.contactoEmergencia || "",
      fechaIngreso: miembro.fechaIngreso || "",
      member: Number(miembro.member || 0),
      cargo: miembro.cargo || "",
      rango: miembro.rango || "",
      estatus: miembro.estatus || "",
      padrino: miembro.padrino || "",
      foto: miembro.foto || "",
      moto: miembro.moto || "",
      marca: miembro.marca || "",
      anoModelo: Number(miembro.anoModelo || 0),
      cilindrajeCC: Number(miembro.cilindrajeCC || 0),
      placaMatricula: miembro.placaMatricula || "",
      fechaExpedicionLicenciaConduccion: miembro.fechaExpedicionLicenciaConduccion || "",
      fechaExpedicionSOAT: miembro.fechaExpedicionSOAT || "",
    };

    try {
      // ✅ Solo actualizar si el ID es válido (no "0" ni undefined)
      if (miembroFinal.id && miembroFinal.id !== "0") {
        await updateMiembro(miembroFinal.id, miembroFinal);
      } else {
        await createMiembro(miembroFinal);
      }
      onSave();
    } catch (err) {
      console.error("Error guardando miembro:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card-premium">
      <h2 className="form-title">
        {miembro.id ? "✏️ Editar Miembro" : "🆕 Registrar Nuevo Miembro"}
      </h2>

      {secciones.map(seccion => (
        <div key={seccion.titulo} className="form-section">
          <h3 className="form-subtitle">{seccion.titulo}</h3>
          <div className="form-fields">
            {seccion.campos.map(campo => (
              <div key={campo.name} className="form-field-container">
                <input
                  type={campo.tipo}
                  name={campo.name}
                  placeholder={campo.placeholder}
                  value={(miembro as any)[campo.name] || ""}
                  onChange={handleChange}
                  className={`form-input ${campo.tipo === "number" ? "no-spinner" : ""}`}
                />
                {/* Texto descriptivo para fechas */}
                {["fechaNacimiento", "fechaIngreso", "fechaExpedicionLicenciaConduccion", "fechaExpedicionSOAT"].includes(campo.name) && (
                  <span style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                    {campo.name === "fechaNacimiento" && "Fecha de nacimiento del miembro"}
                    {campo.name === "fechaIngreso" && "Fecha de ingreso al grupo"}
                    {campo.name === "fechaExpedicionLicenciaConduccion" && "Fecha de expedición de la licencia de conducción"}
                    {campo.name === "fechaExpedicionSOAT" && "Fecha de expedición del SOAT"}
                  </span>
                )}
                {errores[campo.name] && <span className="form-error">{errores[campo.name]}</span>}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="form-buttons">
        <button type="submit" className="form-btn-primary">
          {miembro.id ? "Actualizar" : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} className="form-btn-cancel">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default MiembroForm;
