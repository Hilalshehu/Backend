var express = require("express");
var db = require("db");

var lessons = express.Router()

lessons.get("/", async function (req, res) {
    var fields = ["title", "subject", "location"];
    var search = req.query.search;
    var sort = req.query.sort || fields[0];
    var order = req.query.order == "desc" ? -1 : 1;
  
    if (search) {
      search = {
        $or: fields.map((field) => ({
          [field]: { $regex: search, $options: "i" },
        })),
      };
    } else {
      search = {};
    }
  
    var lessons = await db
      .collection("lessons")
      .find(search)
      .sort({ [sort]: order })
      .toArray();
  
    res.send(lessons);
  });
  
  module.exports = lessons;
  