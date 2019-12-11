# Requirements
- Docker
- docker-compose

# Setting up
1. Copy file `.env-example` to `.env` (run `cp -n .env-example .env`) and fill in correct config values.
  1. Get `GOOGLE_MAPS_API_KEY` from https://cloud.google.com/maps-platform/routes/. It's required for route distance calculation.
  2. All other details can be left unchanged.
2. Run `./start.sh`. It will set up all docker containers and database.
3. API endpoints are ready at `https://localhost:8080/orders`.
4. To set up testing environment and run internal tests, run `docker-compose -f docker-compose.test.yml -p delivery-order-api up  --abort-on-container-exit`.
5. To set up production environment, run `docker-compose -f docker-compose.production.yml -p delivery-order-api up`.

# Tests
1. To run tests locally, run `yarn test`. (you need all dependencies installed locally.)
2. If you're running the app inside a docker, you can run `docker exec -ti delivery-order-api_app_1 yarn test` to run tests inside the docker container.

TODO
- [x] RESTful HTTP API listening to port 8080.
- [x] MySQL database is used to store orders.
  - [x] Database schema is in `./schemas/*`.
- [x] API implements 3 endpoints:
  - [x] Create order. (`POST /orders`)
    - [x] Expects `origin` and `destination`.
    - [x] Use GoogleMaps' `DistanceMatrix` API to calculate route distance from `origin` to `destination`. 
    - [x] Validates `origin` and `destination` to be a valid latitude and longitude pair (`["lat", "long"]`, array of 2 strings, `lat` <= 90, `long` <= 180.)
    - [x] Validates if there's a route from `origin` to `destination`.
    - [x] Returns ` distance` and the order `id`.
  - [x] Take order. (`PATCH /orders/:id`)
    - [x] Expects order `id` and `status`.
    - [x] Validates order for a given `id` to be present and not yet assigned (`status=UNASSIGNED`.)
    - [x] Returns `distance` and the order `id`.
  - [x] List orders (`GET /orders?page=:page&limit=:limit`)
    - [x] `page` and `limit` are optional.
    - [x] Validates `page` and `limit` to be integers and greater than zero.
    - [x] Returns list of orders.
- [x] All responses are in json format for both success or failure situations.
  - [x] `HTTP 200` for successful operations.
  - [x] `HTTP 404` for nonexistant routes/resources.
  - [x] `HTTP 422` for any validation errors.
  - [x] `HTTP 500` for any runtime/server errors.
- [x] Unit tests and integration tests. 100% code coverage.
  - [x] Integration tests: `src/app.spec.js`.
  - [x] Unit tests: all other `*.spec.js` files.
- [x] ESLint with `eslint-config-airbnb-base` styleguide.
- [x] Docker compose
  - [x] docker-compose.yml for development environment.
  - [x] docker-compose.test.yml for testing environment.
  - [x] docker-compose.production.yml for production environment.
  - [x] All dependencies and database are initialized inside docker-compose
