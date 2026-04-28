# 🛡️ Guía de Defensa Técnica: Proyecto EcoLand

Este documento ha sido diseñado para preparar al equipo ante una defensa técnica exhaustiva frente a un jurado experto en Backend, Frontend y QA.

---

## 1. Descripción Técnica del Proyecto
**EcoLand** es una plataforma distribuida de gestión ambiental orientada a la movilización ciudadana en Cochabamba. El sistema permite la gestión de campañas (reforestación/reciclaje) con control de aforos, autenticación híbrida (JWT + Google OAuth2), visualización de métricas de impacto en tiempo real y geolocalización de puntos verdes.

---

## 2. Perfil: Experto en Backend (Arquitectura y Lógica)

### Arquitectura Hexagonal (Clean Architecture)
El backend está construido sobre **Spring Boot 3.2.4** siguiendo una **Arquitectura Hexagonal**, lo que garantiza el desacoplamiento entre la lógica de negocio y las herramientas externas.
*   **Domain Layer:** Contiene los modelos de dominio (`Campaign`, `User`) y los **Ports** (interfaces como `CampaignRepository` o `AuthPort`). Es agnóstica a cualquier framework.
*   **Application Layer:** Implementa los casos de uso (`CreateCampaignUseCase`) y los servicios que orquestan la lógica. Maneja DTOs para evitar la exposición de entidades.
*   **Infrastructure Layer:** Contiene los **Adapters**. Aquí residen los controladores REST (`CampaignController`), las implementaciones de persistencia (`JpaCampaignRepository`) y configuraciones de terceros (Google API Client).

### Stack Tecnológico
*   **Java 17:** Uso de records, sealed classes y stream API.
*   **Spring Security + JJWT:** Implementación de seguridad basada en tokens sin estado (stateless).
*   **MySQL:** Base de datos relacional para consistencia ACID.
*   **AOP (Aspect Oriented Programming):** Utilizado para el manejo transversal de excepciones y logging.

### Preguntas Probables y Respuestas
> **P: ¿Por qué elegiste Arquitectura Hexagonal en lugar de la tradicional de 3 capas?**
> **R:** Para proteger el núcleo del negocio. Si mañana decidimos cambiar MySQL por MongoDB o usar una cola de mensajes en lugar de REST, solo modificamos la capa de infraestructura sin tocar la lógica de negocio ni los casos de uso.

> **P: ¿Cómo manejas la concurrencia en la reserva de cupos para una campaña?**
> **R:** Utilizamos transacciones de Spring (@Transactional) y podríamos implementar "Optimistic Locking" mediante el campo `@Version` de JPA para evitar la sobreventa de cupos si varios usuarios intentan registrarse al mismo tiempo.

---

## 3. Perfil: Experto en Frontend (UI/UX y Performance)

### Arquitectura del Frontend
Basado en **Angular 21**, el proyecto utiliza un enfoque de **Standalone Components** para reducir el boilerplate y mejorar la eficiencia del árbol de inyección de dependencias.
*   **Modularidad:** Uso de **Lazy Loading** por rutas para cargar los módulos de estadísticas, auth y campañas solo cuando el usuario los necesita, optimizando el FCP (First Contentful Paint).
*   **Estado y Reactividad:** Uso intensivo de **RxJS** para el manejo de flujos de datos asíncronos y operadores como `forkJoin` para sincronizar múltiples llamadas a la API.

### Librerías Clave
*   **Leaflet:** Renderizado de mapas interactivos sin la sobrecarga de Google Maps API.
*   **Chart.js + ng2-charts:** Visualización dinámica de métricas de CO2 y árboles plantados.
*   **Lucide-Angular:** Set de iconos optimizado mediante tree-shaking.
*   **ngx-translate:** Soporte multi-idioma (ES, EN, FR, PT) con carga dinámica de JSONs.

### Preguntas Probables y Respuestas
> **P: Tuviste problemas de dependencias circulares con Google Auth. ¿Cómo lo resolviste técnicamente?**
> **R:** Desacoplamos la librería `angularx-social-login` de los componentes lazy-loaded y migramos a una implementación nativa usando el script de **Google Identity Services (GIS)**. Cargamos el botón manualmente en el DOM y manejamos el callback dentro de la zona de Angular (`NgZone`) para asegurar la detección de cambios.

> **P: ¿Cómo optimizas el rendimiento de los gráficos en la pestaña de estadísticas?**
> **R:** Implementamos detección de cambios manual (`ChangeDetectorRef.detectChanges()`) y actualizamos las referencias de los objetos de datos de Chart.js para forzar el re-renderizado solo cuando los datos de la API cambian, evitando ciclos de vida innecesarios.

---

## 4. Perfil: Ingeniero QA / DevOps (Calidad y Despliegue)

### Estrategia de Calidad
*   **Pruebas Unitarias:** Uso de **JUnit 5** y **Mockito** en el backend para testear casos de uso de forma aislada.
*   **Cobertura:** Integración de **Jacoco** para medir la cobertura de código (meta > 80%).
*   **Validación de Datos:** Uso de `spring-boot-starter-validation` (Bean Validation) para asegurar que ningún dato corrupto llegue a la base de datos desde los controladores.

### Pipeline y Despliegue
*   **Frontend:** Desplegado en **Netlify** con integración continua desde GitHub. Se configuró `.npmrc` con `legacy-peer-deps=true` para manejar conflictos de versiones en el entorno de build.
*   **Backend:** Contenerizado listo para Docker.
*   **Logs:** Implementación de un sistema de logging persistente en `backend/logs/ecoland.log` para trazabilidad de errores en producción.

### Preguntas Probables y Respuestas
> **P: ¿Cómo garantizas la seguridad de los tokens JWT en el frontend?**
> **R:** Los tokens se manejan en memoria o localStorage, pero para producción se recomienda el uso de cookies `HttpOnly` y `Secure` para prevenir ataques XSS y CSRF.

> **P: ¿Qué estrategia de manejo de errores globales tienes?**
> **R:** En el backend usamos un `@RestControllerAdvice` que captura todas las excepciones y las mapea a un formato JSON estándar con códigos de error específicos, evitando fugar información técnica (stacktraces) al cliente.

---

## 5. Herramientas de Desarrollo Utilizadas
1.  **Postman:** Para el testing exhaustivo de la API REST.
2.  **Maven:** Para la gestión de dependencias y ciclo de vida del backend.
3.  **Angular CLI:** Para la generación de componentes, servicios y optimización de builds de producción.
4.  **MySQL Workbench:** Para el modelado y monitoreo de la base de datos.
