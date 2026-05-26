using System.Diagnostics;

namespace PPI.Api.Application.Word;

public interface IPdfConverterService
{
    /// <summary>
    /// Convierte un archivo .docx en bytes a PDF en bytes
    /// usando LibreOffice headless.
    /// </summary>
    Task<byte[]> ConvertirDocxAPdfAsync(byte[] docxBytes);
}

public class PdfConverterService : IPdfConverterService
{
    private readonly ILogger<PdfConverterService> _logger;

    public PdfConverterService(ILogger<PdfConverterService> logger)
    {
        _logger = logger;
    }

    public async Task<byte[]> ConvertirDocxAPdfAsync(byte[] docxBytes)
    {
        var tempDir  = Path.Combine(Path.GetTempPath(), $"ppi_pdf_{Guid.NewGuid():N}");
        var docxPath = Path.Combine(tempDir, "informe.docx");
        var pdfPath  = Path.Combine(tempDir, "informe.pdf");

        Directory.CreateDirectory(tempDir);

        try
        {
            await File.WriteAllBytesAsync(docxPath, docxBytes);

            var proceso = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName               = "libreoffice",
                    Arguments              = $"--headless --convert-to pdf --outdir \"{tempDir}\" \"{docxPath}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError  = true,
                    UseShellExecute        = false,
                    CreateNoWindow         = true,
                }
            };

            proceso.Start();

            var stderr = await proceso.StandardError.ReadToEndAsync();
            await proceso.WaitForExitAsync();

            if (proceso.ExitCode != 0)
            {
                _logger.LogError("LibreOffice error: {Stderr}", stderr);
                throw new InvalidOperationException("Error al convertir el documento a PDF.");
            }

            if (!File.Exists(pdfPath))
                throw new FileNotFoundException("El PDF no fue generado correctamente.");

            return await File.ReadAllBytesAsync(pdfPath);
        }
        finally
        {
            try { Directory.Delete(tempDir, recursive: true); }
            catch { /* ignorar errores de limpieza */ }
        }
    }
}
