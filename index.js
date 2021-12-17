const express = require('express')
const app = express();
const cors = require('cors')
const { MongoClient } = require("mongodb");

require('dotenv').config()

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
        const treeCollection = database.collection('bonsai')

        
        app.post('/bonsai', async (req, res) => {
           
           
        })

        app.get('/bonsai', async (req, res) => {
            const cursor = treeCollection.find({});
            const tree = await cursor.toArray();
            res.send(tree);
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