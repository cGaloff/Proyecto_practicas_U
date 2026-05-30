using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using PPI.Api.Domain.Entities;

namespace PPI.Api.Application.Word;

public interface IWordGeneratorService
{
    /// <summary>
    /// Genera un .docx a partir de la plantilla, poblando las tablas
    /// con los datos de las EntradaInforme recibidas.
    /// Para informe individual: lista con las entradas del docente.
    /// Para consolidado por programa: lista con todas las entradas
    /// del programa ordenadas por practica ASC, grupo ASC.
    /// </summary>
    Task<byte[]> GenerarAsync(
        string programa,
        string semestre,
        string coordinador,
        DateOnly? fechaEntrega,
        List<EntradaInforme> entradas);
}

public class WordGeneratorService : IWordGeneratorService
{
    private readonly string _templatePath;

    public WordGeneratorService(IWebHostEnvironment env)
    {
        _templatePath = Path.Combine(
            env.ContentRootPath,
            "Templates",
            "informe_ppi_template.docx");
    }

    public async Task<byte[]> GenerarAsync(
        string programa,
        string semestre,
        string coordinador,
        DateOnly? fechaEntrega,
        List<EntradaInforme> entradas)
    {
        var templateBytes = await File.ReadAllBytesAsync(_templatePath);

        using var ms = new MemoryStream();
        ms.Write(templateBytes, 0, templateBytes.Length);
        ms.Position = 0;

        using (var doc = WordprocessingDocument.Open(ms, true))
        {
            var body = doc.MainDocumentPart!.Document.Body!;
            var tables = body.Elements<Table>().ToList();

            // ── Tabla 0 — Datos generales ───────────────────────────
            ReemplazarEnTabla(tables[0], new Dictionary<string, string>
            {
                ["{{INFO.PROGRAMA}}"]      = programa,
                ["{{INFO.SEMESTRE}}"]      = semestre,
                ["{{INFO.COORDINADOR}}"]   = coordinador,
                ["{{INFO.FECHA_ENTREGA}}"] = fechaEntrega.HasValue
                    ? fechaEntrega.Value.ToString("dd/MM/yyyy")
                    : string.Empty
            });

            // ── Tablas dinámicas 1–7 (una fila modelo, N clones) ────
            PoblarTablaFilas(tables[1], entradas, MapearFila2A);
            PoblarTablaFilas(tables[2], entradas, MapearFila2B);
            PoblarTablaFilas(tables[3], entradas, MapearFila3);
            PoblarTablaFilas(tables[4], entradas, MapearFila4A);
            PoblarTablaFilas(tables[5], entradas, MapearFila4B);
            PoblarTablaFilas(tables[6], entradas, MapearFila5A);
            PoblarTablaFilas(tables[7], entradas, MapearFila5B);

            // ── Tabla 8 — Firmas ────────────────────────────────────
            PoblarTablaFirmas(tables[8], coordinador, entradas);

            // ── Tabla 9 — Anexos ────────────────────────────────────
            PoblarTablaAnexos(tables[9], entradas);

            // Tabla 10 — Coordinador general — no tocar

            doc.MainDocumentPart.Document.Save();
        }

        return ms.ToArray();
    }

    // ── MOTOR DE CLONADO DE FILAS ──────────────────────────────────

    private static void PoblarTablaFilas(
        Table tabla,
        List<EntradaInforme> entradas,
        Func<EntradaInforme, Dictionary<string, string>> mapearFila)
    {
        var filas = tabla.Elements<TableRow>().ToList();
        // Fila 0 = encabezado, fila 1 = modelo, filas 2+ = vacías extra
        var filaModelo = filas[1];
        var filasExtra = filas.Skip(2).ToList();

        // Eliminar filas vacías extra del original
        foreach (var f in filasExtra)
            f.Remove();

        // Clonar la fila modelo N veces (una por entrada)
        // Insertar ANTES de eliminar el modelo para mantener formato
        var anchor = filaModelo;
        foreach (var entrada in entradas)
        {
            var clon = (TableRow)filaModelo.CloneNode(true);
            var valores = mapearFila(entrada);
            ReemplazarEnFila(clon, valores);
            filaModelo.Parent!.InsertAfter(clon, anchor);
            anchor = clon;
        }

        // Eliminar la fila modelo (ya tiene marcadores sin reemplazar)
        filaModelo.Remove();
    }

