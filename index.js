
const express = require("express")
const mongoose = require("mongoose")
const dotEnv = require("dotenv")
const bodyParser = require("body-parser")
const vendorRoutes = require("./routes/vendorRoutes")
const firmRoutes = require("./routes/firmRoutes")
const productRoutes = require("./routes/productRoutes")
const cors = require("cors")
const path = require('path')


const app = express()

const port = process.env.port || 8000;

dotEnv.config()
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB Connected Successfully")
    }) 
    .catch((error) => {
    console.log("There is an error : ", error)
    })


app.use(bodyParser.json())
app.use(express.json())


app.use('/vendor', vendorRoutes)    
app.use('/firm', firmRoutes)
app.use('/product',productRoutes)
app.use('/uploads', express.static('uploads'))


app.listen(port, () => {
    console.log(`Server started and running successfully at port ${port}`)
})

app.use('/', (req,res) => {
    res.send('Welcome to EatBuddy')
})

