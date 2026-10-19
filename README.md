# CineVerse

CineVerse is a premium OTT platform built with a microservices backend architecture. It allows users to search for movies, view detailed information and trailers, manage their watchlists and favorites, and write reviews.

## Project Overview

CineVerse provides a seamless, dynamic, and visually stunning user interface inspired by modern streaming platforms. The backend is designed as a suite of decoupled Spring Boot microservices, communicating securely through an API Gateway, and persisting data in a MySQL database.

## Architecture

```text
React Frontend (Vite, TailwindCSS)
      │
      ▼
API Gateway (Spring Cloud Gateway, JWT Validation)
 ├── Auth Service (JWT Generation, User Registration/Login)
 ├── Movie Service ──> OMDb External API (Search & Details)
 └── User Service (Profiles, Watchlists, Favorites, Reviews)
      │
      ▼
    MySQL (Database)
```
*Centralized application configuration is managed by the Spring Cloud Config Server.*

## Folder Structure

```
CineVerse/
├── backend/
│   ├── api-gateway/       # Gateway routing and JWT filter
│   ├── auth-service/      # Authentication and identity management
│   ├── common-library/    # Shared utilities, exceptions, base entities
│   ├── config-repo/       # Local git repository for Config Server properties
│   ├── config-server/     # Spring Cloud Config Server
│   ├── movie-service/     # Proxy to OMDb API for movie metadata
│   ├── user-service/      # Manages user-specific state and reviews
│   └── docker-compose.yml # Orchestration for backend services and MySQL
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI elements (cards, carousels, modals)
    │   ├── context/       # React context for global state (AuthContext)
    │   ├── pages/         # Page-level components
    │   ├── services/      # API integration using Axios interceptors
    │   └── utils/         # Helper functions
    └── package.json       # Frontend dependencies
```

## Tech Stack

**Frontend**
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

**Backend**
- Java 21
- Spring Boot 3.x
- Spring Security
- Spring Cloud Gateway
- Spring Cloud Config
- JSON Web Tokens (JWT)
- Spring Data JPA
- MySQL

**Infrastructure**
- Docker & Docker Compose
- Maven

## Installation & How to Run

### Prerequisites
- Docker Desktop installed and running.
- Node.js (v18+) and npm installed.
- Maven (optional, if building backend locally).

### 1. Environment Variables & External APIs
You will need an API key from [OMDb API](http://www.omdbapi.com/).
Navigate to `backend/config-repo/movie-service.yml` and replace the placeholder with your valid OMDb API key:
```yaml
omdb:
  api:
    url: "http://www.omdbapi.com/"
    key: "YOUR_OMDB_API_KEY"
```
*(Note: If you modify files in `config-repo`, remember to commit them locally since the Config Server reads from the local git repository).*

### 2. Run Backend (Docker)
Open a terminal in the `backend` directory and run:
```bash
docker-compose up --build -d
```
This command will start:
- MySQL Database (`port 3306`)
- Config Server (`port 8888`)
- Auth Service (`port 8081`)
- Movie Service (`port 8082`)
- User Service (`port 8083`)
- API Gateway (`port 8080`)

All API calls from the frontend should be directed to the API Gateway at `http://localhost:8080`.

### 3. Run Frontend
Open a new terminal in the `frontend` directory and run:
```bash
npm install
npm run dev
```
The React application will be available at `http://localhost:5173`.

## API Endpoints Summary

### Auth Service (via Gateway `/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate and receive JWT tokens
- `POST /refresh` - Rotate refresh token
- `POST /logout` - Invalidate user session

### Movie Service (via Gateway `/api/v1/movies`)
- `GET /search?query={title}` - Search movies via OMDb
- `GET /details/{imdbId}` - Get detailed metadata via OMDb

### User Service (via Gateway `/api/v1/users`)
- `GET/PUT /profile` - View/Edit authenticated user profile
- `GET/POST /favorites` - Manage user favorites
- `DELETE /favorites/{imdbId}` - Remove from favorites
- `GET/POST /watchlist` - Manage user watchlist
- `DELETE /watchlist/{imdbId}` - Remove from watchlist
- `GET/POST /reviews` - Create or fetch authenticated user's reviews
- `DELETE /reviews/{reviewId}` - Delete user's review
- `GET /reviews/movie/{imdbId}` - Fetch all reviews for a specific movie

## Future Improvements (V2 Roadmap)

- **Caching**: Introduce Redis to cache OMDb search results and movie details in the `movie-service` to improve response times and reduce external API calls.
- **Service Discovery**: Implement Eureka or Consul for dynamic service registration instead of hard-coded gateway routes.
- **Rate Limiting**: Implement Bucket4j or Redis rate-limiting on the API Gateway to prevent abuse.
- **Media Hosting**: Integrate AWS S3 or a similar object storage service for hosting custom user profile images.
- **Recommendation Engine**: Add a new microservice that computes movie recommendations based on user's watchlist and favorites history.
