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