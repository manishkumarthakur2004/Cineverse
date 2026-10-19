# CineVerse Syntax & Annotation Guide

This document contains the most common syntaxes and annotations used throughout the CineVerse project. Use this as a cheat sheet for your revision!

---

## 1. Lombok Annotations (Backend)
Lombok is used to reduce boilerplate Java code (like getters and setters).

- `@Data`: Automatically generates getters, setters, `toString()`, `equals()`, and `hashCode()` for all fields in a class.
- `@Builder`: Allows you to create objects using a clean, readable Builder pattern (e.g., `MovieResponse.builder().title("Inception").build();`).
- `@NoArgsConstructor`: Generates a default, empty constructor (required by frameworks like JPA and Jackson).
- `@AllArgsConstructor`: Generates a constructor that accepts a parameter for every single field in the class.
- `@Slf4j`: Automatically creates a logging variable (named `log`) so you can easily log messages (e.g., `log.info("Fetching movie...");`).

---

## 2. Spring Web Annotations (Backend APIs)
These handle how the backend responds to internet HTTP requests.

- `@RestController`: Tells Spring that this class is an API Controller and that every method should return data (usually JSON), not a web page.
- `@RequestMapping("/api/v1/movies")`: Sets a base URL path for all endpoints in the controller.
- `@GetMapping("/search")`: Maps an HTTP GET request (used to fetch data) to a specific method.
- `@PostMapping("/favorites")`: Maps an HTTP POST request (used to save or send data) to a specific method.
- `@RequestBody`: Tells Spring to take the JSON body sent by the frontend and convert it into a Java object.
- `@PathVariable("id")`: Extracts a value directly from the URL path (e.g., `/movies/{id}`).
- `@RequestParam("query")`: Extracts a value from the URL query string (e.g., `/search?query=Batman`).

---

## 3. Spring Dependency Injection (Backend Structure)
These tell Spring how to manage the lifecycle of your classes.

- `@Service`: Marks a class as a "Service" layer, meaning it contains core business logic (like hashing passwords or calling external APIs).
- `@RequiredArgsConstructor` (Lombok): Automatically generates a constructor for all `final` fields. This is the modern, safest way to do Dependency Injection in Spring Boot.
- `@Value("${app.omdb.apikey}")`: Injects a specific value from your configuration files (like `application.yml` or `.env`) directly into a Java variable.
- `@Configuration`: Indicates that the class contains setup methods (Beans) for the Spring application context (like setting up security or the RestClient).
- `@Bean`: Marks a method that produces an object to be managed by the Spring container.

---

## 4. JPA / Hibernate Annotations (Database)
These handle how Java objects are saved into MySQL tables.

- `@Entity`: Tells Hibernate that this class represents a database table.
- `@Table(name = "users")`: Explicitly names the table in the MySQL database.
- `@Id`: Marks a field as the Primary Key of the table.
- `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Tells MySQL to automatically auto-increment the ID (1, 2, 3...) when a new row is saved.
- `@Column(unique = true, nullable = false)`: Configures specific rules for a database column (e.g., it cannot be empty, and it must be unique).
- `@ManyToOne`: Defines a relationship where *many* records of this class belong to *one* record of another class (e.g., Many Favorites belong to One User).
- `@JoinColumn(name = "user_id")`: Specifies the exact foreign key column used to join tables together.

---

## 5. Jackson Annotations (JSON Parsing)
- `@JsonProperty("Title")`: Maps a differently-named JSON key from an external API (like OMDb) directly to your Java variable, bypassing naming conventions.

---

## 6. React & JavaScript Syntax (Frontend)
These are the core hooks and syntaxes used to build the interactive UI.

- `useState(initialValue)`: A React hook that lets you add state (memory) to a component. Returns the current state and a function to update it.
  ```javascript
  const [loading, setLoading] = useState(false);
  ```
- `useEffect(() => { ... }, [dependencies])`: A React hook used to perform side effects, like fetching data from the backend as soon as the page loads.
- `useParams()`: A hook from React Router that grabs dynamic variables from the URL (e.g., extracting the IMDb ID from `/movie/tt0816692`).
- **Optional Chaining (`?.`)**: Safely accesses nested object properties without crashing if the object is null.
  ```javascript
  const name = user?.fullName; // Won't crash if user is null
  ```
- **Ternary Operator (`? :`)**: A short-hand `if-else` statement heavily used in JSX to conditionally render UI.
  ```javascript
  {isAuthenticated ? <button>Logout</button> : <button>Login</button>}
  ```
