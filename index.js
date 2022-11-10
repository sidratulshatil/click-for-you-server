const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// Middleware
app.use(cors())
app.use(express.json())
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xwh8ees.mongodb.net/?retryWrites=true&w=majority`
console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log(authHeader)
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}
async function run() {
    try {
        const serviceCollection = client.db('photography').collection('services')
        const reviewCollection = client.db('photography').collection('review')

        app.post('/jwt', (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
            // console.log(token)
            res.send({ token })
        })

        app.get('/services3', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services.reverse())

        })
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services.reverse())

        })
        // app.get('/review', async (req, res) => {
        //     const query = {}
        //     const cursor = reviewCollection.find(query)
        //     const services = await cursor.toArray()
        //     res.send(services.reverse())

        // })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)

            res.send(service)
        })
        app.post('/review', async (req, res) => {
            const review = req.body
            const result = await reviewCollection.insertOne(review)
            res.send(result)
        })

        app.get('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const service = await reviewCollection.findOne(query)

            res.send(service)
        })
        app.put('/review/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            console.log(user)
            const updatedUser = {
                $set: {
                    comment: user.comment
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser)
            res.send(result)
        })

        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await serviceCollection.insertOne(service)
            res.send(result)
        })

        app.get('/review', verifyJWT, async (req, res) => {
            // const decoded = req.decoded
            // console.log("1", req.query.reviewId)
            // console.log("2", req.query.email)
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'unauthorized access' })
            // }
            let query = {}

            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews.reverse())
        })
        app.get('/review2', async (req, res) => {
            // const decoded = req.decoded
            // console.log("1", req.query.reviewId)
            // console.log("2", req.query.email)
            // if (decoded.email !== req.query.email) {
            //     res.status(403).send({ message: 'unauthorized access' })
            // }
            let query = {}
            if (req.query.reviewId) {
                query = {
                    reviewId: req.query.reviewId
                }
            }

            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews.reverse())
        })
        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
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