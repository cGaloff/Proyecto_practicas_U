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
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre_completo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_admins", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "programas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    codigo = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_programas", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "docentes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    nombre_completo = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    correo = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    primer_login = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    es_auxiliar = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    programa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_docentes", x => x.id);
                    table.ForeignKey(
                        name: "fk_docentes_programas_programa_id",
                        column: x => x.programa_id,
                        principalTable: "programas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "informes",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    programa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    semestre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    anio = table.Column<int>(type: "integer", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false, defaultValue: "Pendiente"),
                    coordinador_nombre = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    fecha_entrega = table.Column<DateOnly>(type: "date", nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    actualizado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_informes", x => x.id);
                    table.ForeignKey(
                        name: "fk_informes_programas_programa_id",
                        column: x => x.programa_id,
                        principalTable: "programas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "grupos_asignados",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    docente_id = table.Column<Guid>(type: "uuid", nullable: false),
                    programa_id = table.Column<Guid>(type: "uuid", nullable: false),
                    practica = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    numero_grupo = table.Column<int>(type: "integer", nullable: false),
                    matriculados = table.Column<int>(type: "integer", nullable: false),
                    semestre = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    anio = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_grupos_asignados", x => x.id);
                    table.ForeignKey(
                        name: "fk_grupos_asignados_docentes_docente_id",
                        column: x => x.docente_id,
                        principalTable: "docentes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_grupos_asignados_programas_programa_id",
                        column: x => x.programa_id,
                        principalTable: "programas",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "informe_auditorias",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    informe_id = table.Column<Guid>(type: "uuid", nullable: false),
                    admin_id = table.Column<Guid>(type: "uuid", nullable: false),
                    estado_anterior = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    estado_nuevo = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    observacion = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_informe_auditorias", x => x.id);
                    table.ForeignKey(
                        name: "fk_informe_auditorias_admins_admin_id",
                        column: x => x.admin_id,
                        principalTable: "admins",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_informe_auditorias_informes_informe_id",
                        column: x => x.informe_id,
                        principalTable: "informes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "entradas_informe",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    informe_id = table.Column<Guid>(type: "uuid", nullable: false),
                    grupo_asignado_id = table.Column<Guid>(type: "uuid", nullable: false),
                    estado = table.Column<string>(type: "text", nullable: false, defaultValue: "SinIniciar"),
                    enlace_evidencias = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    firma_digital = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    observacion_admin = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    creado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    guardado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    enviado_en = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    seccion2b = table.Column<string>(type: "jsonb", nullable: true),
                    seccion3 = table.Column<string>(type: "jsonb", nullable: true),
                    seccion4a = table.Column<string>(type: "jsonb", nullable: true),
                    seccion4b = table.Column<string>(type: "jsonb", nullable: true),
                    seccion5a = table.Column<string>(type: "jsonb", nullable: true),
                    seccion5b = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_entradas_informe", x => x.id);
                    table.ForeignKey(
                        name: "fk_entradas_informe_grupos_asignados_grupo_asignado_id",
                        column: x => x.grupo_asignado_id,
                        principalTable: "grupos_asignados",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_entradas_informe_informes_informe_id",
                        column: x => x.informe_id,
                        principalTable: "informes",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_admins_correo",
                table: "admins",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_docentes_correo",
                table: "docentes",
                column: "correo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_docentes_programa_id",
                table: "docentes",
                column: "programa_id");

            migrationBuilder.CreateIndex(
                name: "ix_entradas_informe_grupo_asignado_id",
                table: "entradas_informe",
                column: "grupo_asignado_id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_entradas_informe_informe_id",
                table: "entradas_informe",
                column: "informe_id");

            migrationBuilder.CreateIndex(
                name: "ix_grupos_asignados_docente_id_practica_numero_grupo_semestre_",
                table: "grupos_asignados",
                columns: new[] { "docente_id", "practica", "numero_grupo", "semestre", "anio" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_grupos_asignados_programa_id",
                table: "grupos_asignados",
                column: "programa_id");

            migrationBuilder.CreateIndex(
                name: "ix_informe_auditorias_admin_id",
                table: "informe_auditorias",
                column: "admin_id");

            migrationBuilder.CreateIndex(
                name: "ix_informe_auditorias_informe_id",
                table: "informe_auditorias",
                column: "informe_id");

            migrationBuilder.CreateIndex(
                name: "ix_informes_programa_id_semestre_anio",
                table: "informes",
                columns: new[] { "programa_id", "semestre", "anio" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_programas_codigo",
                table: "programas",
                column: "codigo",
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
