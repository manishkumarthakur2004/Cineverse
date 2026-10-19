# CineVerse Complete Database & Data Flow Report

This report documents the precise flow of data from the React frontend, through the API Gateway, into the microservices, and finally down to the MySQL database tables using Hibernate/JPA.

---

## 💡 Quick Answers for Viva/Presentation

If your professor asks you these questions, you can show them exactly where to look:

**1. "Where did you store your database?"**
* **Answer:** "It is a MySQL database running securely inside a local Docker container."
* **Directory to show:** Open `backend/docker-compose.yml` and show the `mysql:` section. This file automatically builds the database and saves the data using Docker Volumes.

**2. "How did you connect the database to the backend?"**
* **Answer:** "The microservices connect to MySQL using Spring Data JPA. The connection string (JDBC URL), username, and password are automatically injected via Spring Cloud Config."
* **Directory to show:** Open `backend/config-repo/application-dev.yml` (under the `spring.datasource` section).

**3. "Where is the code for the Login, Signup, Wishlist, and Favorites windows?"**
* **Answer:** "The user interface components are built with React and located in the pages folder."
* **Directory to show:** Open the `frontend/src/pages/` folder. Show her `Login.jsx`, `Signup.jsx`, `Watchlist.jsx`, and `Favorites.jsx`.

---

---

## 1. Request Flow & Table Mapping

| Feature | Frontend File | Controller | Service | Repository | Entity | Database Table |
|---------|---------------|------------|---------|------------|--------|----------------|
| **Register** | `frontend/src/pages/Signup/Signup.jsx`<br>`frontend/src/context/AuthContext.jsx` | `AuthController.java` (auth-service) | `AuthServiceImpl.java` | `UserRepository.java` | `User.java` | `users` |
| **Login** | `frontend/src/pages/Login/Login.jsx`<br>`frontend/src/context/AuthContext.jsx` | `AuthController.java` (auth-service) | `AuthServiceImpl.java` | `UserRepository.java`, `RefreshTokenRepository.java` | `User.java`, `RefreshToken.java` | `users`, `refresh_tokens` |
| **Refresh Token** | `frontend/src/services/api.js` (Interceptor) | `AuthController.java` (auth-service) | `AuthServiceImpl.java` | `RefreshTokenRepository.java` | `RefreshToken.java` | `refresh_tokens` |
| **Profile** | `frontend/src/context/AuthContext.jsx` | `UserController.java` (user-service) | `UserServiceImpl.java` | `UserRepository.java` | `User.java` | `users` |
| **Favorites** | `frontend/src/pages/Favorites/Favorites.jsx`<br>`frontend/src/pages/MovieDetails/MovieDetails.jsx` | `UserController.java` (user-service) | `UserServiceImpl.java` | `FavoriteRepository.java` | `Favorite.java` | `favorites` |
| **Watchlist** | `frontend/src/pages/Watchlist/Watchlist.jsx`<br>`frontend/src/pages/MovieDetails/MovieDetails.jsx` | `UserController.java` (user-service) | `UserServiceImpl.java` | `WatchlistRepository.java` | `Watchlist.java` | `watchlist` |
| **Reviews** | `frontend/src/pages/Reviews/Reviews.jsx`<br>`frontend/src/pages/MovieDetails/MovieDetails.jsx` | `UserController.java` (user-service) | `UserServiceImpl.java` | `ReviewRepository.java` | `Review.java` | `reviews` |


---

## 2. Detailed Feature Data Flow

### A. Register (Sign Up)
1. **Frontend**: `Signup.jsx` captures user input and calls `register()` in `AuthContext.jsx`.
2. **API Endpoint**: `POST /api/v1/auth/register` is hit.
3. **Gateway**: `api-gateway.yml` routes `/api/v1/auth/**` to the **Auth Service** (`auth-service`).
4. **Controller**: `AuthController.register()` receives the request (`backend/auth-service/src/main/java/com/cineverse/auth/controller/AuthController.java`).
5. **Service**: `AuthServiceImpl.register()` validates existence and hashes the password using `PasswordEncoder` (`backend/auth-service/src/main/java/com/cineverse/auth/service/AuthServiceImpl.java`).
6. **Repository & Entity**: `UserRepository.java` saves the `User.java` entity.
7. **Database**: Stored in the `users` table.
   - *Key fields*: `id`, `full_name`, `username`, `email`, `password` (BCrypt hash), `is_enabled`.

### B. Login
1. **Frontend**: `Login.jsx` dispatches credentials to `AuthContext.jsx`.
2. **API Endpoint**: `POST /api/v1/auth/login`.
3. **Gateway**: Forwards to **Auth Service**.
4. **Service**: `AuthServiceImpl.login()` verifies the BCrypt hash. If successful, it generates a JWT Access Token and a secure Refresh Token.
5. **Database**: The user is verified in the `users` table. The new refresh token is stored in the `refresh_tokens` table via `RefreshTokenRepository.java`.

### C. Refresh Token
1. **Frontend**: The Axios response interceptor in `frontend/src/services/api.js` catches an HTTP 401 (Unauthorized) error. It automatically pulls the Refresh Token from `localStorage` and calls `POST /api/v1/auth/refresh`.
2. **Gateway**: Forwards to **Auth Service**.
3. **Service**: `AuthServiceImpl.refreshToken()` validates the token against the `refresh_tokens` database table. If valid, it returns a new JWT Access Token.

