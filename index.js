const express = require('express');
const mongoose = require('mongoose');


const app = express();
var cors = require('cors')
// var app = express();

app.use(cors())
app.use(express.json())

//mongoose.connect('mongodb+srv://hilalw:HIlal1234@cluster0.zv5tubv.mongodb.net/Backend')


app.get("/", (req, res) => {

    var lessonsRouter = require('./routes/lessons')
app.use("/lessons", lessonsRouter)

var ordersRouter = require('./routes/orders')
app.use("/orders", ordersRouter)

})
app.listen(4000, () => {
console.log("server is Running")
})