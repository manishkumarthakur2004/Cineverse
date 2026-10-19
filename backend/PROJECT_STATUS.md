# CineVerse Backend Microservices Project Status

This document tracks the incremental progress of the CineVerse microservices backend architecture setup.

## Current Tech Stack
- **Language**: Java 21
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security & JWT (JSON Web Tokens)
- **Routing & Config**: Spring Cloud Gateway & Spring Cloud Config Server
- **Database & Persistence**: MySQL & Spring Data JPA
- **Build System**: Maven
- **Containerization**: Docker & Docker Compose
- **Client Frontend**: React, Vite & Tailwind CSS

## Current Architecture

```text
React Frontend
      │
      ▼
API Gateway
 ├── Auth Service
 ├── Movie Service  ──> OMDb API
 └── User Service
      │
      ▼
    MySQL
```
*Centralized settings are fetched by all services from the Config Server.*

---

## Workflow Progress

| Step | Component / Phase | Status | Details |
|---|---|---|---|
| **1** | Complete Folder Structure | **COMPLETED** | Established base directories and packages for all services. |
| **2** | Configuration Files | **COMPLETED** | Generated parent pom, module poms, local configurations repo, and bootstrap resource files. |
| **3** | Config Server | **COMPLETED** | Implemented ConfigServerApplication and enabled actuator endpoint support. |
| **4** | Common Library | **COMPLETED** | Generated only shared utility classes, base JPA entity, and custom runtime exceptions. Service-specific DTOs/logic are excluded. |
| **5** | API Gateway | **COMPLETED** | Configured routes, custom global CORS, and custom reactive JWT verification filter. |
| **6** | Auth Security | **COMPLETED** | Implemented JWT generation/verification, refresh token rotation, logout, and Spring Security. |
| **7** | Movie Service | **COMPLETED** | Created OMDb RestClient configuration, DTO response mapping, and search/details proxy APIs. |
| **8** | User Service | **COMPLETED** | Implemented User Profile, Favorites, Watchlist, Ratings, and Reviews. |
| **9** | Docker Setup | **COMPLETED** | Created unified root Dockerfile and docker-compose.yml with mysql service, mapped config server repo, and cross-service dependencies based on health checks. |
| **10** | Frontend API Integration | **COMPLETED** | Replaced static data with backend APIs using Axios and interceptors. Integrated all endpoints. <br/><br/> **VERIFICATION COMPLETED:** Backend infrastructure issues (Hibernate constraint, gateway routes, config profiles) fixed. All containers running. The updated OMDb API key (`c54ebec3`) is successfully configured and actively serving real movie data via proxy endpoints. |
| **11** | Frontend Enhancements & Integrations | **COMPLETED** | Integrated native OS-level Stremio deep linking, fixed user data mapping bugs for images, refined UI placeholders, and generated comprehensive project documentation (`FEATURE.md`, `SYNTAX.md`, `RUN_PROJECT.md`). |

## Completed Components

### Config Server (Step 3 Completed)
- Main application class: `com.cineverse.config.ConfigServerApplication`
- Annotation: `@EnableConfigServer`
- Actuator health indicators exposed.

### Common Library (Step 4 Completed)
- Exclusively holds shared utilities and parent templates.
- **ApiResponse DTO**: `com.cineverse.common.dto.ApiResponse`
- **JPA Base Entity**: `com.cineverse.common.entity.BaseEntity`
- **Global Constants**: `com.cineverse.common.constant.Constants`
- **Global Enums**: `com.cineverse.common.enums.RoleType` (ROLE_USER, ROLE_ADMIN, ROLE_MODERATOR)

### API Gateway (Step 5 Completed)
- Main application class: `com.cineverse.gateway.ApiGatewayApplication`
- **Custom Reactive JWT Validation Filter**: `com.cineverse.gateway.filter.JwtAuthenticationFilter`
- Routes configured statically to point to backend microservices without Eureka dependency.
- Global CORS configured via `api-gateway.yml`.

### Auth Service (Step 6 Completed)
- JWT access tokens expire in 15 minutes, refresh tokens in 7 days.
- Password hashing is executed with BCrypt, passwords never logged or returned.
- Verification and invalidation logic fully stateless. Seeding seeded default roles.

### Movie Service (Step 7 Completed)
- Main application class: `com.cineverse.movie.MovieServiceApplication`
- **OMDb API Client Configurations**: Mapped RestClient bean.
- **DTO Response Mapping**: `OmdbSearchResponse`, `OmdbMovieResponse` mapping OMDb json results, and `MovieResponse` formatting clean parameters to the frontend.
- **Search & Details Proxy Logic**:
  - `MovieService` & `MovieServiceImpl` calling OMDb APIs using `RestClient` and throwing clean errors.
  - `MovieController` exposing `/search` and `/details/{imdbId}` endpoints.

### User Service (Step 8 Completed)
- Main application class: `com.cineverse.user.UserServiceApplication`
- **Database Model**:
  - `User` entity linked directly to MySQL user profile records.
  - `Favorite` entity storing favorites (uniqueness mapped on userId + imdbId).
  - `Watchlist` entity storing movie watch lists (uniqueness mapped on userId + imdbId).
  - `Review` entity storing comments and ratings on a scale of 1-10 (uniqueness mapped on userId + imdbId).
- **DTO Layer**: `UserProfileRequest`, `UserProfileResponse`, `FavoriteRequest`, `FavoriteResponse`, `WatchlistRequest`, `WatchlistResponse`, `ReviewRequest`, `ReviewResponse` mapping clean fields.
- **Service & Controller Layers**:
  - `UserService` & `UserServiceImpl` executing logic with transaction settings.
  - `UserController` exposing endpoints for Profile, Favorites, Watchlist, and Reviews. Uses gateway-verified headers (`X-User-Email`) to enforce secure ownership isolation.
  - `GlobalExceptionHandler` mapping validation and exception failures to the uniform `ApiResponse` envelope.

### Frontend Enhancements (Step 11 Completed)
- **Stremio Playback Integration**:
  - Implemented an OS-level deep link feature using the official `stremio:///search` scheme.
  - Created `StremioModal.jsx` for graceful fallback handling if the app fails to launch.
- **UI & Experience Fixes**:
  - Updated `Footer.jsx` with active external social media links (`target="_blank"`).
  - Customized input placeholders in `Signup.jsx` for a personalized feel.
- **Data Mapping Resolution**:
  - Fixed a mapping discrepancy where the frontend sent `posterUrl` but the backend expected `poster`. 
  - Restored dynamic movie posters for all saved Favorites and Watchlist items in `MovieCard.jsx`.
- **Project Documentation**:
  - Created `FEATURE.md`, `SYNTAX.md`, and `RUN_PROJECT.md` to cleanly summarize the architecture, codebase, and deployment steps for presentations.
