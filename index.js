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

    const reviewsCollection = client.db("TravelPartner").collection("reviews");
    const blogCollection = client.db("TravelPartner").collection("blog");

    //Blog Section
    app.get("/blog", async (req, res) => {
      const query = {};
      const cursor = blogCollection.find(query);
      const blog = await cursor.toArray();
      res.send(blog);
    });

    //Home Page Limited Data
    app.get("/home/packages", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //Packages or Services Section
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
      res.send(package);
    });

    app.post("/packages", async (req, res) => {
      const data = req.body;
      const result = await servicesCollection.insertOne(data);
      res.send(result);
    });

    //Reviews Section
    app.get("/reviews", async (req, res) => {
      const query = {};
      const options = {
        sort: { time: -1 },
      };
      const cursor = reviewsCollection.find(query, options);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewsCollection.findOne(query);
      res.send(review);
    });

    app.get("/review", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const options = {
        sort: { time: -1 },
      };
      const cursor = reviewsCollection.find(query, options);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    app.put("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updatedReview = {
        $set: {
          message: data.message,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updatedReview,
        option
      );
      res.send(result);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
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
