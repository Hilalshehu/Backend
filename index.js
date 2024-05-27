const express = require('express');


const app = express();
// var app = express();


app.use(express.json())

//mongoose.connect('mongodb+srv://hilalw:HIlal1234@cluster0.zv5tubv.mongodb.net/Backend')


try {
    const lessonsRouter = require('./routes/lessons');
    app.use("/lessons", lessonsRouter);
  
    const ordersRouter = require('./routes/orders');
    app.use("/orders", ordersRouter);
  } catch (error) {
    console.error("Error loading routes:", error);
  }
  
app.listen(5000, () => {
console.log("server is Running")
})