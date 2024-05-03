var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const { MongoClient } = require("mongodb");
//MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms319";
const client = new MongoClient(url);
const db = client.db(dbName);

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
})

app.get("/Cards/:id", async (req, res) => {
    const range = Number(req.params.id);
    await client.connect();

    console.log("Node successfully connected to GET Mongodb");

    const query = { "id": {$gt: range}};

    const results = await db
        .collection("Mtg")
        .find(query)
        .limit(20)
        .toArray();

    console.log(results);
    res.status(200);
    res.send(results);
});

app.post("/Deck", async (req, res) => {

    console.log("Recieved item:", req.body);
    try
    {
        
        await client.connect();
        const newDocument = {
            "colors": req.body.colors,
            "identifiers": req.body.identifiers,
            "id": req.body.id
        };
        console.log(newDocument);

        const results = await db
        .collection("Deck")
        .insertOne(newDocument);

        res.status(200);
        res.send(results);
    }
    catch (error)
    {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
});

app.delete("/Deck/:id", async (req, res) => {
    try {
    const id = Number(req.params.id);
    await client.connect();
    console.log("Store item to delete :", id);
    const query = { "id": id };
    // delete
    const itemDeleted = await db.collection("Deck").deleteOne(query);
    res.status(200);
    res.send(itemDeleted);
    }
    catch (error){
    console.error("Error deleting item:", error);
    res.status(500).send({ message: 'Internal Server Error' });
    }
});