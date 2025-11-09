using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LAMA_API.Migrations
{
    /// <inheritdoc />
    public partial class AddMarcaToMiembro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Marca",
                table: "Miembros",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Marca",
                table: "Miembros");
        }
    }
}
