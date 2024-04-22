const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
//
//
console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vl4b2tk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db('coffeeDB').collection('coffee')
    app.post('/coffee',async(req,res)=>{
        const addCoffee = req.body
        console.log(addCoffee)
        const result = await database.insertOne(addCoffee)
        res.send(result)
    })

    app.get('/coffee',async(req,res)=>{
        const cursor = database.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/coffee/:id',async(req,res)=>{
      const update = req.params.id
      const query = {_id:new ObjectId(update)}
      const result = await database.findOne(query)
      res.send(result)
    })
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await database.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Coffe Shop')
})

app.listen(port,()=>{
    console.log(`Coffe shop server is running:${port}`)
})