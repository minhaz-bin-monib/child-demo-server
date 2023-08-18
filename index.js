const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// user: dummyuser
// password: ExFGMzfCCY2aJPsV




const uri = "mongodb+srv://dummyuser:ExFGMzfCCY2aJPsV@cluster0.gaxjy.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});




async function run(){
    try{

        const userCollection = client.db('nodeMongoCrud').collection('users');
        const serviceCollection = client.db('nodeMongoCrud').collection('services');
        const subscribersCollection = client.db('nodeMongoCrud').collection('subscribers'); 



        // ************************* Babysitter backend *******************
        app.get('/users', async(req, res) =>{
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.put('/users/:id', async(req, res) =>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updateUser = req.body;
            const eUser = {

                $set: {
                    name : updateUser.name,
                    address : updateUser.address,
                    email : updateUser.email,
                    imageURL : updateUser.imageURL
                }
            }

            const result = await userCollection.updateOne(filter, eUser, options);
            res.send(result);
            
        });

        app.post('/users', async(req,res) =>{
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        app.delete('/users/:id', async(req,res) =>{
            const id = req.params.id;
            //console.log('trying to delete',id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })








    // ************************* Services backend *******************
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async(req,res) =>{
            const services = req.body;
            console.log(services);
            const result = await serviceCollection.insertOne(services)
            res.send(result);
        })




        // ************************* Subcribers backend *******************
        app.get('/subscribers', async(req, res) =>{
            const query = {};
            const cursor = subscribersCollection.find(query);
            const subscribers = await cursor.toArray();
            res.send(subscribers);
        });

        app.post('/subscribers', async(req,res) =>{
            const subscribers = req.body;
            console.log(subscribers);
            const result = await serviceCollection.insertOne(subscribers)
            res.send(result);
        })

    }

    finally{

    }

}

run().catch(err => console.log(err));




app.get('/',(req,res) =>{
    res.send('Hello from node mongo and crud');
});



app.listen(port, () =>{
    console.log(`Simple node server running on port ${port}`);
})