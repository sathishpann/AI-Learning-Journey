#!/bin/bash

echo "🚀 Starting AI Learning Journey Tracker..."

# Start backend
echo "📦 Starting backend server..."
cd backend
python3 -m venv venv 2>/dev/null
source venv/bin/activate
pip install -r requirements.txt -q
python main.py &
BACKEND_PID=$!

# Start frontend
echo "⚛️  Starting frontend server..."
cd ../frontend
npm install 2>/dev/null
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo "📊 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for both processes
wait
