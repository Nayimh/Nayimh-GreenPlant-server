const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");

require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cetyr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tree');
        const treeCollection = database.collection('bonsai');
        const orderCollection = database.collection('order');

        // post data to db from ui
        app.post('/bonsai', async (req, res) => {
            const cursor = req.body;
            const result = await treeCollection.insertOne(cursor);
            res.send(result);
        })

        // get data from mongo and render in ui
        app.get('/bonsai', async (req, res) => {
            const cursor = treeCollection.find({});
            const tree = await cursor.toArray();
            res.send(tree);
        })

        // post order from ui to db
        app.post('/order', async (req, res) => {
            const cursor = req.body;
            const result = await treeCollection.insertOne(cursor);
            res.send(result);
        })

        // get order from db to ui
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })

    }
    finally {
       
        // await client.close();
      }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('my node is successfully running...')
})


app.listen(port, () => {
    console.log('listning to port', port);
})