    // ── TABLA 8 — FIRMAS (lógica especial) ────────────────────────

    private static void PoblarTablaFirmas(
        Table tabla,
        string coordinador,
        List<EntradaInforme> entradas)
    {
        var filas = tabla.Elements<TableRow>().ToList();
        // Fila 0 = encabezado
        // Fila 1 = coordinador (fija, solo reemplazar nombre)
        // Fila 2 = modelo docente
        // Filas 3+ = vacías extra

        // Coordinador — reemplazar nombre
        ReemplazarEnFila(filas[1], new Dictionary<string, string>
        {
            ["{{INFO.COORDINADOR}}"] = coordinador
        });

        var filaModelo = filas[2];
        var filasExtra = filas.Skip(3).ToList();
        foreach (var f in filasExtra) f.Remove();

        var anchor = filaModelo;
        foreach (var entrada in entradas)
        {
            var clon = (TableRow)filaModelo.CloneNode(true);
            ReemplazarEnFila(clon, new Dictionary<string, string>
            {
                ["{{FILA.DOC_NOMBRE}}"]    =
                    entrada.GrupoAsignado?.Docente?.NombreCompleto ?? string.Empty,
                ["{{FILA.FIRMA_DIGITAL}}"] =
                    entrada.FirmaDigital ?? string.Empty
            });
            filaModelo.Parent!.InsertAfter(clon, anchor);
            anchor = clon;
        }

        filaModelo.Remove();
    }

    // ── TABLA 9 — ANEXOS (filas fijas, solo reemplazo) ────────────

    private static void PoblarTablaAnexos(
        Table tabla,
        List<EntradaInforme> entradas)
    {
        var practicas = new[] { "I", "II", "III", "IV", "V", "PP" };
        var filas = tabla.Elements<TableRow>().ToList();
        // Fila 0 = encabezado, filas 1-6 = una por práctica

        for (int i = 0; i < practicas.Length; i++)
        {
            var practica = practicas[i];
            var enlaces = entradas
                .Where(e => e.GrupoAsignado?.Practica == practica
                         && !string.IsNullOrWhiteSpace(e.EnlaceEvidencias))
                .Select(e => e.EnlaceEvidencias!)
                .ToList();

            var valor = string.Join("\n", enlaces);
            var marcador = $"{{{{ANEXO.PRACTICA_{practica}}}}}";

            if (i + 1 < filas.Count)
                ReemplazarEnFila(filas[i + 1],
                    new Dictionary<string, string> { [marcador] = valor });
        }
    }

    // ── REEMPLAZADORES ─────────────────────────────────────────────

    private static void ReemplazarEnTabla(
        Table tabla,
        Dictionary<string, string> valores)
    {
        foreach (var fila in tabla.Elements<TableRow>())
            ReemplazarEnFila(fila, valores);
    }

    private static void ReemplazarEnFila(
        TableRow fila,
        Dictionary<string, string> valores)
    {
        foreach (var celda in fila.Elements<TableCell>())
            foreach (var parrafo in celda.Elements<Paragraph>())
                foreach (var run in parrafo.Elements<Run>())
                {
                    var t = run.GetFirstChild<Text>();
                    if (t?.Text == null) continue;
                    foreach (var kv in valores)
                        if (t.Text.Contains(kv.Key))
                            t.Text = t.Text.Replace(kv.Key, kv.Value);
                }
    }

    // ── MAPEOS POR SECCIÓN ─────────────────────────────────────────

    private static Dictionary<string, string> MapComun(EntradaInforme e)
        => new()
        {
            ["{{FILA.PRACTICA}}"]   = e.GrupoAsignado?.Practica ?? "",
            ["{{FILA.DOC_NOMBRE}}"] = e.GrupoAsignado?.Docente?.NombreCompleto ?? "",
            ["{{FILA.GRUPO_N}}"]    = e.GrupoAsignado?.NumeroGrupo.ToString() ?? ""
        };

