# PPI Unimagdalena

Sistema de gestión de informes de Práctica Pedagógica Investigativa.
Facultad de Ciencias de la Educación — Universidad del Magdalena.

## Requisitos
- Docker >= 24
- Docker Compose >= 2.24

## Levantar en desarrollo
cp .env.example .env
# Edita .env con tus valores
docker compose up --build

## Servicios
| Servicio  | URL                   |
|-----------|-----------------------|
| API       | http://localhost:5000 |
| pgAdmin   | http://localhost:5050 |
