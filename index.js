const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is ready for fight");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
