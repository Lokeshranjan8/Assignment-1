# Streamoid Internship Assignment

Simple Node.js product importer backed by PostgreSQL. This repository provides an API to upload a CSV of products and store them in a Postgres database. A Docker Compose setup runs the Node app and Postgres.

...
## Features
- Upload CSV files (multipart/form-data) and store products in PostgreSQL
- List and search products via HTTP endpoints

## Requirements
- Docker (20+) and Docker Compose plugin


## Docker setup and run

You can run the project using Docker Compose (recommended) or build/run the containers manually. Run the commands below from the project root.

If you haven't cloned the repository yet:
```bash
git clone https://github.com/Lokeshranjan8/Assignment-1.git
cd Assignment-1
```

Run with Docker Compose (foreground):

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up -d --build
```

## Database  (Postgress)

To view the  Postgres container and run SQL commands:

```bash
docker exec -it assignment-1-postgres-1 psql -U postgres -d productsdb
```

Once inside the Postgres shell, you can check your data, for example:


```bash
SELECT COUNT(*) FROM products;
SELECT * FROM products LIMIT 5;
```





## API documentation

Base URL: http://localhost:3000

1) POST /upload
- Upload a CSV file (multipart/form-data) using the field name `file`.

Example:

```bash
curl -X POST -F "file=@products.csv" http://localhost:3000/upload
```

2) GET /products
- Returns all products.

```bash
curl http://localhost:3000/products
```

3) GET /products/search
- Query parameters: `brand`, `color`, and/or `minPrice` / `maxPrice`.

Example:

```bash
curl "http://localhost:3000/products/search?brand=StreamThreads"
```

---

