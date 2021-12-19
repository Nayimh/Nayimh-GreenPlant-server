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
        const usersCollection = database.collection('users');

        // post data to db from ui
        app.post('/bonsai', async (req, res) => {
            const cursor = req.body;
            const result = await treeCollection.insertOne(cursor);
            res.json(result);
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
            res.json(result);
        })

        // get order from db to ui
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const order = await cursor.toArray();
            res.send(order);
        })


              // Orders API with Email - GET
    app.get("/order/:email", async (req, res) => {
        const email = req.params.email;
        const cursor = orderCollection.find({});
        const orders = await cursor.toArray();
        const customerOrder = orders.filter((mail) => mail.email === email);
        res.send(customerOrder);
    });



                  // user collection api start
        // post user from ui to db
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })
        // upsert user api
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const option = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, option);
            res.json(result);
        })
        // make admin user api
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        // admin filtering
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({admin: isAdmin})
        })

    }
    finally {
       
        // await client.close();
      }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('my node is successfully running.')
})


app.listen(port, () => {
    console.log('listning to port', port);
})