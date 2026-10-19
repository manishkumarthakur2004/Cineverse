# CineVerse Project Features & Architecture Guide

This document is designed to help you explain the core features, data flows, and project architecture of CineVerse during your presentation or viva.

## 1. Project Architecture Overview
CineVerse is built using a modern **Microservices Architecture**:
- **Frontend**: React (built with Vite) styled with Vanilla CSS/Tailwind.
- **API Gateway**: Spring Cloud Gateway that routes all frontend requests to the correct backend service on port `9080`.
- **Backend Microservices**: Spring Boot (Java 21). Separated into `auth-service`, `user-service`, and `movie-service`.
- **Database**: A shared MySQL database container handling user profiles, credentials, favorites, and watchlists.
- **Deployment**: The entire backend infrastructure runs inside Docker via `docker-compose`.

---

## 2. Core Features Explained

### A. How Movie Posters & Details are Fetched (OMDb API Integration)
**Question**: *Where do the movies come from and how do you get the posters?*
**Answer**: 
We do not store the movies locally. Instead, the `movie-service` communicates with an external database called the **OMDb API**. 
1. The frontend React app sends a search query (e.g., `api.get('/movies/search?query=Marvel')`).
2. The request goes through the API Gateway to the `movie-service`.
3. In `MovieServiceImpl.java`, the backend dynamically attaches our API Key (stored safely in `movie-service.yml`) and makes an external HTTP request using Spring's `RestClient` to `https://www.omdbapi.com/`.
4. The OMDb API returns JSON data including the `Poster` URL (which is just an image link).
5. We map this data into our own `MovieResponse.java` object and send it back to React. React simply puts that URL into an `<img src={...}>` tag to display the poster!

### B. YouTube Trailer Redirection
**Question**: *How does the 'Watch Trailer' button work? Does it use the YouTube API?*
**Answer**:
No, it uses a smart dynamic URL generation technique to save API quotas and external dependencies. 
1. When a user clicks "Watch Trailer", it opens the `TrailerModal.jsx` component.
2. The component takes the current movie's title and dynamically constructs a YouTube search URL using JavaScript's `encodeURIComponent()`.
3. The formula is: `https://www.youtube.com/results?search_query=[Movie Title] Official Trailer`.
4. The button acts as an HTML `<a>` tag with `target="_blank"`, safely opening a new browser tab directly to the YouTube search results for that exact trailer.

### C. Personal Stremio Playback Integration
**Question**: *How does the 'Play in Stremio' feature connect to the desktop application without an API?*
**Answer**:
This uses native OS-level deep linking using Stremio's officially supported custom URL schemes.
1. When a user clicks "Play in Stremio", React constructs an official Stremio search URI: `stremio:///search?search=[IMDb ID]`.
2. The browser automatically delegates this `stremio:///` protocol to the operating system, which wakes up the installed Stremio Desktop client.
3. Stremio natively executes a search for that exact IMDb ID, instantly surfacing the movie and listing all available streams from the user's pre-installed addons.
4. **Fallback Handling**: The app uses a JavaScript timeout to detect if the browser tab remained active (meaning Stremio failed to launch). If so, it gracefully presents a custom modal providing manual fallback options (Copying the IMDb ID manually, or falling back to the YouTube Trailer).

### D. Authentication (Signup & Login)
**Question**: *How is user data stored and how does Login work?*
**Answer**:
1. **Signup**: When a user registers, `AuthController.java` receives the email and password. In `AuthServiceImpl.java`, we use `BCrypt` to securely hash the password. The raw password is NEVER stored. The hash is saved to the `users` table in MySQL.
2. **Login**: When logging in, the backend compares the entered password against the stored BCrypt hash. If they match, the backend generates a **JWT (JSON Web Token)** and a **Refresh Token**.
3. **Storage**: The JWT is sent to the frontend and stored in the browser's `localStorage`. The frontend attaches this JWT to the HTTP Headers of every future request to prove the user is logged in. The Refresh Token is stored in the `refresh_tokens` MySQL table so the backend can securely manage session expiration.

### E. User Data (Favorites, Watchlist, Reviews)
**Question**: *Where are the user's favorites and watchlists saved?*
**Answer**:
These are managed by the `user-service`. When a user clicks "Add to Favorites":
1. React sends a `POST` request to `/api/v1/users/favorites` containing the movie's `imdbId`, `title`, and `posterUrl`.
2. The Gateway routes this to `UserController.java`.
3. Hibernate (JPA) maps this data to the `Favorite.java` entity and saves it in the `favorites` MySQL table, linking it via a Foreign Key to the user's ID.

---

## 3. Directory Structure
If you are asked to navigate the code, here is where everything lives:

### Frontend (`/frontend`)
- `src/assets/`: Contains local videos (e.g. `dark-galaxy.mp4`), SVGs, and placeholder images.
- `src/components/`: Reusable UI components (`Navbar.jsx`, `MovieCard.jsx`, `HeroBanner.jsx`).
- `src/pages/`: Full screen views (`Home.jsx`, `MovieDetails.jsx`, `Login.jsx`, `Signup.jsx`).
- `src/services/api.js`: The Axios configuration that defines the base URL and handles adding the JWT token to requests.
- `src/context/AuthContext.jsx`: Manages global user state (is the user logged in? who is the user?).

### Backend (`/backend`)
- `docker-compose.yml`: The blueprint that starts the MySQL database, Config Server, and the 3 microservices.
- `config-repo/`: Contains the YAML configuration files for the microservices (e.g., ports, database credentials, API keys).
- `api-gateway/`: Routes frontend requests (`:9080`) to the correct microservice.
- `auth-service/`: Handles `/auth/register` and `/auth/login`. Manages JWTs and Password hashing.
- `movie-service/`: Handles `/movies/search`. Talks to the external OMDb API.
- `user-service/`: Handles `/users/profile`, `/users/favorites`, and `/users/watchlist`. Connects to the database to save user-specific movie data.
