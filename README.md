# 🌱 EcoLand

**EcoLand** es una plataforma integral de gestión ciudadana diseñada para centralizar, coordinar y potenciar iniciativas de impacto ambiental en la región de Cochabamba. Construido sobre una arquitectura robusta que integra un backend escalable en Spring Boot, el sistema garantiza el manejo seguro y eficiente de la participación voluntaria mediante la validación estricta de procesos en tiempo real. Esto incluye la gestión automatizada de aforos y cupos para campañas ecológicas, el control de roles y permisos mediante autenticación JWT y OAuth2, y la categorización dinámica de eventos de reforestación y reciclaje.

La plataforma destaca por su enfoque en la movilización comunitaria y su capacidad para procesar información ambiental de valor, incluyendo la integración de mapas interactivos para la ubicación de puntos verdes y rutas de recolección de residuos. Al unificar la administración operativa de las campañas, el seguimiento en vivo de metas de recolección y la visualización estadística del impacto ecológico (como reducción de huella de carbono y árboles plantados) en una interfaz fluida e intuitiva, EcoLand reduce significativamente las barreras de participación y empodera a los ciudadanos y organizaciones para transformar su conciencia ambiental en acciones concretas y medibles sin contratiempos.

---

## 🚀 Tecnologías Principales

### Backend
- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3.2.4
- **Arquitectura:** Hexagonal (Clean Architecture)
- **Seguridad:** Spring Security + JSON Web Tokens (JWT)
- **Persistencia:** Spring Data JPA + MySQL
- **Gestión de Dependencias:** Maven

### Frontend
- **Framework:** Angular 17+ (v21.0.0-next.0)
- **Estilos:** TailwindCSS
- **Iconografía:** Lucide Angular
- **Visualización:** Chart.js / ng2-charts
- **Despliegue:** Netlify

---

## 🏛️ Arquitectura del Sistema

El backend sigue los principios de la **Arquitectura Hexagonal**, desacoplando la lógica de negocio de los detalles técnicos:

- **`domain`**: Contiene las entidades de negocio y los puertos (interfaces). No tiene dependencias externas.
- **`application`**: Orquestación de casos de uso y servicios de aplicación.
- **`infrastructure`**: Implementación de adaptadores de persistencia (JPA Repositories), controladores REST y configuraciones de seguridad.

---

## 🛠️ Instalación y Configuración Local

### Prerrequisitos
- **Java JDK 17** o superior.
- **Node.js** (v18 o superior) + **npm**.
- **MySQL 8.0** o superior.
- Un IDE (IntelliJ IDEA, VS Code o Eclipse).

### 1. Clonar el repositorio
```bash
git clone https://github.com/melanytorrez/EcoLand.git
cd EcoLand
```

### 2. Configuración del Backend
Dirígete a la carpeta `backend/` y configura el archivo `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecoland_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contrasena
spring.jpa.hibernate.ddl-auto=update
```
🔹 Importante:

Este proyecto utiliza una base de datos local (localhost), por lo que debes reemplazar los valores (username, password y nombre de la base de datos si lo deseas) según tu entorno.
Se recomienda crear la base de datos con el nombre: ecoland_db para evitar problemas de configuración.
Una vez configurado correctamente, al ejecutar el backend por primera vez, se generarán automáticamente datos iniciales en la base de datos.

Ejecutar el backend:
```bash
mvn spring-boot:run
```

### 3. Configuración del Frontend
Dirígete a la carpeta `frontend/`:
```bash
npm install
npm start
```
La aplicación estará disponible en `http://localhost:8081`.

---

## 🌐 Despliegue (Producción)

EcoLand está configurado para despliegue continuo (CI/CD):
- **Frontend:** Desplegado en [Netlify](https://ecolandfront.netlify.app) desde la rama `main`.
- **Backend:** Aloja en **Railway**, conectado a una base de datos MySQL gestionada.

### Variables de Entorno en Railway
Para que el backend funcione en producción, Railway requiere:
- `MYSQLDATABASE`, `MYSQLHOST`, `MYSQLPASSWORD`, `MYSQLPORT`, `MYSQLUSER` (Variables automáticas de Railway).
- `PORT`: Generalmente 8082 o determinado por Railway.

---

## 📁 Estructura del Proyecto
```bash
EcoLand/
├── backend/                # Proyecto Spring Boot
│   ├── src/main/java/com/ecoland/
│   │   ├── domain/         # Capa de Dominio (Entidades y Puertos)
│   │   ├── application/    # Capa de Aplicación (Casos de Uso)
│   │   └── infrastructure/ # Capa de Infraestructura (Adaptadores y Config)
├── frontend/               # Proyecto Angular
│   ├── src/app/
│   │   ├── core/           # Servicios, Modelos y Guardias
│   │   ├── features/       # Módulos de funcionalidades (Home, Reciclaje, Reforestación)
│   │   └── shared/         # Componentes reutilizables
└── README.md
```

Backend (Java/Spring Boot)
Desde la carpeta backend/:


# Correr todos los tests
mvn test

# Correr un test específico
mvn test -Dtest=FeatureToggleServiceTest

# Ver reporte de cobertura (JaCoCo) — genera HTML en target/site/jacoco/
mvn verify
El reporte de cobertura queda en backend/target/site/jacoco/index.html.

Frontend (Angular/Jasmine)
Desde la carpeta frontend/:

# Correr todos los tests (abre navegador Chrome)
npm test

# Correr un archivo específico
npx ng test --include="**/admin.service.spec.ts" --watch=false

# Ver cobertura
npx ng test --code-coverage --watch=false
El reporte de cobertura queda en frontend/coverage/index.html.


*EcoLand es un proyecto académico desarrollado para el Taller de Sistemas de Información.*

-------------


