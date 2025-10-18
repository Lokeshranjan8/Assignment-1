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

```bash
 id |      sku       |          name          |     brand     |  color   |  size   | mrp  | price | quantity 
----+----------------+------------------------+---------------+----------+---------+------+-------+----------
  1 | TSHIRT-RED-001 | Classic Cotton T-Shirt | StreamThreads | Red      | M       |  799 |   499 |       20
  2 | TSHIRT-BLK-002 | Classic Cotton T-Shirt | StreamThreads | Black    | L       |  799 |   549 |       12
  3 | POLO-GRN-003   | Heritage Polo          | StreamThreads | Green    | XL      | 1299 |   999 |        8
  4 | JEANS-BLU-032  | Slim Fit Jeans         | DenimWorks    | Blue     | 32      | 1999 |  1599 |       15
  5 | JEANS-BLK-030  | Slim Fit Jeans         | DenimWorks    | Black    | 30      | 1999 |  1499 |       18
  6 | DRESS-PNK-S    | Floral Summer Dress    | BloomWear     | Pink     | S       | 2499 |  2199 |       10
  7 | DRESS-YLW-M    | Floral Summer Dress    | BloomWear     | Yellow   | M       | 2499 |  1999 |        7
  8 | SHOE-WHT-7     | Everyday Sneakers      | StrideLab     | White    | UK7     | 2999 |  2499 |       25
  9 | SHOE-NVY-8     | Everyday Sneakers      | StrideLab     | Navy     | UK8     | 2999 |  2499 |       19
 10 | BAG-TOTE-BEI   | Canvas Tote Bag        | CarryCo       | Beige    | OneSize |  899 |   699 |       35
 11 | BELT-BRN-38    | Leather Belt           | CarryCo       | Brown    | 38      | 1199 |   899 |       40
 12 | SAREE-RED-001  | Banarasi Silk Saree    | Ethniq        | Red      | Free    | 6999 |  5999 |        5
 13 | KURTA-BLU-M    | Cotton Kurta           | Ethniq        | Blue     | M       | 1599 |  1299 |       22
 14 | JKT-OLV-L      | Utility Jacket         | UrbanEdge     | Olive    | L       | 3499 |  2999 |        6
 15 | TSHIRT-GRY-S   | Graphic Tee            | UrbanEdge     | Grey     | S       |  899 |   699 |       30
 16 | TSHIRT-WHT-XS  | Graphic Tee            | UrbanEdge     | White    | XS      |  899 |   649 |       14
 17 | SHIRT-CHK-M    | Checked Casual Shirt   | ButtonUp      | Multi    | M       | 1799 |  1399 |       16
 18 | SHIRT-PLN-L    | Plain Oxford Shirt     | ButtonUp      | Blue     | L       | 1899 |  1499 |       12
 19 | HOODIE-CHR-XL  | Cozy Hoodie            | SnugWear      | Charcoal | XL      | 2199 |  1799 |       11
 20 | HOODIE-CRM-M   | Cozy Hoodie            | SnugWear      | Cream    | M       | 2199 |  1699 |        9
(20 rows)

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

