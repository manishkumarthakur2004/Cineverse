# How to Run CineVerse

Follow these simple steps to start the entire CineVerse project locally on your machine.

---

## Step 1: Start the Backend (Microservices & Database)

You need to compile the Java code and then boot up the Docker containers.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Compile the microservices using Maven:
   ```bash
   mvn clean package -DskipTests
   ```

3. Start all backend infrastructure (MySQL, API Gateway, Auth, User, and Movie services) using Docker Compose:
   ```bash
   docker-compose up -d
   ```
   *(Wait about 30-45 seconds for all services, especially the `config-server` and `mysql`, to become healthy before using the app).*

---

## Step 2: Start the Frontend (React App)

Now, start the user interface.

1. Open a **new** terminal (keep the backend one running) and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## Step 3: View the Application

Open your browser and navigate to:
👉 **[http://localhost:5173](http://localhost:5173)** *(or 5174 if 5173 is occupied)*

*(Note: The Backend API Gateway runs on `http://localhost:9080`)*

---

## Useful Docker Commands

Run these inside the `backend` directory if you need to manage the backend:

- **Check status of all microservices**: 
  ```bash
  docker-compose ps
  ```
- **View live backend logs** (Press Ctrl+C to exit logs): 
  ```bash
  docker-compose logs -f
  ```
- **Stop everything safely**: 
  ```bash
  docker-compose down
  ```
- **Completely wipe the database (Hard Reset)**: 
  ```bash
  docker-compose down -v
  ```
