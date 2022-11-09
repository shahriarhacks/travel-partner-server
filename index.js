const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.whzqc0b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const servicesCollection = client
      .db("TravelPartner")
      .collection("packages");

    app.get("/home/packages", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      res.send(cursor);
      const services = await cursor.limit(3).toArray();
    });

    app.get("/packages", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const packages = await cursor.toArray();
      res.send(packages);
    });

    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const package = await servicesCollection.findOne(query);
      console.log(package);
      res.send(package);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Server is ready for fight");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
