// handler.js
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { ServerApiVersion } = require('mongodb');
const ObjectID = require("mongodb").ObjectId;


// Configure DB Properties
let db;
let ownersCollection;

const credentials = process.env.CERT_FILE_PATH;
const mongoConnStr = process.env.DB_URI;
const client = new MongoClient(mongoConnStr, {
    tlsCertificateKeyFile: credentials,
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true
    }
});
const createConn = async () => {
    await client.connect();
    db = client.db(process.env.DB);
    ownersCollection = db.collection(process.env.COLLECTION);
};
const closeConn = async () => {
    await client.close();
}

// Configuring middleware
const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

/**
 *  Get All Owner Details
 *  /owners?page=x&limit=xx
 */
app.get('/owners', async function (req, res) {
    //Initializing connection
    await createConn();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    try {
        const totalCount = await ownersCollection.countDocuments();
        const owners = await ownersCollection.find().skip(skip).limit(limit).toArray();
        const result = {
            page: page,
            limit: limit,
            skip: skip,
            totalCount: totalCount,
            owners: owners
        }
        return res.json(result);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    } finally {
        await closeConn()
    }
});

/**
 *  Get Certain user using ID
 *  /owner/xxxxxxxxxxxxxxx
 */
app.get('/owner/:id', async function(req, res) {
    //Initializing connection
    await createConn();

    const ownerId = req.params.id;
    if (!ownerId) {
        return res.status(400).json({ error: `No owner ID found or invalid owner Id` });
    }

    try {
        const owner = await ownersCollection.findOne({ _id: new ObjectID(ownerId) });
        if (owner) {
            return res.json(owner);
        }
        return res.status(404).json({ error: `No owner found on the given ID of : ${ownerId}`});
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    } finally {
        await closeConn()
    }
});

/**
 *  Delete Certain user using ID
 *  /owner/xxxxxxxxxxxxxxx
 */
app.delete('/owner/:id', async function(req, res) {
    //Initializing connection
    await createConn();

    const ownerId = req.params.id;
    if (!ownerId) {
        return res.status(400).json({ error: `No owner ID found or invalid owner Id` });
    }

    try {
        console.log(ownerId)
        const deletedOwner = await ownersCollection.deleteOne({ _id: new ObjectID(ownerId) });
        if (deletedOwner.deletedCount > 0) {
            return res.json(deletedOwner);
        }
        res.status(404).json({ error: `No owner found on the given ID of : ${ownerId}`});
    } catch (e) {
        console.log(e);
        return res.status(500).json({ error: e.message });
    } finally {
        await closeConn()
    }
});

/**
 *  Create a new owner
 */
app.post('/owner', async function(req, res) {
    //Initializing connection
    await createConn();

    try {
       const {name, phone, title, car } = req.body;
       if (!name || !phone || !title || !car) {
        return res.status(400).json({ error: `One of required parameters are missing, Please enter Title, Name Phone and Car`});
       };

       const newOwnerDetail = await ownersCollection.insertOne({title, name, phone, car});
       if (newOwnerDetail) {
        return res.json(newOwnerDetail);
       }
       return res.status(500).json({ error: `Failed to create new owner details with given payload` });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    } finally {
        await closeConn()
    }
});

module.exports = {
    app,
    owners: serverless(app),
    owner: serverless(app),
};