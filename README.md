# Assignment-1

Simple Node.js product importer backed by PostgreSQL. This repository provides an API to upload a CSV of products and store them in a Postgres database. A Docker Compose setup runs the Node app and Postgres.

...
## Features
- Upload CSV files (multipart/form-data) and store products in PostgreSQL
- List and search products via HTTP endpoints

## Requirements
- Docker (20+) and Docker Compose plugin

## Docker setup and run instructions

This project can run with either Docker Compose (recommended) or manually using docker build/run commands. Use the commands below from the project root.

1) Build the app image (from project root):

```bash
docker build -t assignment1-app .
```

2) Run Postgres standalone (exposes port 5432 on host):

```bash
docker volume create assignment1-pgdata

docker run -d \
	--name postgres-db \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=postgrespw \
	-e POSTGRES_DB=productsdb \
	-p 5432:5432 \
	-v assignment1-pgdata:/var/lib/postgresql/data \
	postgres:15
```

Wait a few seconds for Postgres to initialize.

3) Run the app container and connect it to Postgres using a user-defined network (recommended):

```bash
docker network create assignment1-net

docker run -d \
	--name postgres-db \
	--network assignment1-net \
	-e POSTGRES_USER=postgres \
	-e POSTGRES_PASSWORD=postgrespw \
	-e POSTGRES_DB=productsdb \
	-v assignment1-pgdata:/var/lib/postgresql/data \
	postgres:15

docker run -d \
	--name assignment1-app \
	--network assignment1-net \
	-p 3000:3000 \
	-e PGHOST=postgres-db \
	-e PGUSER=postgres \
	-e PGPASSWORD=postgrespw \
	-e PGDATABASE=productsdb \
	-e PGPORT=5432 \
	-v "$(pwd)":/app \
	assignment1-app
```

4) Easiest: use Docker Compose (builds and runs app + postgres together):

```bash
docker compose up --build
# or detached:
docker compose up -d --build
```

5) Verify
- View app logs:

```bash
docker compose logs -f app
```

- Query the DB from inside the Postgres container:

```bash
docker compose exec postgres psql -U postgres -d productsdb -c "SELECT count(*) FROM products;"
```

## API documentation

Base URL: http://localhost:3000

1) POST /upload
- Upload a CSV file (multipart/form-data) with field name `file`.
- Example:

```bash
curl -X POST -F "file=@products.csv" http://localhost:3000/upload
```

2) GET /products
- Returns all products

```bash
curl http://localhost:3000/products
```

3) GET /products/search
- Query parameters: `brand`, `color`, or `minPrice` and `maxPrice`.

Example:

```bash
curl "http://localhost:3000/products/search?brand=StreamThreads"
```

