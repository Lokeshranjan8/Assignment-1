import express from 'express';
import csv from 'csv-parser';
import fs from 'fs';
import {initDB} from './DB/initdb.js';
import {insertProduct} from './DB/insertion.js';
import {pool} from './DB/initdb.js';
import multer from 'multer';

const app = express();
const upload = multer({dest: 'uploads/'});
const PORT = 3000;


await initDB();

app.post('/upload', upload.single('file'), async (req, res) => {
    if(!req.file){
        return res.status(400).json({message: 'No file uploaded'});
    }
    try {
        const readstream = fs.createReadStream(req.file.path).pipe(csv());
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
        fs.unlinkSync(req.file.path);

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

app.get('/products/search', async (req, res) => {
    try {
        const { brand , color , minPrice , maxPrice} = req.query;
        if(!brand && !color && !(minPrice && maxPrice)){
            return res.status(400).json({message: 'Please provide at least one search parameter: brand, color, or price range (minPrice and maxPrice)'});
        }

        if(brand){
            console.log(`Searching products by brand: ${brand}`);
            try{
                const result = await pool.query('SELECT * FROM products WHERE brand = $1', [brand]);
                if(result.rows.length === 0 ){
                    return res.status(404).json({message: `No products found for brand ${brand}`});
                }
                return res.json(result.rows);
            }catch(err){
                console.log(err);
                return res.status(500).json({message: `unable to fetch products brand ${brand}`});
            }
        }
        
        if(color){
            console.log(`Searching products by color: ${color}`);
            try{
                const result = await pool.query('SELECT * FROM products WHERE color = $1', [color]);
                if(result.rows.length === 0 ){
                    return res.status(404).json({message: `No products found for color ${color}`});
                }
                return res.json(result.rows);
            }catch(err){
                console.log(err);
                return res.status(500).json({message: `unable to fetch products color ${color}`});
            }
        }

        if(minPrice && maxPrice){
            console.log(`Searching products by price range: ${minPrice} - ${maxPrice}`);
            try{
                const result = await pool.query('SELECT * FROM products WHERE price BETWEEN $1 AND $2', [minPrice, maxPrice]);
                if(result.rows.length === 0 ){
                    return res.status(404).json({message: `No products found in price range ${minPrice} - ${maxPrice}`});
                }
                return res.json(result.rows);
            }catch(err){
                console.log(err);
                return res.status(500).json({message: `unable to fetch products price range ${minPrice} - ${maxPrice}`});
            }
        }
        

    } catch (err) {
        res.status(500).json({message:'unable to search the products'});

    }

})

app.get('/', (req,res) =>{
    res.send('Hello World!');
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});
