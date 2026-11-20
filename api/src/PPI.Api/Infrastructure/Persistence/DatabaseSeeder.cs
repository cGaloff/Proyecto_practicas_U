using Microsoft.EntityFrameworkCore;
using PPI.Api.Application.Auth;
using PPI.Api.Domain.Entities;
using PPI.Api.Domain.Enums;

namespace PPI.Api.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext context, IPasswordService passwordService)
    {
        await SeedProgramasAsync(context);
        await SeedDocentesAsync(context, passwordService);
        await SeedInformesYGruposAsync(context);
        await SeedAdminAsync(context, passwordService);
    }

    private static async Task SeedProgramasAsync(AppDbContext context)
    {
        if (await context.Programas.AnyAsync())
            return;

        var programas = new (string Nombre, string Codigo)[]
        {
            ("LICENCIATURA EN ARTES", "LIC-ARTES"),
            ("LICENCIATURA EN CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL", "LIC-CCNN"),
            ("LICENCIATURA EN EDUCACIÓN CAMPESINA Y RURAL", "LIC-CAMP"),
            ("LICENCIATURA EN EDUCACIÓN INFANTIL", "LIC-INF"),
            ("LICENCIATURA EN ETNOEDUCACIÓN", "LIC-ETNO"),
            ("LICENCIATURA EN LENGUAS EXTRANJERAS CON ÉNFASIS EN INGLÉS", "LIC-INGL"),
            ("LICENCIATURA EN LITERATURA Y LENGUA CASTELLANA", "LIC-LIT"),
            ("LICENCIATURA EN MATEMÁTICAS", "LIC-MAT"),
            ("LICENCIATURA EN QUÍMICA", "LIC-QUIM"),
            ("LICENCIATURA EN TECNOLOGÍA", "LIC-TEC"),
        };

        foreach (var (nombre, codigo) in programas)
        {
            context.Programas.Add(new Programa
            {
                Id = Guid.NewGuid(),
                Nombre = nombre,
                Codigo = codigo
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedDocentesAsync(AppDbContext context, IPasswordService passwordService)
    {
        if (await context.Docentes.AnyAsync())
            return;

        var programas = await context.Programas.OrderBy(p => p.Codigo).ToListAsync();
        var programaMap = new Dictionary<string, Guid>
        {
            ["LIC-ARTES"] = programas.First(p => p.Codigo == "LIC-ARTES").Id,
            ["LIC-CCNN"]  = programas.First(p => p.Codigo == "LIC-CCNN").Id,
            ["LIC-CAMP"]  = programas.First(p => p.Codigo == "LIC-CAMP").Id,
            ["LIC-INF"]   = programas.First(p => p.Codigo == "LIC-INF").Id,
            ["LIC-ETNO"]  = programas.First(p => p.Codigo == "LIC-ETNO").Id,
            ["LIC-INGL"]  = programas.First(p => p.Codigo == "LIC-INGL").Id,
            ["LIC-LIT"]   = programas.First(p => p.Codigo == "LIC-LIT").Id,
            ["LIC-MAT"]   = programas.First(p => p.Codigo == "LIC-MAT").Id,
            ["LIC-QUIM"]  = programas.First(p => p.Codigo == "LIC-QUIM").Id,
            ["LIC-TEC"]   = programas.First(p => p.Codigo == "LIC-TEC").Id,
        };

        // (nombre, correo, codigoPrograma, esAuxiliar)
        var docentes = new (string Nombre, string Correo, string Prog, bool EsAux)[]
        {
            ("EDWIN ENRIQUE ROJAS FERRARI", "eerojas@unimagdalena.edu.co", "LIC-ARTES", false),
            ("ADRIANA ARIZMENDY BENAVIDES", "aarizmendy@unimagdalena.edu.co", "LIC-ARTES", false),
            ("AURA MARIA MENA DE LA CRUZ", "auramena@unimagdalena.edu.co", "LIC-ARTES", false),
            ("DISNEY GOMEZ MERCADO", "dgomezm@unimagdalena.edu.co", "LIC-ARTES", false),
            ("NILTON DAIRO MENDEZ ACELAS", "nmendezac@unimagdalena.edu.co", "LIC-ARTES", false),
            ("JOHANY ANDREA GONZALEZ VANEGAS", "jgonzalezv@unimagdalena.edu.co", "LIC-ARTES", false),
            ("RAIZA ANDREA LLINAS PIZARRO", "rllinas@unimagdalena.edu.co", "LIC-ARTES", false),
            ("VALERIA ALEJANDRA CAICEDO HURTADO", "vacaicedo@unimagdalena.edu.co", "LIC-ARTES", false),
            ("OMAR ALONSO GARCIA MARTINEZ", "oagarciamar@unimagdalena.edu.co", "LIC-ARTES", false),
            ("ADRIANA MARCELA VELASQUEZ MENESES", "amvelasquez@unimagdalena.edu.co", "LIC-ARTES", true),
            ("DIANA PAOLA ANGARITA NINO", "dpangarita@unimagdalena.edu.co", "LIC-ARTES", true),
            ("JOHANNA MARGARITA FERNANDEZ FERNANDEZ", "jfernandezf@unimagdalena.edu.co", "LIC-CCNN", false),
            ("EDUARDO DAVID PACHECO GRANADOS", "edpacheco@unimagdalena.edu.co", "LIC-CCNN", false),
            ("SANDRA MILENA CALDERON BRICENO", "scalderonb@unimagdalena.edu.co", "LIC-CCNN", false),
            ("ILEANA BEATRIZ GARCIA CARVAJAL", "igarcia@unimagdalena.edu.co", "LIC-CCNN", false),
            ("JOSE LUIS POMARICO MIER", "jpomarico@unimagdalena.edu.co", "LIC-CCNN", false),
            ("SAMIR JOSE ESCORCIA PENZO", "sjescorcia@unimagdalena.edu.co", "LIC-CCNN", false),
            ("GERALDITH PAOLA FONTALVO VILLALBA", "gfontalvo@unimagdalena.edu.co", "LIC-CCNN", true),
            ("YOLIS MAR GAMBOA ROSAS", "ymgamboar@unimagdalena.edu.co", "LIC-CCNN", false),
            ("FATIMA DEL CARMEN ALARCON ACOSTA", "falarcon@unimagdalena.edu.co", "LIC-CCNN", false),
            ("THARVY ESCORCIA CABALLERO", "tescorcia@unimagdalena.edu.co", "LIC-CCNN", true),
            ("JEAN CARLOS VARGAS PACHECO", "jcvargasp@unimagdalena.edu.co", "LIC-CAMP", false),
            ("DARWIN JOVANY TEJEDA GARCIA", "dtejeda@unimagdalena.edu.co", "LIC-CAMP", false),
            ("JAVIER ALFONSO YANCY PEREZ", "jyancy@unimagdalena.edu.co", "LIC-CAMP", false),
            ("MARIA ISABEL RODRIGUEZ ROVIRA", "mirodriguezr@unimagdalena.edu.co", "LIC-CAMP", true),
            ("ELISA LUCIA MIER GONZALEZ", "emier@unimagdalena.edu.co", "LIC-CAMP", false),
            ("SORAYA MARIA DUARTE REYES", "sduarte@unimagdalena.edu.co", "LIC-CAMP", false),
            ("MARCO ANTONIO PEREZ SUAREZ", "masuarezp@unimagdalena.edu.co", "LIC-CAMP", false),
            ("JOSE GREGORIO LOZADA DAZA", "jlozadad@unimagdalena.edu.co", "LIC-CAMP", false),
            ("ALEX GUTIERREZ MORENO", "agutierrez@unimagdalena.edu.co", "LIC-CAMP", false),
            ("BERENICE MERCEDES VILLALBA PEREIRA", "bvillalba@unimagdalena.edu.co", "LIC-INF", false),
            ("ELMIS ANDREA RUIZ OSPINO", "eruizo@unimagdalena.edu.co", "LIC-INF", true),
            ("ABADYS MARIA MORENO CASTAÑEZ", "amorenomc@unimagdalena.edu.co", "LIC-INF", false),
            ("MARIA DILIA MIELES BARRERA", "mmieles@unimagdalena.edu.co", "LIC-INF", false),
            ("JOHANA PATRICIA REALES CERVANTES", "jreales@unimagdalena.edu.co", "LIC-INF", false),
            ("MERLY PATRICIA TAUSA VILLAMIZAR", "merlytausapv@unimagdalena.edu.co", "LIC-INF", false),
            ("EDNNA YINETH SANCHEZ RUIZ", "esanchezr@unimagdalena.edu.co", "LIC-INF", false),
            ("ELIZABETH CAROLINA CORDOBA PINEDO", "ecordoba@unimagdalena.edu.co", "LIC-INF", false),
            ("BLANCA IRENE RUBIO HERNANDEZ", "brubio@unimagdalena.edu.co", "LIC-INF", false),
            ("SANDRA MILENA ARCINIEGAS TRIANA", "sandraarciniegasmt@unimagdalena.edu.co", "LIC-INF", true),
            ("OLGA CECILIA OSPINO GUTIERREZ", "oospino@unimagdalena.edu.co", "LIC-INF", false),
            ("ONERYS GAITAN MEJIA", "ogaitan@unimagdalena.edu.co", "LIC-INF", true),
            ("BRENDA BEATRIZ GOMEZ BELTRAN", "bgomez@unimagdalena.edu.co", "LIC-INF", false),
            ("VIRGINIA ISABEL BARRERO TONCEL", "virginiabarreroit@Universidadmag.onmicrosoft.com", "LIC-INF", true),
            ("CARLOS ENRRIQUE GARCIA YERENA", "cgarciaey@unimagdalena.edu.co", "LIC-INF", false),
            ("NATALIA VASQUEZ VILORIA", "nataliavasquezv@unimagdalena.edu.co", "LIC-INF", true),
            ("ROSA MARIA CHAMORRO CUELLO", "rmchamorro@unimagdalena.edu.co", "LIC-ETNO", false),
            ("JHAIR JOAQUIN BERBEN HENRIQUEZ", "jberben@unimagdalena.edu.co", "LIC-ETNO", false),
            ("MARIA AUXILIADORA BRAVO LLANOS", "mbravol@unimagdalena.edu.co", "LIC-ETNO", false),
            ("SANDRA CAROLINA BELMONTE JIMENEZ", "sbelmonte@unimagdalena.edu.co", "LIC-ETNO", false),
            ("ARTURO JOSE COMAS ACUÑA", "arturocomasja@unimagdalena.edu.co", "LIC-ETNO", false),
            ("KAREN MARGARITA SINNING MANCILLA", "ksinning@unimagdalena.edu.co", "LIC-ETNO", false),
            ("OSMAR ABEL TORRES VILLAFAÑA", "osmartorresav@unimagdalena.edu.co", "LIC-ETNO", false),
            ("JESUS DAVID POMARES VANEGAS", "jesuspomaresdv@unimagdalena.edu.co", "LIC-ETNO", false),
            ("LUIS ALFREDO GONZALEZ MONROY", "lgonzalezm@unimagdalena.edu.co", "LIC-ETNO", false),
            ("LUIS DAVID GAMARRA ROSADO", "lgamarrar@unimagdalena.edu.co", "LIC-ETNO", false),
            ("KARINA JULIETH DIAZ CASTIBLANCO", "kdiaz@unimagdalena.edu.co", "LIC-ETNO", true),
            ("ANDREA CATALINA CHAPARRO CARDENAS", "acchaparroc@unimagdalena.edu.co", "LIC-INGL", false),
            ("MARTHA BELEN FERNANDEZ OROZCO", "mfernandez@unimagdalena.edu.co", "LIC-INGL", false),
            ("DIANA PATRICIA CARDOZO MONTILLA", "dcardozo@unimagdalena.edu.co", "LIC-INGL", false),
            ("NELSON RAFAEL TONCEL HERRERA", "ntoncelh@unimagdalena.edu.co", "LIC-INGL", false),
            ("ARIANIS ESTHER LARA MORALES", "alaram@unimagdalena.edu.co", "LIC-INGL", true),
            ("ANGELICA NATALIA GONZALEZ DIAZ", "angonzalezdi@unimagdalena.edu.co", "LIC-INGL", false),
            ("JOSE FRANCISCO QUIROZ MORALES", "jquirozm@unimagdalena.edu.co", "LIC-INGL", false),
            ("CLAUDIA PATRICIA VINUEZA RIVEROS", "cvinueza@unimagdalena.edu.co", "LIC-INGL", false),
            ("ILIANA CECILIA SAURITH ROPAIN", "isaurith@unimagdalena.edu.co", "LIC-INGL", false),
            ("BERTA ISABEL CHARRIS OLIVO", "bertacharrisio@unimagdalena.edu.co", "LIC-LIT", false),
            ("ELVIA VANESSA VIZCAINO MARTINEZ", "evizcainovm@unimagdalena.edu.co", "LIC-LIT", false),
            ("LUZ ZULUAGA CHADID", "lzuluagach@unimagdalena.edu.co", "LIC-LIT", false),
            ("SERGIO ANDRES MORENO SANTIAGO", "samoreno@unimagdalena.edu.co", "LIC-LIT", true),
            ("VIASNEY ROCIO MOLINA NARANJO", "vmolina@unimagdalena.edu.co", "LIC-LIT", false),
            ("ANA MILENA ARRIETA NUÑEZ", "aarrienta@unimagdalena.edu.co", "LIC-LIT", false),
            ("LIJANEY PAOLA ORTEGA MORENO", "lportega@unimagdalena.edu.co", "LIC-LIT", false),
            ("DAMAR EDUARDO FONTALVO SANCHEZ", "damarfontalvoes@unimagdalena.edu.co", "LIC-LIT", false),
            ("SADYD YOLIANY ESCALONA GRANADOS", "sescalona@unimagdalena.edu.co", "LIC-LIT", false),
            ("KAREN SOFIA JACKSON RODRIGUEZ", "kjackson@unimagdalena.edu.co", "LIC-MAT", false),
            ("ROSA MARIA VERGARA GARCIA", "rvergara@unimagdalena.edu.co", "LIC-MAT", false),
            ("ADA IRIS RADA GUETE", "arada@unimagdalena.edu.co", "LIC-MAT", false),
            ("VICTOR ENRIQUE VALENCIA ESPEJO", "victorvalenciaee@unimagdalena.edu.co", "LIC-MAT", false),
            ("EDGARDO ALFONSO ESCORCIA CABALLERO", "eescorcia@unimagdalena.edu.co", "LIC-MAT", false),
            ("ERIC ALBERTO HERNANDEZ SASTOQUE", "ehernandezs@unimagdalena.edu.co", "LIC-MAT", false),
            ("OSIRIS DEL CARMEN GALLEGO JIMENEZ", "ocgallegoj@unimagdalena.edu.co", "LIC-QUIM", false),
            ("ANA CLARA CORREA MARTINEZ", "acorreacm@unimagdalena.edu.co", "LIC-QUIM", false),
            ("ANA MILENA GAVIRIA VEGA", "amgaviriav@unimagdalena.edu.co", "LIC-QUIM", false),
            ("EFRAIN GONZALEZ AVELLANEDA", "egonzaleza@unimagdalena.edu.co", "LIC-QUIM", false),
            ("NINFA ROSA DE LA HOZ ROSALES", "nhoz@unimagdalena.edu.co", "LIC-QUIM", false),
            ("ANDREA CAROLINA RUIZ LACOUTURE", "andrearuizcl@unimagdalena.edu.co", "LIC-TEC", false),
            ("ZAMIR ALFREDO MONTERO PERTUZ", "zamontero@unimagdalena.edu.co", "LIC-TEC", false),
            ("NARLYS PATRICIA VILLALOBO ROPAIN", "nvillalobo@unimagdalena.edu.co", "LIC-TEC", false),
            ("EDUARD ALONSO TRILLOS GOMEZ", "etrillosg@unimagdalena.edu.co", "LIC-TEC", false),
            ("JORGE MARIO ORTEGA IGLESIAS", "jortegai@unimagdalena.edu.co", "LIC-TEC", false),
            ("MARGARITA BARRAZA HERAS", "mbarraza@unimagdalena.edu.co", "LIC-TEC", true),
            ("ANGEL JIMENEZ SIERRA", "ajimenezs@unimagdalena.edu.co", "LIC-TEC", false),
            ("DAIRON ALBERTO COSTA CARRANZA", "dcosta@unimagdalena.edu.co", "LIC-TEC", false),
            ("ORLANDO CLARETH LABORDE MONTES", "orlandolaborcm@unimagdalena.edu.co", "LIC-TEC", true),
            ("LAUREN VALENTINA ARZUAGA ROLON", "larzuaga@unimagdalena.edu.co", "LIC-TEC", true),
            ("HENRY SANCHEZ PEREZ", "hsanchez@unimagdalena.edu.co", "LIC-TEC", false),
            ("GREGORIO ALBERTO PEÑA CORONADO", "gpena@unimagdalena.edu.co", "LIC-TEC", true),
            ("ROLANDO ENRIQUE ESCORCIA CABALLERO", "reescorcia@unimagdalena.edu.co", "LIC-TEC", false),
        };

        var created = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        foreach (var (nombre, correo, prog, esAux) in docentes)
        {
            var password = passwordService.PasswordInicialDesdeCorreo(correo);
            context.Docentes.Add(new Docente
            {
                Id = Guid.NewGuid(),
                NombreCompleto = nombre,
                Correo = correo.ToLower(),
                PasswordHash = passwordService.Hashear(password),
                PrimerLogin = true,
                EsAuxiliar = esAux,
                ProgramaId = programaMap[prog],
                CreadoEn = created
            });
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedInformesYGruposAsync(AppDbContext context)
    {
        if (await context.GruposAsignados.AnyAsync())
            return;

        var programas = await context.Programas.ToListAsync();
        var docentes = await context.Docentes.ToListAsync();

        var programaPorCodigo = programas.ToDictionary(p => p.Codigo, p => p);
        var docentePorCorreo = docentes.ToDictionary(d => d.Correo, d => d);

        const string semestre = "2026-II";
        const int anio = 2026;

        // 1 informe por programa
        var informesPorPrograma = new Dictionary<string, Informe>();
        foreach (var prog in programas)
        {
            var informe = new Informe
            {
                Id = Guid.NewGuid(),
                ProgramaId = prog.Id,
                Semestre = semestre,
                Anio = anio,
                Estado = EstadoInforme.Pendiente,
                CoordinadorNombre = "",
                CreadoEn = DateTime.UtcNow,
                ActualizadoEn = DateTime.UtcNow
            };
            context.Informes.Add(informe);
            informesPorPrograma[prog.Codigo] = informe;
        }

        await context.SaveChangesAsync();

        // Grupos: (idGrupo, codigoPrograma, practica, numGrupo, matriculados)
        var gruposData = new (int Id, string Prog, string Practica, int Grupo, int Matriculados)[]
        {
            (1, "LIC-ARTES", "I", 1, 8),
            (2, "LIC-ARTES", "II", 1, 11),
            (3, "LIC-ARTES", "II", 2, 6),
            (4, "LIC-ARTES", "II", 3, 11),
            (5, "LIC-ARTES", "III", 1, 4),
            (6, "LIC-ARTES", "IV", 1, 8),
            (7, "LIC-ARTES", "IV", 2, 12),
            (8, "LIC-ARTES", "IV", 3, 9),
            (9, "LIC-ARTES", "PP", 1, 5),
            (10, "LIC-CCNN", "I", 1, 10),
            (11, "LIC-CCNN", "I", 2, 10),
            (12, "LIC-CCNN", "I", 3, 10),
            (13, "LIC-CCNN", "III", 1, 11),
            (14, "LIC-CCNN", "III", 2, 11),
            (15, "LIC-CCNN", "V", 1, 11),
            (16, "LIC-CCNN", "V", 2, 9),
            (17, "LIC-CCNN", "V", 3, 9),
            (18, "LIC-CCNN", "PP", 1, 12),
            (19, "LIC-CAMP", "I", 1, 10),
            (20, "LIC-CAMP", "I", 2, 12),
            (21, "LIC-CAMP", "III", 1, 6),
            (22, "LIC-CAMP", "III", 2, 7),
            (23, "LIC-CAMP", "III", 3, 5),
            (24, "LIC-CAMP", "V", 1, 11),
            (25, "LIC-CAMP", "V", 2, 10),
            (26, "LIC-CAMP", "PP", 1, 8),
            (27, "LIC-INF", "I", 1, 16),
            (28, "LIC-INF", "PP", 1, 4),
            (29, "LIC-INF", "I", 2, 16),
            (30, "LIC-INF", "II", 1, 4),
            (31, "LIC-INF", "III", 1, 7),
            (32, "LIC-INF", "III", 2, 14),
            (33, "LIC-INF", "III", 3, 14),
            (34, "LIC-INF", "IV", 1, 6),
            (35, "LIC-INF", "V", 1, 7),
            (36, "LIC-INF", "V", 2, 13),
            (37, "LIC-INF", "V", 3, 10),
            (38, "LIC-INF", "PP", 2, 8),
            (39, "LIC-ETNO", "I", 1, 9),
            (40, "LIC-ETNO", "I", 2, 11),
            (41, "LIC-ETNO", "I", 3, 11),
            (42, "LIC-ETNO", "III", 1, 11),
            (43, "LIC-ETNO", "III", 2, 9),
            (44, "LIC-ETNO", "III", 3, 11),
            (45, "LIC-ETNO", "V", 1, 7),
            (46, "LIC-ETNO", "V", 2, 13),
            (47, "LIC-ETNO", "V", 3, 12),
            (48, "LIC-ETNO", "PP", 1, 6),
            (49, "LIC-INGL", "I", 1, 15),
            (50, "LIC-INGL", "I", 2, 17),
            (51, "LIC-INGL", "I", 3, 15),
            (52, "LIC-INGL", "III", 1, 12),
            (53, "LIC-INGL", "III", 3, 10),
            (54, "LIC-INGL", "III", 4, 12),
            (55, "LIC-INGL", "PP", 1, 15),
            (56, "LIC-INGL", "IV", 2, 11),
            (57, "LIC-INGL", "V", 1, 7),
            (58, "LIC-INGL", "V", 2, 13),
            (59, "LIC-INGL", "V", 3, 10),
            (60, "LIC-LIT", "I", 1, 12),
            (61, "LIC-LIT", "I", 2, 13),
            (62, "LIC-LIT", "PP", 2, 2),
            (63, "LIC-LIT", "I", 3, 10),
            (64, "LIC-LIT", "III", 1, 15),
            (65, "LIC-LIT", "III", 2, 12),
            (66, "LIC-LIT", "III", 3, 14),
            (67, "LIC-LIT", "V", 1, 9),
            (68, "LIC-LIT", "V", 2, 9),
            (69, "LIC-LIT", "V", 3, 8),
            (70, "LIC-MAT", "I", 1, 19),
            (71, "LIC-MAT", "II", 1, 16),
            (72, "LIC-MAT", "III", 2, 8),
            (73, "LIC-MAT", "III", 1, 9),
            (74, "LIC-MAT", "PP", 1, 15),
            (75, "LIC-MAT", "IV", 1, 10),
            (76, "LIC-MAT", "V", 1, 7),
            (77, "LIC-MAT", "V", 2, 8),
            (78, "LIC-QUIM", "I", 1, 10),
            (79, "LIC-QUIM", "II", 1, 14),
            (80, "LIC-QUIM", "V", 1, 6),
            (81, "LIC-QUIM", "III", 1, 6),
            (82, "LIC-QUIM", "III", 2, 6),
            (83, "LIC-QUIM", "IV", 1, 8),
            (84, "LIC-QUIM", "V", 2, 11),
            (85, "LIC-QUIM", "PP", 1, 4),
            (86, "LIC-TEC", "I", 2, 9),
            (87, "LIC-TEC", "I", 3, 5),
            (88, "LIC-TEC", "IV", 3, 7),
            (89, "LIC-TEC", "II", 2, 8),
            (90, "LIC-TEC", "II", 3, 11),
            (91, "LIC-TEC", "III", 1, 7),
            (92, "LIC-TEC", "IV", 2, 10),
            (93, "LIC-TEC", "V", 2, 11),
            (94, "LIC-TEC", "PP", 1, 10),
            (95, "LIC-TEC", "PP", 2, 6),
        };

        // grupo_docente assignments: (idGrupo, correo, rol)
        var asignaciones = new (int IdGrupo, string Correo, string Rol)[]
        {
            (1, "eerojas@unimagdalena.edu.co", "PRINCIPAL"),
            (2, "aarizmendy@unimagdalena.edu.co", "PRINCIPAL"),
            (3, "auramena@unimagdalena.edu.co", "PRINCIPAL"),
            (4, "dgomezm@unimagdalena.edu.co", "PRINCIPAL"),
            (5, "nmendezac@unimagdalena.edu.co", "PRINCIPAL"),
            (6, "jgonzalezv@unimagdalena.edu.co", "PRINCIPAL"),
            (6, "aarizmendy@unimagdalena.edu.co", "AUXILIAR"),
            (7, "rllinas@unimagdalena.edu.co", "PRINCIPAL"),
            (8, "vacaicedo@unimagdalena.edu.co", "PRINCIPAL"),
            (9, "oagarciamar@unimagdalena.edu.co", "PRINCIPAL"),
            (9, "amvelasquez@unimagdalena.edu.co", "AUXILIAR"),
            (9, "dpangarita@unimagdalena.edu.co", "AUXILIAR"),
            (10, "jfernandezf@unimagdalena.edu.co", "PRINCIPAL"),
            (11, "jfernandezf@unimagdalena.edu.co", "PRINCIPAL"),
            (11, "edpacheco@unimagdalena.edu.co", "AUXILIAR"),
            (12, "scalderonb@unimagdalena.edu.co", "PRINCIPAL"),
            (13, "igarcia@unimagdalena.edu.co", "PRINCIPAL"),
            (14, "edpacheco@unimagdalena.edu.co", "PRINCIPAL"),
            (15, "jpomarico@unimagdalena.edu.co", "PRINCIPAL"),
            (16, "sjescorcia@unimagdalena.edu.co", "PRINCIPAL"),
            (16, "gfontalvo@unimagdalena.edu.co", "AUXILIAR"),
            (17, "ymgamboar@unimagdalena.edu.co", "PRINCIPAL"),
            (18, "falarcon@unimagdalena.edu.co", "PRINCIPAL"),
            (18, "tescorcia@unimagdalena.edu.co", "AUXILIAR"),
            (18, "jpomarico@unimagdalena.edu.co", "AUXILIAR"),
            (19, "jcvargasp@unimagdalena.edu.co", "PRINCIPAL"),
            (19, "dtejeda@unimagdalena.edu.co", "AUXILIAR"),
            (20, "jyancy@unimagdalena.edu.co", "PRINCIPAL"),
            (20, "mirodriguezr@unimagdalena.edu.co", "AUXILIAR"),
            (21, "emier@unimagdalena.edu.co", "PRINCIPAL"),
            (21, "dtejeda@unimagdalena.edu.co", "AUXILIAR"),
            (22, "sduarte@unimagdalena.edu.co", "PRINCIPAL"),
            (23, "dtejeda@unimagdalena.edu.co", "PRINCIPAL"),
            (24, "masuarezp@unimagdalena.edu.co", "PRINCIPAL"),
            (24, "dtejeda@unimagdalena.edu.co", "AUXILIAR"),
            (25, "jlozadad@unimagdalena.edu.co", "PRINCIPAL"),
            (26, "agutierrez@unimagdalena.edu.co", "PRINCIPAL"),
            (26, "dtejeda@unimagdalena.edu.co", "AUXILIAR"),
            (26, "mirodriguezr@unimagdalena.edu.co", "AUXILIAR"),
            (27, "bvillalba@unimagdalena.edu.co", "PRINCIPAL"),
            (28, "bvillalba@unimagdalena.edu.co", "PRINCIPAL"),
            (28, "eruizo@unimagdalena.edu.co", "AUXILIAR"),
            (29, "amorenomc@unimagdalena.edu.co", "PRINCIPAL"),
            (30, "mmieles@unimagdalena.edu.co", "PRINCIPAL"),
            (31, "jreales@unimagdalena.edu.co", "PRINCIPAL"),
            (32, "merlytausapv@unimagdalena.edu.co", "PRINCIPAL"),
            (33, "esanchezr@unimagdalena.edu.co", "PRINCIPAL"),
            (34, "ecordoba@unimagdalena.edu.co", "PRINCIPAL"),
            (35, "brubio@unimagdalena.edu.co", "PRINCIPAL"),
            (35, "sandraarciniegasmt@unimagdalena.edu.co", "AUXILIAR"),
            (36, "oospino@unimagdalena.edu.co", "PRINCIPAL"),
            (36, "ogaitan@unimagdalena.edu.co", "AUXILIAR"),
            (37, "bgomez@unimagdalena.edu.co", "PRINCIPAL"),
            (37, "virginiabarreroit@universidadmag.onmicrosoft.com", "AUXILIAR"),
            (38, "cgarciaey@unimagdalena.edu.co", "PRINCIPAL"),
            (38, "ogaitan@unimagdalena.edu.co", "AUXILIAR"),
            (38, "nataliavasquezv@unimagdalena.edu.co", "AUXILIAR"),
            (39, "rmchamorro@unimagdalena.edu.co", "PRINCIPAL"),
            (40, "jberben@unimagdalena.edu.co", "PRINCIPAL"),
            (41, "mbravol@unimagdalena.edu.co", "PRINCIPAL"),
            (42, "sbelmonte@unimagdalena.edu.co", "PRINCIPAL"),
            (43, "arturocomasja@unimagdalena.edu.co", "PRINCIPAL"),
            (44, "ksinning@unimagdalena.edu.co", "PRINCIPAL"),
            (45, "osmartorresav@unimagdalena.edu.co", "PRINCIPAL"),
            (46, "jesuspomaresdv@unimagdalena.edu.co", "PRINCIPAL"),
            (47, "lgonzalezm@unimagdalena.edu.co", "PRINCIPAL"),
            (48, "lgamarrar@unimagdalena.edu.co", "PRINCIPAL"),
            (48, "kdiaz@unimagdalena.edu.co", "AUXILIAR"),
            (49, "acchaparroc@unimagdalena.edu.co", "PRINCIPAL"),
            (50, "mfernandez@unimagdalena.edu.co", "PRINCIPAL"),
            (51, "mfernandez@unimagdalena.edu.co", "PRINCIPAL"),
            (52, "dcardozo@unimagdalena.edu.co", "PRINCIPAL"),
            (53, "dcardozo@unimagdalena.edu.co", "PRINCIPAL"),
            (54, "ntoncelh@unimagdalena.edu.co", "PRINCIPAL"),
            (55, "ntoncelh@unimagdalena.edu.co", "PRINCIPAL"),
            (55, "alaram@unimagdalena.edu.co", "AUXILIAR"),
            (56, "angonzalezdi@unimagdalena.edu.co", "PRINCIPAL"),
            (57, "jquirozm@unimagdalena.edu.co", "PRINCIPAL"),
            (58, "cvinueza@unimagdalena.edu.co", "PRINCIPAL"),
            (58, "mfernandez@unimagdalena.edu.co", "AUXILIAR"),
            (59, "isaurith@unimagdalena.edu.co", "PRINCIPAL"),
            (60, "bertacharrisio@unimagdalena.edu.co", "PRINCIPAL"),
            (61, "evizcainovm@unimagdalena.edu.co", "PRINCIPAL"),
            (61, "lzuluagach@unimagdalena.edu.co", "AUXILIAR"),
            (62, "evizcainovm@unimagdalena.edu.co", "PRINCIPAL"),
            (62, "samoreno@unimagdalena.edu.co", "AUXILIAR"),
            (63, "vmolina@unimagdalena.edu.co", "PRINCIPAL"),
            (64, "aarrienta@unimagdalena.edu.co", "PRINCIPAL"),
            (65, "lzuluagach@unimagdalena.edu.co", "PRINCIPAL"),
            (66, "masuarezp@unimagdalena.edu.co", "PRINCIPAL"),
            (67, "lportega@unimagdalena.edu.co", "PRINCIPAL"),
            (68, "damarfontalvoes@unimagdalena.edu.co", "PRINCIPAL"),
            (68, "samoreno@unimagdalena.edu.co", "AUXILIAR"),
            (69, "sescalona@unimagdalena.edu.co", "PRINCIPAL"),
            (70, "kjackson@unimagdalena.edu.co", "PRINCIPAL"),
            (71, "rvergara@unimagdalena.edu.co", "PRINCIPAL"),
            (72, "rvergara@unimagdalena.edu.co", "PRINCIPAL"),
            (73, "arada@unimagdalena.edu.co", "PRINCIPAL"),
            (74, "arada@unimagdalena.edu.co", "PRINCIPAL"),
            (75, "victorvalenciaee@unimagdalena.edu.co", "PRINCIPAL"),
            (76, "eescorcia@unimagdalena.edu.co", "PRINCIPAL"),
            (77, "ehernandezs@unimagdalena.edu.co", "PRINCIPAL"),
            (78, "ocgallegoj@unimagdalena.edu.co", "PRINCIPAL"),
            (79, "acorreacm@unimagdalena.edu.co", "PRINCIPAL"),
            (80, "acorreacm@unimagdalena.edu.co", "PRINCIPAL"),
            (81, "scalderonb@unimagdalena.edu.co", "PRINCIPAL"),
            (82, "amgaviriav@unimagdalena.edu.co", "PRINCIPAL"),
            (83, "amgaviriav@unimagdalena.edu.co", "PRINCIPAL"),
            (84, "egonzaleza@unimagdalena.edu.co", "PRINCIPAL"),
            (85, "nhoz@unimagdalena.edu.co", "PRINCIPAL"),
            (85, "egonzaleza@unimagdalena.edu.co", "AUXILIAR"),
            (86, "andrearuizcl@unimagdalena.edu.co", "PRINCIPAL"),
            (87, "zamontero@unimagdalena.edu.co", "PRINCIPAL"),
            (88, "zamontero@unimagdalena.edu.co", "PRINCIPAL"),
            (89, "nvillalobo@unimagdalena.edu.co", "PRINCIPAL"),
            (90, "etrillosg@unimagdalena.edu.co", "PRINCIPAL"),
            (91, "jortegai@unimagdalena.edu.co", "PRINCIPAL"),
            (91, "mbarraza@unimagdalena.edu.co", "AUXILIAR"),
            (92, "ajimenezs@unimagdalena.edu.co", "PRINCIPAL"),
            (92, "mbarraza@unimagdalena.edu.co", "AUXILIAR"),
            (93, "dcosta@unimagdalena.edu.co", "PRINCIPAL"),
            (93, "orlandolaborcm@unimagdalena.edu.co", "AUXILIAR"),
            (93, "larzuaga@unimagdalena.edu.co", "AUXILIAR"),
            (94, "hsanchez@unimagdalena.edu.co", "PRINCIPAL"),
            (94, "gpena@unimagdalena.edu.co", "AUXILIAR"),
            (95, "reescorcia@unimagdalena.edu.co", "PRINCIPAL"),
            (95, "larzuaga@unimagdalena.edu.co", "AUXILIAR"),
        };

        // Build grupo lookup
        var grupoLookup = gruposData.ToDictionary(g => g.Id);

        // Track which grupos have PRINCIPAL assigned (for EntradaInforme creation)
        var grupoIdToGuid = new Dictionary<int, Guid>();

        foreach (var asig in asignaciones)
        {
            var grupoData = grupoLookup[asig.IdGrupo];
            var prog = programaPorCodigo[grupoData.Prog];
            var correo = asig.Correo.ToLower();

            if (!docentePorCorreo.TryGetValue(correo, out var docente))
                continue;

            var grupo = new GrupoAsignado
            {
                Id = Guid.NewGuid(),
                DocenteId = docente.Id,
                ProgramaId = prog.Id,
                Practica = grupoData.Practica,
                NumeroGrupo = grupoData.Grupo,
                Matriculados = grupoData.Matriculados,
                Rol = asig.Rol,
                Semestre = semestre,
                Anio = anio
            };

            context.GruposAsignados.Add(grupo);

            if (asig.Rol == "PRINCIPAL" && !grupoIdToGuid.ContainsKey(asig.IdGrupo))
                grupoIdToGuid[asig.IdGrupo] = grupo.Id;
        }

        await context.SaveChangesAsync();

        // Create EntradaInforme for each PRINCIPAL grupo
        foreach (var asig in asignaciones.Where(a => a.Rol == "PRINCIPAL"))
        {
            if (!grupoIdToGuid.TryGetValue(asig.IdGrupo, out var grupoGuid))
                continue;

            var grupoData = grupoLookup[asig.IdGrupo];
            var prog = programaPorCodigo[grupoData.Prog];
            var informe = informesPorPrograma[prog.Codigo];

            context.Add(new EntradaInforme
            {
                Id = Guid.NewGuid(),
                InformeId = informe.Id,
                GrupoAsignadoId = grupoGuid,
                Estado = EstadoEntrada.SinIniciar,
                CreadoEn = DateTime.UtcNow
            });

            grupoIdToGuid.Remove(asig.IdGrupo);
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedAdminAsync(AppDbContext context, IPasswordService passwordService)
    {
        const string correoAdmin = "adminpracticas@unimagdalena.edu.co";

        if (await context.Admins.AnyAsync(a => a.Correo == correoAdmin))
            return;

        context.Admins.Add(new Admin
        {
            Id = Guid.Parse("a1b2c3d4-0000-0000-0000-000000000001"),
            NombreCompleto = "Administrador PPI",
            Correo = correoAdmin,
            PasswordHash = passwordService.Hashear("adminpracticas"),
            CreadoEn = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
        });

        await context.SaveChangesAsync();
    }
}
