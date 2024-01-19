const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// Allow requests from these origins
const allowedOrigins = ['https://project-12-9f3fd.web.app', 'http://localhost:5173/quiz'];

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());


const uri = "mongodb+srv://LanguageLearning:rFFhcEmOVxZKM9wN@cluster0.vfr78tp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();

        const languageLearningCollection = client.db('LanguageLearningDB').collection('languageLearning')

        app.post('/api/language-learning', async (req, res) => {
            const question = req.body
            const result = await languageLearningCollection.insertOne({ question });

            res.send(result);
        })

        app.get('/api/:language', async (req, res) => {
            const language = req.params.language;

            // get question base on
            const query = { language: language };
            const result = await languageLearningCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/api/:language/:category', async (req, res) => {
            const language = req.params.language;
            const category = req.params.category;

            const query = { language: language, category: category };
            const result = await languageLearningCollection.find(query).toArray();

            res.send(result);
        });


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        await connectToMongoDB();
    } finally {
        // await client.close(); // Uncomment this line to close the MongoDB client
    }
}

async function connectToMongoDB() {
    try {
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('App is running');
});

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});
