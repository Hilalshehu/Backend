const {mongoClient} = require('mongodb');

//mongoClient.connect('', (err, db) => {})
var db;
try {
    const client = new MongoClient("mongodb+srv://hilalw:HIlal1234@cluster0.zv5tubv.mongodb.net/BackendTest");
    db = client.db("BackendTest");
    console.log("Connected to database.");
  } catch {
    console.log("Failed to connect to database.");
  }
 module.exports = db;
