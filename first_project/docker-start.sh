#!/bin/bash

echo "Starting Stacks Devnet with Docker..."

# Create necessary directories
mkdir -p ./data/stacks-node
mkdir -p ./data/postgres

# Start the services
docker-compose up -d

echo "Waiting for services to start..."
sleep 10

# Check if services are running
echo "Checking service status..."
docker-compose ps

echo ""
echo "Stacks Devnet is now running!"
echo ""
echo "Services available at:"
echo "- Stacks Node RPC: http://localhost:20443"
echo "- Stacks API: http://localhost:3999"
echo "- Stacks Explorer: http://localhost:8000"
echo "- PostgreSQL: localhost:5432"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
