using Google.Cloud.Firestore;
using System;
using System.ComponentModel.DataAnnotations;

namespace LAMA_API.Models
{
    [FirestoreData]
    public class Miembro
    {
        [FirestoreDocumentId]
        public string? Id { get; set; }

         [FirestoreProperty]
        public string UserId { get; set; }

        // 🔹 Datos personales
        [FirestoreProperty, Required]
        public string Nombre { get; set; } = "";

        [FirestoreProperty, Required]
        public string Apellido { get; set; } = "";

        [FirestoreProperty]
        public string Cedula { get; set; } = "";

        private DateTime _fechaNacimiento;
        [FirestoreProperty]
        public DateTime FechaNacimiento
        {
            get => _fechaNacimiento;
            set => _fechaNacimiento = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        [FirestoreProperty]
        public string RH { get; set; } = "";

        [FirestoreProperty]
        public string EPS { get; set; } = "";

        [FirestoreProperty]
        public string Ciudad { get; set; } = "";

        [FirestoreProperty]
        public string Direccion { get; set; } = "";

        [FirestoreProperty]
        public string Celular { get; set; } = "";

        [FirestoreProperty]
        public string CorreoElectronico { get; set; } = "";

        [FirestoreProperty]
        public string ContactoEmergencia { get; set; } = "";

        // 🔹 Información de miembro
        private DateTime _fechaIngreso;
        [FirestoreProperty]
        public DateTime FechaIngreso
        {
            get => _fechaIngreso;
            set => _fechaIngreso = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        [FirestoreProperty]
        public int Member { get; set; }

        [FirestoreProperty]
        public string Cargo { get; set; } = "";

        [FirestoreProperty]
        public string Rango { get; set; } = "";

        [FirestoreProperty]
        public string Estatus { get; set; } = "";

        [FirestoreProperty]
        public string Padrino { get; set; } = "";

        [FirestoreProperty]
        public string Foto { get; set; } = "";

        // 🔹 Información de la moto
        [FirestoreProperty]
        public string Moto { get; set; } = "";

        [FirestoreProperty]
        public string Marca { get; set; } = "";

        [FirestoreProperty]
        public int AnoModelo { get; set; }

        [FirestoreProperty]
        public int CilindrajeCC { get; set; }

        [FirestoreProperty]
        public string PlacaMatricula { get; set; } = "";

        // 🔹 Fechas con control de zona horaria (UTC)
        private DateTime _fechaExpedicionLicenciaConduccion;
        [FirestoreProperty]
        public DateTime FechaExpedicionLicenciaConduccion
        {
            get => _fechaExpedicionLicenciaConduccion;
            set => _fechaExpedicionLicenciaConduccion = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }

        private DateTime _fechaExpedicionSOAT;
        [FirestoreProperty]
        public DateTime FechaExpedicionSOAT
        {
            get => _fechaExpedicionSOAT;
            set => _fechaExpedicionSOAT = DateTime.SpecifyKind(value, DateTimeKind.Utc);
        }
    }
}
