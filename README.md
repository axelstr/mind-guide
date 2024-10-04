# Mind-Guide

Mind-Guide is a full-stack application for assisting in the diagnosis and treatment planning for psychiatric care.

![Demo](demo.gif)

## Project Structure

- `backend/`: Go backend application.
- `frontend/`: React frontend application.
  - For now, the backend also contains the databases for knowledge and patients stored as `.md` files.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/axelstr/mind-guide.git
   cd mind-guide
   ```

2. Create and save an OpenAI API key. [See documentation](https://platform.openai.com/docs/quickstart).

## Development

For local development, local `go` and `npm` installations are required. Then, the frontend and backend dependencies should be installed using the following commands.

1. Set up the backend:
   ```
   cd backend
   go mod tidy
   ```

2. Set up the frontend:
   ```
   cd frontend
   npm install
   ```


## Running the Application

To only run the application, docker should be used. For local development, it's recommended to start the frontend and backend separately without docker so they can be iterated on and restarted independently.

The application will be available at `http://localhost:3000`.

### Using Docker

This approach only requires a dependency to `docker-compose`.

1. To start the application:
   ```
   OPENAI_API_KEY={OPENAI_API_KEY} docker-compose up --build
   ```
   `{OPENAI_API_KEY]` should be replaced with the key generated in the setup stage.

2. To close the application:
   ```
   docker-compose down
   ```

### Without Docker

This approach requires both local `go` and `npm` installations.

1. Start the backend:
   ```
   cd backend
   go run cmd/server/main.go
   ```

2. In a new terminal, start the frontend:
   ```
   cd frontend
   npm start
   ```

## TODO

- [x] Handle in frontend if the user hasn't configured an API key yet.
- [ ] Dependency inject language model to backend components.
  - To make the components language model agnostic, the client should be dependency injected to fit a shared interface.
- [ ] Add unit tests for backend.
  - Each step should have unit tests. This requires a mock language model that can be dependency injected.
- [ ] Implement `Contextualizer`.
  - The contextualizer provides the context for the judgement for the provider. This allows the provider to see the context from the knowledge database.
- [ ] Implement `Validator`.
  - The validator cross checks the outputs. This will likely need a language model call but this should be joined with classical methods such as regex or string comparisons.