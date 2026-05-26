FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/PPI.Api/PPI.Api.csproj src/PPI.Api/
RUN dotnet restore src/PPI.Api/PPI.Api.csproj

COPY src/ src/
WORKDIR /src/src/PPI.Api
RUN dotnet publish PPI.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Instalar LibreOffice para conversión Word → PDF
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libreoffice \
      libreoffice-writer \
      fonts-liberation \
      fonts-dejavu \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .
COPY src/PPI.Api/Templates/ Templates/

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "PPI.Api.dll"]
