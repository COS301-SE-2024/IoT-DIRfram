#!/bin/bash

echo "Starting backend and frontend servers, this may take some time..."

# Start backend server
(cd backend && USE_MOCK_DB=true NODE_ENV=test npm start &) # Replace with your actual command to start the backend
BACKEND_PID=$!

# Start frontend server
(cd frontend && REACT_APP_API_URL=http://localhost:3001 npm start &) # Replace with your actual command to start the frontend
FRONTEND_PID=$!


wait $FRONTEND_PID

