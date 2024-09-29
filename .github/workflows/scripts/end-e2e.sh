# Get the actual backend server PID
BACKEND_PORT=3001 # Replace with the port your backend uses
BACKEND_PID=$(lsof -t -i:$BACKEND_PORT)

#get the actual frontend server PID
FRONTEND_PORT=3000 # Replace with the port your frontend uses
FRONTEND_PID=$(lsof -t -i:$FRONTEND_PORT)

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