### D. User Profile
1. **Frontend**: `AuthContext.jsx` requests `GET /api/v1/users/profile`.
2. **Gateway**: `api-gateway.yml` routes `/api/v1/users/**` to the **User Service** (`user-service`).
3. **Controller**: `UserController.getProfile()` (`backend/user-service/src/main/java/com/cineverse/user/controller/UserController.java`).
4. **Service & DB**: `UserServiceImpl.getUserProfile()` looks up the authenticated user's ID in the `users` table (mapped in `backend/user-service/src/main/java/com/cineverse/user/entity/User.java`).

### E. Favorites
1. **Frontend**: `MovieDetails.jsx` triggers `POST /api/v1/users/favorites`.
2. **Gateway**: Forwards to **User Service**.
3. **Controller**: `UserController.addFavorite()`.
4. **Database**: Saves to the `favorites` table via `Favorite.java` entity (`backend/user-service/src/main/java/com/cineverse/user/entity/Favorite.java`).
   - *Key fields*: `id`, `user_id` (FK), `imdb_id`, `movie_title`, `poster_url`, `added_at`. A Unique Constraint ensures a user cannot favorite the same `imdb_id` twice.

### F. Watchlist
1. **Frontend**: `MovieDetails.jsx` triggers `POST /api/v1/users/watchlist`.
2. **Gateway**: Forwards to **User Service**.
3. **Controller**: `UserController.addToWatchlist()`.
4. **Database**: Saves to the `watchlist` table via `Watchlist.java` entity (`backend/user-service/src/main/java/com/cineverse/user/entity/Watchlist.java`).
   - *Key fields*: `id`, `user_id` (FK), `imdb_id`, `movie_title`, `poster_url`, `added_at`.

### G. Reviews
1. **Frontend**: Users submit reviews in `MovieDetails.jsx` via `POST /api/v1/users/reviews`.
2. **Gateway**: Forwards to **User Service**.
3. **Database**: Saves to the `reviews` table via `Review.java` entity (`backend/user-service/src/main/java/com/cineverse/user/entity/Review.java`).
   - *Key fields*: `id`, `user_id` (FK), `imdb_id`, `movie_title`, `rating`, `review_text`, `created_at`.

---

## 3. Storage Security & Infrastructure Configuration

### Tokens & Passwords
- **BCrypt Passwords**: Handled in memory by `AuthServiceImpl.java`. The raw password is never stored; instead, a BCrypt salted hash is saved as a `VARCHAR` in the `password` column of the `users` MySQL table.
- **Refresh Tokens**: Stored securely in the backend `refresh_tokens` database table. This allows the backend to revoke access immediately if a user logs out.
- **JWT Access Tokens**: Stored in the frontend browser's Local Storage (`localStorage.setItem('accessToken', token)`). They are short-lived and mathematically verified by the backend API Gateway via the `JwtAuthenticationFilter` without needing a database lookup.

### Database Connection & Configuration
- **Centralized Configuration**: The project uses Spring Cloud Config. The master database connection details are stored inside `backend/config-repo/application-prod.yml`.
- **Docker Compose Injection**: The `docker-compose.yml` file injects `CONFIG_SERVER_URL=http://config-server:8888` into all microservices (Auth, User, Movie). When these services start, they ping the Config Server to download the `application-prod.yml` properties.
- **MySQL Connection**: The `application-prod.yml` defines the connection string as `jdbc:mysql://${MYSQL_HOST:mysql}:${MYSQL_PORT:3306}/${DATABASE_NAME:cineverse}`.

### Hibernate (JPA) Behavior
- **Tables Auto-Generation**: Hibernate is explicitly configured to use `ddl-auto: update` inside `application-prod.yml`. 
- **Mapping Location**: When the microservices boot up, Spring Boot scans the `@Entity` and `@Table` annotations (e.g., inside `backend/user-service/src/main/java/com/cineverse/user/entity/`) and automatically creates or updates the physical MySQL tables if they do not exist. No manual SQL scripts are required.

---

## 4. OMDb API Key & External Movie Data Flow

To fetch real movie data, the platform integrates with the external **OMDb API**.

### Where is the API Key Stored?
1. **Config Repository (`movie-service.yml`)**: 
   The default API key configuration is stored inside the central configuration repository located at `backend/config-repo/movie-service.yml` under the property:
   ```yaml
   app:
     omdb:
       apikey: ${OMDB_API_KEY:c54ebec3}
   ```
2. **Environment Variable (`.env` file or System Env)**: 
   The configuration utilizes Spring Boot's environment variable injection `${OMDB_API_KEY:c54ebec3}`. This means you can securely override the API key by providing an `OMDB_API_KEY` in a local `.env` file (which would be automatically read by Docker Compose) or as a system environment variable in production, preventing hardcoded secrets in the source code.

### How is the OMDb API Called?
1. **Property Injection**: In the `MovieServiceImpl.java` (`backend/movie-service/src/main/java/com/cineverse/movie/service/MovieServiceImpl.java`), the API key is injected directly into the service layer during initialization using Spring's `@Value` annotation:
   ```java
   @Value("${app.omdb.apikey}")
   private String apiKey;
   ```
2. **Dynamic Request Generation**: When the frontend requests a movie search or movie details, the `MovieServiceImpl` utilizes Spring's `RestClient` and `UriComponentsBuilder` to construct the external HTTP request dynamically. It automatically appends the `apikey` as a URL query parameter alongside the search query (`s`) or IMDb ID (`i`).
   ```java
   UriComponentsBuilder.fromHttpUrl("https://www.omdbapi.com/")
       .queryParam("apikey", apiKey)
       .queryParam("s", query)
       .build()
   ```
3. **Data Return**: The external JSON response from OMDb is parsed into `OmdbSearchResponse` or `OmdbMovieResponse` DTOs, safely formatted by the Movie Service, and streamed back through the API Gateway to the React frontend.
