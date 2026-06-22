#!/usr/bin/env bash
set -e

echo "=== Installing dependencies ==="
cd api && bun install && cd ..
cd client && bun install && cd ..

echo ""
echo "=== Starting API server (port 3000) ==="
cd api && bun run dev &
API_PID=$!

echo "=== Starting Frontend dev server (port 5173) ==="
cd client && bun run dev &
CLIENT_PID=$!

echo ""
echo "API:      http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $API_PID $CLIENT_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
