# Mirage: Campus-Wide AR Treasure Hunt

## 1. Project Overview and Objective

Mirage is a real-time, campus-wide treasure hunt that blends augmented reality with a "Pokemon Go-like" map interface. The goal is to create an engaging, low-latency experience that encourages exploration and teamwork. Players navigate the campus using a live map, and upon reaching a location, they interact with AR elements to solve challenges.

The architecture uses a React frontend, a lightweight FastAPI backend for game logic, and Firebase for data storage. This separation of concerns ensures security, scalability, and maintainability.

## 2. Technology Stack

The project is built on a modern stack, ensuring a fast, reliable, and scalable application.

| Component             | Technology                                             | Rationale                                                                                                         |
| --------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Architecture**      | Client-Server                                          | A React frontend for the user interface and a FastAPI backend for secure game logic.                              |
| **Backend**           | FastAPI (Python)                                       | A high-performance, lightweight Python framework for building the API that powers the game.                       |
| **Deployment**        | Firebase Hosting (Frontend) & Cloud Provider (Backend) | Frontend is deployed as a static site. The backend can be hosted on any provider like Google Cloud Run or Heroku. |
| **Frontend**          | React with Vite                                        | A modern, fast, and component-based framework for building a dynamic single-page application (SPA).               |
| **Mapping**           | React-Leaflet                                          | Integrates a "Pokemon Go-like" map interface for navigating the campus and locating markers.                      |
| **Augmented Reality** | A-Frame & AR.js (planned)                              | A reliable web-based solution for overlaying interactive 3D objects and UI onto the real world.                   |
| **Real-time Data**    | Firebase Firestore                                     | Manages all live data, including player profiles, team scores, and marker locations.                              |
| **Styling**           | Tailwind CSS                                           | A utility-first CSS framework for rapid and responsive UI development.                                            |

## 3. Core Game Flow

The game logic is now driven by a secure backend to prevent cheating and manage the game state centrally.

1. **Marker Discovery**: The player scans a Hiro marker using the frontend application.
2. **Location Check**: The frontend sends the player's current geolocation to the FastAPI backend.
3. **Backend Validation**: The backend checks if the player is within a 30-meter radius of the marker's actual location stored in Firestore.
4. **Question Delivery**: If the location is valid, the backend retrieves the corresponding question from Firestore and sends it to the frontend.
5. **Answering the Challenge**: The player submits their answer through the frontend.
6. **Answer Verification**: The frontend sends the question ID and the answer to the backend, which verifies it against the data in Firestore.
7. **Next Step**:
   - If the answer is **correct**, the backend updates the player's score, finds a random, undiscovered location for the next challenge, and sends a hint for that new location back to the frontend.
   - If the answer is **incorrect**, the backend returns a failure response, and the player can try again.

## 4. Firestore Collections

The backend is powered by Firebase Firestore, which uses the following collections to manage game data:

### `mirage-locations`

This collection stores all the markers for the treasure hunt.

| Field      | Type       | Description                                             |
| ---------- | ---------- | ------------------------------------------------------- |
| `id`       | `string`   | The unique identifier for the marker.                   |
| `location` | `GeoPoint` | The latitude and longitude of the marker.               |
| `title`    | `string`   | The title or name of the marker.                        |
| `question` | `string`   | The question or challenge text. Can be empty.           |
| `answer`   | `string`   | The answer to the question. Can be empty.               |
| `hint`     | `string`   | An optional hint for the player.                        |
| `points`   | `number`   | The number of points awarded for completing the marker. |

### `users`

This collection stores user profiles and their roles.

| Field         | Type     | Description                                          |
| ------------- | -------- | ---------------------------------------------------- |
| `uid`         | `string` | The user's unique ID from Firebase Authentication.   |
| `displayName` | `string` | The user's display name.                             |
| `email`       | `string` | The user's email address.                            |
| `role`        | `string` | The user's role (`admin`, `player`, `events-admin`). |
| `teamId`      | `string` | The ID of the team the user belongs to (optional).   |
| `score`       | `number` | The user's individual score.                         |

### `teams`

This collection stores team information.

| Field     | Type            | Description                                |
| --------- | --------------- | ------------------------------------------ |
| `id`      | `string`        | The unique identifier for the team.        |
| `name`    | `string`        | The name of the team.                      |
| `members` | `array<string>` | An array of user UIDs who are on the team. |
| `score`   | `number`        | The team's total score.                    |

## 5. Deployment & Instructions

Deployment now involves two components: the frontend and the backend. For detailed setup, build, and deployment instructions, please see [INSTRUCTIONS.md](INSTRUCTIONS.md).
