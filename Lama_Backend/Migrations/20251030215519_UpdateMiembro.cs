using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LAMA_API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateMiembro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnoModelo",
                table: "Miembros",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CilindrajeCC",
                table: "Miembros",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaExpedicionLicenciaConduccion",
                table: "Miembros",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaExpedicionSOAT",
                table: "Miembros",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlacaMatricula",
                table: "Miembros",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnoModelo",
                table: "Miembros");

            migrationBuilder.DropColumn(
                name: "CilindrajeCC",
                table: "Miembros");

            migrationBuilder.DropColumn(
                name: "FechaExpedicionLicenciaConduccion",
                table: "Miembros");

            migrationBuilder.DropColumn(
                name: "FechaExpedicionSOAT",
                table: "Miembros");

            migrationBuilder.DropColumn(
                name: "PlacaMatricula",
                table: "Miembros");
        }
    }
}
