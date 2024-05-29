// var express = require("express");
// var db = require("db");
// var { ObjectId } = require("mongodb");

// var orders = express.Router();
// orders.post("/", function (req, res) {
//   var order = req.body;
//   db.collection("orders").insertOne(order);
//   order.lessons.forEach((lesson) => {
//     var amount = lesson.amount;
//     var id = new ObjectId(lesson.lesson._id);
//     db.collection("lessons").updateOne(
//       { _id: id },
//       { $inc: { spaces: -amount } }
//     );
//   });
//   console.log(order + "executed");
// });

// module.exports = orders;
