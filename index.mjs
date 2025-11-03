// npm init -y

// Open Terminal Window
// Create a new folder (mkdir myNodeApp)
// Go inside the folder (cd myNodeApp)
// Initialize node app by running:
//  npm init
// It will create the package.json file.
// Optionally, you can run: npm init -y 
// (silent mode)


// Create an index.mjs file. Add some JS code.
// Run the file by using:
// node index.mjs

// npm i express ejs mysql2



import express from 'express';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';
import { mealApi } from 'meal-api';
//https://www.npmjs.com/package/meal-api

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
// const pool = mysql.createPool({
//     host: "jsftj8ez0cevjz8v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
//     user: "rq63ro5rtenc2twm",
//     password: "y7mdpsql6fhn9lrp",
//     database: "x6ij0hyll3qwgfjk",
//     connectionLimit: 10,
//     waitForConnections: true
// });

const fetchMeal = async () => {
  try {
    const data = await mealApi("cake");
    console.log(data);
  } catch (error) {
    console.error("Error fetching meal data:", error);
  }
};


app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

//routes
app.get('/', async (req, res) => {
    //res.send('Hello Express app!')
    // let authorSql =  `SELECT authorId, firstName, lastName FROM authors`;   //temperal literal
    // const [authorRows] = await pool.query(authorSql);
    // console.log(authorRows);

    // let categorySql =  `SELECT DISTINCT(category) FROM quotes;`;
    // const [cRows] = await pool.query(categorySql);
    let searchResponse = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    let searchData =  await searchResponse.json();

    console.log(searchData);
    res.render('home.ejs',{searchData});
    
});

app.get("/searchByKeyword", async(req, res) => {
    // Search meal by name
    // www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata

    console.log(req);
    let keyword = req.query.keyword;
    // if(!keyword){
    //     let searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    // }else{
    //     let searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + keyword;
    // }
    // let searchUrl = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + keyword;
    // let searchResponse = await fetch(searchUrl);
    // let searchData = await searchResponse.json();
    let searchData = await mealApi(keyword);
    console.log(searchData);

    res.render('search.ejs',{searchData});
});//searchByKeyword
app.get("/details", async(req, res) => {
    //Lookup full meal details by id
    //www.themealdb.com/api/json/v1/1/lookup.php?i=52772
    let searchUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + req.query.id;
    let searchResponse = await fetch(searchUrl);
    let searchData = await searchResponse.json();
    console.log(searchData);
    res.render('details.ejs',{searchData});
});//details

app.get("/searchByCategory", async(req, res) => {
    // List all meal categories
    // www.themealdb.com/api/json/v1/1/categories.php
    let searchUrl = "https://www.themealdb.com/api/json/v1/1/categories.php";
    let searchResponse = await fetch(searchUrl);
    let searchData = await searchResponse.json();
    console.log(searchData);
    res.render('category.ejs',{searchData});
});//searchByCategory






//local API to get all info for a specific author
// app.get('/api/authors/:authorId', async (req, res) => {
//     let authorId = req.params.authorId;
//     let sql =  `SELECT *
//                 FROM authors
//                 WHERE authorId = ?`;
//     const [rows] = await pool.query(sql, [authorId]);
//     res.send(rows);
// });

app.listen(3000, ()=>{
    console.log("Express server running")
})