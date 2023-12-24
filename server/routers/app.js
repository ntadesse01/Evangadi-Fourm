const express = require('express');
const app = express();
const port = 5500;

// db connection
const dbConnection = require("../db/dbConfig");

// User routes middleware file
const userRoutes = require("./routers/userRoute");
// questions routers middleware

const questionsRoutes= require("./routers/questionsRoutes");
//authonthication middleware
const authMiddleware = require('../middleware/authMiddleware');



//json middleware to eract json data 
app.use(express.json())
// User routes middleware
app.use("/api/users", userRoutes);

// questions routers middleware
// Add your questions routes middleware here
app.use("/api/questions",authMiddleware.questionsRoutes);

// answers routers middleware
// Add your answers routes middleware here

async function start() {
  try {
    await dbConnection.execute("SELECT 'test'");
    await app.listen(port);
    console.log(`Listening on port ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();