    private static Dictionary<string, string> MapearFila2A(EntradaInforme e)
    {
        var d = MapComun(e);
        d["{{FILA.TOTAL_EST}}"] = SumaSeccion2B(e.Seccion2B).ToString();
        return d;
    }

    private static Dictionary<string, string> MapearFila2B(EntradaInforme e)
    {
        var d = MapComun(e);
        var s = e.Seccion2B;
        d["{{FILA.MOD_PUBLICA}}"]    = s?.Publica.ToString()            ?? "0";
        d["{{FILA.MOD_PRIVADA}}"]    = s?.Privada.ToString()            ?? "0";
        d["{{FILA.MOD_ONG}}"]        = s?.OngSocial.ToString()          ?? "0";
        d["{{FILA.MOD_LABORAL}}"]    = s?.VinculacionLaboral.ToString()  ?? "0";
        d["{{FILA.MOD_CASA}}"]       = s?.EnCasa.ToString()             ?? "0";
        d["{{FILA.MOD_OTROS_MUN}}"]  = s?.OtrosMunicipios.ToString()    ?? "0";
        d["{{FILA.MOD_TOTAL}}"]      = SumaSeccion2B(s).ToString();
        return d;
    }

    private static int SumaSeccion2B(Seccion2B? s) =>
        s == null ? 0
        : s.Publica + s.Privada + s.OngSocial + s.VinculacionLaboral + s.EnCasa + s.OtrosMunicipios;

    private static Dictionary<string, string> MapearFila3(EntradaInforme e)
    {
        var d = MapComun(e);
        var s = e.Seccion3;
        d["{{FILA.SIT_INICIARON}}"]    = s?.Iniciaron.ToString()   ?? "0";
        d["{{FILA.SIT_FINALIZARON}}"]  = s?.Finalizaron.ToString() ?? "0";
        d["{{FILA.SIT_RETIRADOS}}"]    = s?.Retirados.ToString()   ?? "0";
        d["{{FILA.SIT_PENDIENTES}}"]   = s?.Pendientes.ToString()  ?? "0";
        d["{{FILA.SIT_NO_APROBARON}}"] = s?.NoAprobaron.ToString() ?? "0";
        return d;
    }

    private static Dictionary<string, string> MapearFila4A(EntradaInforme e)
    {
        var d = MapComun(e);
        d["{{FILA.ACT_SALIDAS}}"] = ResolverActividad(e.Seccion4A?.SalidasCampo);
        d["{{FILA.ACT_EVENTOS}}"] = ResolverActividad(e.Seccion4A?.EventosAcademicos);
        d["{{FILA.ACT_ESPEJO}}"]  = ResolverActividad(e.Seccion4A?.ClasesEspejo);
        return d;
    }

    private static Dictionary<string, string> MapearFila4B(EntradaInforme e)
    {
        var d = MapComun(e);
        d["{{FILA.INN_ESTRATEGIAS}}"]   = TextoONo(e.Seccion4B?.Estrategias);
        d["{{FILA.INN_PUBLICACIONES}}"] = TextoONo(e.Seccion4B?.Publicaciones);
        d["{{FILA.INN_OTRAS}}"]         = TextoONo(e.Seccion4B?.Otras);
        return d;
    }

    private static Dictionary<string, string> MapearFila5A(EntradaInforme e)
    {
        var d = MapComun(e);
        d["{{FILA.LOG_LOGROS}}"]    = e.Seccion5A?.Logros    ?? "";
        d["{{FILA.LOG_LECCIONES}}"] = e.Seccion5A?.Lecciones ?? "";
        return d;
    }

    private static Dictionary<string, string> MapearFila5B(EntradaInforme e)
    {
        var d = MapComun(e);
        d["{{FILA.RET_LIMITACIONES}}"]    = e.Seccion5B?.Limitaciones    ?? "";
        d["{{FILA.RET_RECOMENDACIONES}}"] = e.Seccion5B?.Recomendaciones ?? "";
        return d;
    }

    private static string ResolverActividad(ActividadItem? item)
    {
        if (item == null || !item.Aplica) return "No";
        return string.IsNullOrWhiteSpace(item.Descripcion) ? "Sí" : item.Descripcion;
    }

    private static string TextoONo(string? valor) =>
        string.IsNullOrWhiteSpace(valor) ? "No" : valor;
}
