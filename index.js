const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mogodb-practice.uoisaxb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// API
app.get("/", (req, res) => {
    res.send("My Portfolio Server Is Running...")
})

async function dataBase() {
    try {
        const projectCollection = client.db("my-portfolio").collection("my-projects");
        app.get("/my-projects", async (req, res) => {
            const perPageProduct = parseInt(req.query.perPageProduct);
            const currentPage = parseInt(req.query.currentPage);
            const skipProducts = currentPage * perPageProduct;

            const query = {}
            const result = projectCollection.find(query);
            const projects = await result.skip(skipProducts).limit(perPageProduct).toArray();
            res.send(projects);
        })


        app.get("/my-project/:_id", async (req, res) => {
            const id = req.params._id;
            const query = { _id: ObjectId(id) }
            const project = await projectCollection.findOne(query);
            res.send(project)
        })

    }
    catch (err) {
        console.log(err);
    }
}

dataBase().catch(err => console.log(err))



// Listen
app.listen(port, () => {
    console.log(`Server Is Running On ${port}`);
})