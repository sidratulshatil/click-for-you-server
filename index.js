const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion } = require('mongodb');
// Middleware
app.use(cors())
app.use(express.json())
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xwh8ees.mongodb.net/?retryWrites=true&w=majority`
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('photography').collection('services')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)

        })

    }
    finally {

    }

}
run().catch(err => console.log(err))

app.use('/', (req, res) => {
    res.send('click for you server is running')
})
app.listen(port, () => {
    console.log(`click for you server run on port ${port}`)
})