# Mind-Guide

Mind-Guide is a full-stack application for assisting in the diagnosis and treatment planning for mental health..

## Project Structure

- `backend/`: Go backend application.
- `frontend/`: React frontend application.
- `knowledge.txt`: Knowledge database.
- `Dockerfile`: Docker configuration for building and running the application.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/axelstr/mind-guide.git
   cd mind-guide
   ```

2. Set up the backend:
   ```
   cd backend
   go mod tidy
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

## Running the Application

### Using Docker

1. To start the service:
   ```
   docker-compose up --build
   ```

2. To close the service:
   ```
   docker-compose down
   ```

### Without Docker

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

The application will be available at `http://localhost:3000`.
