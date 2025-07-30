# Homecooked — Share Meals with Your Neighborhood

Homecooked is a web application that makes it easy to share your home-cooked meals with people nearby.

As a chef, you can list meals you plan to prepare on a specific day. Set the number of portions, price per portion, pickup time, and pickup location.

As a customer, you can browse local listings and reserve a portion for pickup.

Users can play both roles: cook on some days, order on others.

Meals are paid for directly to the chef at pickup (cash, mobile transfer, etc.).

To build trust in the community, both chefs and customers can leave reviews after each exchange.

## Architecture

The project is organized into three main directories:

- **`backend/`**: Contains the backend service.
- **`frontend/`**: Contains the frontend application.
- **`database/`**: Contains database schemas, migrations, and connection configuration.

### Backend Architecture

The backend is a Node.js application built with Fastify and TypeScript, following a layered architecture.

routes -> controllers -> services -> repositories -> database

- **`src/`**: Contains the main source code.
  - **`routes/`**: Defines the API routes and maps them to controllers.
  - **`controllers/`**: Handles incoming requests, validates input, and calls the appropriate services.
  - **`services/`**: Contains the core business logic of the application.
  - **`repositories/`**: Manages data access and interaction with the database.
  - **`models/`**: TypeScript interfaces and types for data models.
  - **`utils/`**: Utility functions and helper methods.
  - **`errors/`**: Centralized error handling and custom error classes.
  - **`index.ts`**: The entry point of the application, responsible for starting the server.

### Frontend Architecture

(To be defined)

## Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: PostgreSQL

## Coding Style and Conventions

### Backend

- **File Naming**: Use `kebab-case.ts` for all files (e.g., `user-controller.ts`).
- **Functions**: Use arrow functions over traditional functions.
- **Asynchronous Operations**: Use `async/await` for all asynchronous code.
- **Error Handling**: Implement a centralized error handling mechanism.
- **Modules**: Use ES Modules over commonJS.
- **Imports**: Use destructured imports (e.g., `import { someFunction } from './some-module';`).
- **Linting**: ESLint
- **Formatting**: Prettier

## Useful commands

### Backend

- `npm install`: Install dependencies.
- `npm run dev`: Start the development server in watch mode.
- `npm start`: Start the production server.
- `npm run build`: Build the production server.
- `npm run lint`: Lint the codebase.
- `npm run lint:fix`: Lint and fix the codebase.
- `npm run format`: Format the codebase.
- `npm run format:check`: Check the format of the codebase.
- `npm test`: Run tests.

### Database

- `docker compose up -d`: Start PostgreSQL service.
- `docker compose down`: Stop PostgreSQL service.
