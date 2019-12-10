#!/bin/sh

# Copy .env file
cp -n .env-example .env

# Start up docker containers
docker-compose -p deliveryorderapi up