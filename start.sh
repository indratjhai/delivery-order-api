#!/bin/sh

# Copy .env file in case it is not present yet.
cp -n .env-example .env

# Start up docker containers
docker-compose -p deliveryorderapi up