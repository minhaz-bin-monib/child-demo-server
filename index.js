const express = require('express');
const cors = require('cors');
const pdf = require('html-pdf');
const bodyParser = require('body-parser');
const pdfTemplate = require('./documents');
const { MongoClient, ObjectId } = require('mongodb');
const SSLCommerzPayment = require('sslcommerz-lts')
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// user: dummyuser
// password: ExFGMzfCCY2aJPsV

const store_id = 'child64ea15329326a';
const store_passwd = 'child64ea15329326a@ssl';
const is_live = false //true for live, false for sandbox




const uri = "mongodb+srv://dummyuser:ExFGMzfCCY2aJPsV@cluster0.gaxjy.mongodb.net/?retryWrites=true&w=majority";

// Create a new MongoClient
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




async function run() {
    try {

        const userCollection = client.db('nodeMongoCrud').collection('users');
        const serviceCollection = client.db('nodeMongoCrud').collection('services');
        const subscribersCollection = client.db('nodeMongoCrud').collection('subscribers');
        const enquiryCollection = client.db('nodeMongoCrud').collection('enquiry');
        const enrollmentCollection = client.db('nodeMongoCrud').collection('enrollment');
        const aboutUSCollection = client.db('nodeMongoCrud').collection('AboutUs');
        const paymentCollection = client.db('nodeMongoCrud').collection('payment');
        const contactUsCollection = client.db('nodeMongoCrud').collection('ContactUs');



        // ************************************* PDF Generate ******************
        app.post('/create-pdf', (req, res) => {
            pdf.create(pdfTemplate(req.body), {}).toFile('result.pdf', (err) => {
                if (err) {
                    res.send(Promise.reject());
                }

                res.send(Promise.resolve());
            });
        });

        app.get('/fetch-pdf', (req, res) => {

            res.sendFile(`${__dirname}/result.pdf`)
        })



        // ************************* Babysitter backend *******************
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result);
        });

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateUser = req.body;
            const eUser = {

                $set: {
                    name: updateUser.name,
                    address: updateUser.address,
                    email: updateUser.email,
                    imageURL: updateUser.imageURL
                }
            }

            const result = await userCollection.updateOne(filter, eUser, options);
            res.send(result);

        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user)
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            //console.log('trying to delete',id);
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })








        // ************************* Services backend *******************
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.post('/services', async (req, res) => {
            const services = req.body;
            console.log(services);
            const result = await serviceCollection.insertOne(services)
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateUser = req.body;
            console.log(updateUser);
            const eUser = {

                $set: {
                    service_name: updateUser.service_name,
                    service_details: updateUser.service_details,
                    currentDate: updateUser.currentDate

                }
            }

            const result = await serviceCollection.updateOne(filter, eUser, options);
            res.send(result);

        });

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            //console.log('trying to delete',id);
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })



        // ************************* Payment backend *******************
        app.get('/payment', async (req, res) => {
            const query = {};
            const cursor = paymentCollection.find(query);
            const payment = await cursor.toArray();
            res.send(payment);
        });

        app.post('/payment', async (req, res) => {
            const payment = req.body;
            console.log(payment);
            const result = await paymentCollection.insertOne(payment);



            const data = {
                total_amount: 100,
                currency: 'BDT',
                tran_id: 'REF123', // use unique tran_id for each api call
                success_url: `http://localhost:5000/paySuccess/`+payment.p_enroll,
                fail_url: 'http://localhost:3030/fail',
                cancel_url: 'http://localhost:3030/cancel',
                ipn_url: 'http://localhost:3030/ipn',
                shipping_method: 'Courier',
                product_name: 'Computer.',
                product_category: 'Electronic',
                product_profile: 'general',
                cus_name: 'Customer Name',
                cus_email: 'customer@example.com',
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: '01711111111',
                ship_name: 'Customer Name',
                ship_add1: 'Dhaka',
                ship_add2: 'Dhaka',
                ship_city: 'Dhaka',
                ship_state: 'Dhaka',
                ship_postcode: 1000,
                ship_country: 'Bangladesh',
            };
            const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
            sslcz.init(data).then(apiResponse => {
                // Redirect the user to payment gateway
                let GatewayPageURL = apiResponse.GatewayPageURL
                res.send({url: GatewayPageURL})
                console.log('Redirecting to: ', GatewayPageURL)
            });
        })


        app.post('/paySuccess/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateUser = req.body;
            console.log(updateUser);
            const eUser = {

                $set: {
                    paymentStatus: "paid"

                }
            }

            const result = await enrollmentCollection.updateOne(filter, eUser, options);
            res.send("Thank you for your Payment");


        })



        // ************************* Subcribers backend *******************
        app.get('/subscribers', async (req, res) => {
            const query = {};
            const cursor = subscribersCollection.find(query);
            const subscribers = await cursor.toArray();
            res.send(subscribers);
        });

        app.post('/subscribers', async (req, res) => {
            let subscribers = req.body;
            console.log(subscribers);
            const result = await subscribersCollection.insertOne(subscribers)
            console.log(result);
            res.send(result);

        })


        // ************************* Enrollment backend *******************
        app.get('/enrollment', async (req, res) => {
            const query = {};
            const cursor = enrollmentCollection.find(query);
            const enrollment = await cursor.toArray();
            res.send(enrollment);
        });

        app.post('/enrollment', async (req, res) => {
            let enrollment = req.body;
            console.log(enrollment);
            const result = await enrollmentCollection.insertOne(enrollment)
            console.log(result);
            res.send(result);

        });

        app.get('/enrollment/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await enrollmentCollection.findOne(query);
            res.send(result);
        });

        app.put('/enrollment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = req.body;
            const eUser = {

                $set: {
                    status: update.status,
                    paymentStatus: update.paymentStatus

                }
            }

            const result = await enrollmentCollection.updateOne(filter, eUser, options);
            res.send(result);

        });





        // ************************* enquiry backend *******************
        app.get('/enquiry', async (req, res) => {
            const query = {};
            const cursor = enquiryCollection.find(query);
            const enquiry = await cursor.toArray();
            res.send(enquiry);
        });

        app.post('/enquiry', async (req, res) => {
            let enquiry = req.body;
            console.log(enquiry);
            const result = await enquiryCollection.insertOne(enquiry)
            console.log(result);
            res.send(result);

        })

        app.get("/enquiry/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await enquiryCollection.findOne(query);
            res.send(result);
        });


        app.put('/enquiry/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const update = req.body;
            const eUser = {

                $set: {
                    status: update.status,
                }
            }

            const result = await enquiryCollection.updateOne(filter, eUser, options);
            res.send(result);

        });



        // ************************* AboutUs backend *******************
        app.get('/aboutUs', async (req, res) => {
            const query = {};
            const cursor = aboutUSCollection.find(query);
            const aboutUs = await cursor.toArray();
            res.send(aboutUs);
        });

        app.post('/aboutUs', async (req, res) => {
            const aboutUs = req.body;
            console.log(aboutUs);
            const result = await aboutUSCollection.insertOne(aboutUs)
            res.send(result);
        })


        // ************************* ContactUs backend *******************
        app.get('/contactUs', async (req, res) => {
            const query = {};
            const cursor = contactUsCollection.find(query);
            const contactUs = await cursor.toArray();
            res.send(contactUs);
        });

        app.post('/contactUs', async (req, res) => {
            const contactUs = req.body;
            console.log(contactUs);
            const result = await contactUsCollection.insertOne(contactUs)
            res.send(result);
        })


        





    }

    finally {

    }

}

run().catch(err => console.log(err));




app.get('/', (req, res) => {
    res.send('Hello from node mongo and crud');
});



app.listen(port, () => {
    console.log(`Simple node server running on port ${port}`);
})