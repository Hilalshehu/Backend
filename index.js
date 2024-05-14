
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db'); // Import the database connection function

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and start the server
connectToDatabase().then(() => {
  // Routes
  const lessonsRouter = require('./routes/lessons');
  app.use("/lessons", lessonsRouter);

  const ordersRouter = require('./routes/orders');
  app.use("/orders", ordersRouter);

  // Default route
  app.get("/", (req, res) => {
    res.send("This is very hard");
  });

  // Start the server
  app.listen(5000, () => {
    console.log("Server is running on port 5000");
  });
}).catch((error) => {
  console.error("Failed to start server", error);
});