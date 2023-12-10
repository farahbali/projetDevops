const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line
const { MongoClient, ObjectID, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
app.use(cors()); // Add this line
const mongoUrl = 'mongodb+srv://farahBALI:FARAh.260@cluster0.bvk73ov.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'bookstore';
const collectionName = 'books';

app.use(bodyParser.json());

// Connect to MongoDB
let db;

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        db = client.db(dbName);

        // Create
        app.post('/api/books', async (req, res) => {
            const { title, author, year } = req.body;
            const collection = db.collection(collectionName);

            try {
                const result = await collection.insertOne({ title, author, year });
                console.log('book created', result)
                res.status(200).json(result)
            } catch (err) {
                console.error(err);
                res.status(500).send('Error creating book');
            }
        });

        // Read
        app.get('/api/books', async (req, res) => {
            const collection = db.collection(collectionName);

            try {
                const books = await collection.find({}).toArray();
                res.json(books);
            } catch (err) {
                console.error(err);
                res.status(500).send('Error retrieving books');
            }
        });

        // Update
        app.put('/api/books/:id', async (req, res) => {
            const bookId = req.params.id;
            const { title, author, year } = req.body;
            const collection = db.collection(collectionName);

            try {
                const result = await collection.updateOne(
                    { _id: new ObjectId(bookId) },
                    { $set: { title, author, year } }
                );
                console.log('Book updated:', result);
                res.sendStatus(200);
            } catch (err) {
                console.error(err);
                res.status(500).send('Error updating book');
            }
        });


        // Delete
        app.delete('/api/books/:id', async (req, res) => {
            const bookId = req.params.id;
            const collection = db.collection(collectionName);

            try {
                const result = await collection.deleteOne({ _id: new ObjectId(bookId) });
                console.log('Book deleted:', result);
                res.sendStatus(200);
            } catch (err) {
                console.error(err);
                res.status(500).send('Error deleting book');
            }
        });
        // Get a single book by ID
        app.get('/api/books/:id', async (req, res) => {
            const bookId = req.params.id;
            const collection = db.collection(collectionName);

            try {
                const book = await collection.findOne({ _id: new ObjectId(bookId) });

                if (!book) {
                    res.status(404).send('Book not found');
                    return;
                }

                res.json(book);
            } catch (err) {
                console.error(err);
                res.status(500).send('Error retrieving book');
            }
        });


        // Start the server only after connecting to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
