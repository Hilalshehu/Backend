// Import dependencies modules:
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Create an Express.js instance:
const app = express();

// Config Express.js
app.use(express.json());
app.set('port', 4000);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// Connect to MongoDB
let db;
MongoClient.connect('mongodb+srv://hilalw:HIlal1234@cluster0.zv5tubv.mongodb.net/', (err, client) => {
  if (err) throw err;
  db = client.db('Backend');
  app.listen(app.get('port'), () => {
    console.log('Express.js server running at localhost:4000');
  });
});

// Define routes
app.get('/', (req, res, next) => {
  res.send('Select a collection, e.g., /collection/messages');
});

app.param('collectionName', (req, res, next, collectionName) => {
  req.collection = db.collection(collectionName);
  return next();
});

app.get('/collection/:collectionName', (req, res, next) => {
  const { search, searchField, sort } = req.query;
  let query = {};
  let sortOrder = {};

  if (search && searchField) {
    query[searchField] = { $regex: new RegExp(search, 'i') };
  }

  if (sort) {
    const sortField = searchField || 'title'; // Default sorting by title
    sortOrder[sortField] = sort === 'asc' ? 1 : -1;
  }

  req.collection.find(query).sort(sortOrder).toArray((e, results) => {
    if (e) return next(e);
    res.send(results);
  });
});

app.post('/collection/:collectionName', (req, res, next) => {
  req.collection.insert(req.body, (e, results) => {
    if (e) return next(e);
    res.send(results.ops);
  });
});

app.get('/collection/:collectionName/:id', (req, res, next) => {
  req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
    if (e) return next(e);
    res.send(result);
  });
});

app.put('/collection/:collectionName/:id', (req, res, next) => {
  req.collection.update(
    { _id: new ObjectID(req.params.id) },
    { $set: req.body },
    { safe: true, multi: false },
    (e, result) => {
      if (e) return next(e);
      res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' });
    }
  );
});

app.delete('/collection/:collectionName/:id', (req, res, next) => {
  req.collection.deleteOne(
    { _id: ObjectID(req.params.id) }, (e, result) => {
      if (e) return next(e);
      res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' });
    }
  );
});

// Existing product update endpoint (modified)
app.put('/collection/products/:id', async (req, res, next) => {
  const { decrement } = req.body;
  const productId = req.params.id;

  try {
    const result = await req.collection.findOneAndUpdate(
      { _id: new ObjectID(productId) },
      { $inc: { spaces: -decrement } },
      { returnOriginal: false }
    );

    if (!result.value) {
      return res.status(404).send({ message: 'Product not found' });
    }

    res.send(result.value);
  } catch (error) {
    next(error);
  }
});

// New endpoint for optimistic locking (optional)
app.get('/collection/products/:id/with-lock', async (req, res, next) => {
  const { decrement, version } = req.body;
  const productId = req.params.id;

  try {
    const result = await req.collection.findOneAndUpdate(
      { _id: new ObjectID(productId), version },
      { $inc: { spaces: -decrement }, $set: { version: version + 1 } },
      { returnOriginal: false }
    );

    if (!result.value) {
      return res.status(409).send({ message: 'Conflict: Product version mismatch' });
    }

    res.send(result.value);
  } catch (error) {
    next(error);
  }
});

// Insert the new endpoint for handling orders here
app.post('/collection/orders', async (req, res, next) => {
  const { lessons, username, phonenumber } = req.body;

  try {
    // Insert order into orders collection
    const orderResult = await db.collection('orders').insertOne({ lessons, username, phonenumber });

    // Update lesson spaces
    const lessonUpdates = lessons.map(lesson =>
      db.collection('products').updateOne(
        { _id: new ObjectID(lesson.id) },
        { $inc: { spaces: -lesson.quantity } }
      )
    );

    await Promise.all(lessonUpdates);

    res.send(orderResult.ops[0]);
  } catch (error) {
    next(error);
  }
});
