#!/bin/bash

echo "Starting backend and frontend servers, this may take some time..."

# Start backend server
(cd backend && USE_MOCK_DB=true NODE_ENV=test npm start &) # Replace with your actual command to start the backend
BACKEND_PID=$!

# Give the server a moment to start
sleep 30

# Get the actual backend server PID
BACKEND_PORT=3001 # Replace with the port your backend uses
BACKEND_PID=$(lsof -t -i:$BACKEND_PORT)

# Start frontend server
echo "Starting frontend server..."
(cd frontend && REACT_APP_API_URL=http://localhost:3001 npm start &) # Replace with your actual command to start the frontend
FRONTEND_PID=$!

# Wait for the frontend server to start
sleep 70 # This takes forever


#get the actual frontend server PID
FRONTEND_PORT=3000 # Replace with the port your frontend uses
FRONTEND_PID=$(lsof -t -i:$FRONTEND_PORT)

# Run the frontend e2e tests
echo "Running e2e tests..."
(cd frontend && npm run test:e2e)

# Stop the frontend server
echo "Stopping frontend server..."
if [ -n "$FRONTEND_PID" ]; then
  kill $FRONTEND_PID
  echo "Frontend server stopped."
else
  echo "Frontend server not running."
fi

# Stop the backend server
echo "Stopping backend server..."
if [ -n "$BACKEND_PID" ]; then
  kill $BACKEND_PID
  echo "Backend server stopped."
else
  echo "Backend server not running."
fi

echo "E2E tests completed."

echo "Generating code coverage report..."

(cd frontend/coverage/playwright && npx nyc report --report-dir=coverage/playwright --reporter=lcov --reporter=text)
