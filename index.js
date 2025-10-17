import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import {initDB} from './DB/initdb.js';
import {insertProduct} from './DB/insertion.js';
import {pool} from './DB/initdb.js';
const app = express();
const PORT = 3000;

await initDB();

app.get('/upload', async (req,res)=>{
    try {
        const readstream = fs.createReadStream("product.csv").pipe(csv());
        const rows = [];

        for await (const row of readstream){
            try{
                rows.push({
                    sku: row.sku,
                    name: row.name,
                    brand: row.brand,
                    color: row.color,
                    size: row.size,
                    mrp: Number(row.mrp),
                    price: Number(row.price),
                    quantity: Number(row.quantity) || 0
                });
            }catch(err){
                console.log(`Error processing row ${JSON.stringify(row)}: ${err.message}`);
            }
        }
        let cnt=0;
        for(const row of rows){
            try{
                await insertProduct(row);
                cnt++;
            }catch(err){
                console.log(`Error inserting row ${JSON.stringify(row)}: ${err.message}`);
            }
        }
        res.json({message: `Processed ${cnt} rows`});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Server error'});
    }


})

app.get('/products' , async(req,res)=>{
    try{
        console.log("Fetching products");
        const result = await pool.query('SELECT * FROM products');
        res.json(result.rows);

    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'unable to fetch products'});
    }

});

app.get('/', (req,res) =>{
    res.send('Hello World!');
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
