const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://hilalw:HIlal1234@cluster0.zv5tubv.mongodb.net/Backend')


app.get("/", (req, res) => {

})
app.listen(2000, () => {
console.log("server is Running")
})