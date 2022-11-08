const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())


app.use('/', (req, res) => {
    res.send('click for you server is running')
})
app.listen(port, () => {
    console.log(`click for you server run on port ${port}`)
})