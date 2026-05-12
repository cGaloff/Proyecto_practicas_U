using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PPI.Api.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "admins",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreCompleto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admins", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "programas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_programas", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "docentes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NombreCompleto = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    PrimerLogin = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    EsAuxiliar = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    ProgramaId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_docentes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_docentes_programas_ProgramaId",
                        column: x => x.ProgramaId,
                        principalTable: "programas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "informes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProgramaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Semestre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Anio = table.Column<int>(type: "integer", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false, defaultValue: "Pendiente"),
                    CoordinadorNombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    FechaEntrega = table.Column<DateOnly>(type: "date", nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ActualizadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_informes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_informes_programas_ProgramaId",
                        column: x => x.ProgramaId,
                        principalTable: "programas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "grupos_asignados",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DocenteId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProgramaId = table.Column<Guid>(type: "uuid", nullable: false),
                    Practica = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    NumeroGrupo = table.Column<int>(type: "integer", nullable: false),
                    Matriculados = table.Column<int>(type: "integer", nullable: false),
                    Semestre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Anio = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grupos_asignados", x => x.Id);
                    table.ForeignKey(
                        name: "FK_grupos_asignados_docentes_DocenteId",
                        column: x => x.DocenteId,
                        principalTable: "docentes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_grupos_asignados_programas_ProgramaId",
                        column: x => x.ProgramaId,
                        principalTable: "programas",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "informe_auditorias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InformeId = table.Column<Guid>(type: "uuid", nullable: false),
                    AdminId = table.Column<Guid>(type: "uuid", nullable: false),
                    EstadoAnterior = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    EstadoNuevo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Observacion = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_informe_auditorias", x => x.Id);
                    table.ForeignKey(
                        name: "FK_informe_auditorias_admins_AdminId",
                        column: x => x.AdminId,
                        principalTable: "admins",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_informe_auditorias_informes_InformeId",
                        column: x => x.InformeId,
                        principalTable: "informes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entradas_informe",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InformeId = table.Column<Guid>(type: "uuid", nullable: false),
                    GrupoAsignadoId = table.Column<Guid>(type: "uuid", nullable: false),
                    Estado = table.Column<string>(type: "text", nullable: false, defaultValue: "SinIniciar"),
                    EnlaceEvidencias = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FirmaDigital = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    ObservacionAdmin = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    GuardadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EnviadoEn = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Seccion2B = table.Column<string>(type: "jsonb", nullable: true),
                    Seccion3 = table.Column<string>(type: "jsonb", nullable: true),
                    Seccion4A = table.Column<string>(type: "jsonb", nullable: true),
                    Seccion4B = table.Column<string>(type: "jsonb", nullable: true),
                    Seccion5A = table.Column<string>(type: "jsonb", nullable: true),
                    Seccion5B = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_entradas_informe", x => x.Id);
                    table.ForeignKey(
                        name: "FK_entradas_informe_grupos_asignados_GrupoAsignadoId",
                        column: x => x.GrupoAsignadoId,
                        principalTable: "grupos_asignados",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_entradas_informe_informes_InformeId",
                        column: x => x.InformeId,
                        principalTable: "informes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_admins_Correo",
                table: "admins",
                column: "Correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_docentes_Correo",
                table: "docentes",
                column: "Correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_docentes_ProgramaId",
                table: "docentes",
                column: "ProgramaId");

            migrationBuilder.CreateIndex(
                name: "IX_entradas_informe_GrupoAsignadoId",
                table: "entradas_informe",
                column: "GrupoAsignadoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_entradas_informe_InformeId",
                table: "entradas_informe",
                column: "InformeId");

            migrationBuilder.CreateIndex(
                name: "IX_grupos_asignados_DocenteId_Practica_NumeroGrupo_Semestre_An~",
                table: "grupos_asignados",
                columns: new[] { "DocenteId", "Practica", "NumeroGrupo", "Semestre", "Anio" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_grupos_asignados_ProgramaId",
                table: "grupos_asignados",
                column: "ProgramaId");

            migrationBuilder.CreateIndex(
                name: "IX_informe_auditorias_AdminId",
                table: "informe_auditorias",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_informe_auditorias_InformeId",
                table: "informe_auditorias",
                column: "InformeId");

            migrationBuilder.CreateIndex(
                name: "IX_informes_ProgramaId_Semestre_Anio",
                table: "informes",
                columns: new[] { "ProgramaId", "Semestre", "Anio" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_programas_Codigo",
                table: "programas",
                column: "Codigo",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "entradas_informe");

            migrationBuilder.DropTable(
                name: "informe_auditorias");

            migrationBuilder.DropTable(
                name: "grupos_asignados");

            migrationBuilder.DropTable(
                name: "admins");

            migrationBuilder.DropTable(
                name: "informes");

            migrationBuilder.DropTable(
                name: "docentes");

            migrationBuilder.DropTable(
                name: "programas");
        }
    }
}
