const express= require('express');
const cors =require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port= process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//mongodb connect
console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtjderw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const serviceCollection=client.db('carsDoctor').collection('services');
    const bokkingCollection=client.db('carsDoctor').collection('bookings');
    //services
    //sob data paoyar jonno
    app.get('/services', async(req, res)=>{
        const cursor=serviceCollection.find();
        const result= await cursor.toArray();
        res.send(result)
    })
    // single data paoyar jono
    app.get('/services/:id', async(req, res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)};

        const options = {
           
            // Include only the `title` and `imdb` fields in the returned document
            projection: { title: 1, price: 1,service_id:1 ,img:1},
          };

        const result = await serviceCollection.findOne(query, options);
        res.send(result);
    })
    //bookings
    //sob bokking paoyar jonno
    app.get('/bookings', async(req, res)=>{
        console.log(req.query)
        let query={};
        if(req.query?.email){
            query={email: req.query.email}
        }
        const cursor= await bokkingCollection.find(query).toArray();
        res.send(cursor)
    })
    //data create er jonno
    app.post('/bookings', async(req, res)=>{
        const booking= req.body;
        console.log(booking)
        const result= await bokkingCollection.insertOne(booking);
        res.send(result)
    })
    //data update kora jonno
    app.patch('/bookings/:id', async(req, res)=>{
        const id= req.params.id;
        const filter={_id: new ObjectId(id)}
        const updatedBooking= req.body;
        console.log(updatedBooking);
        const updateDoc = {
            $set: {
              status: updatedBooking.status
            },
          };
          const result = await bokkingCollection.updateOne(filter, updateDoc);
          res.send(result)
    })
    //delete korar jonno
    app.delete('/bookings/:id', async(req, res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)};
        const result= await bokkingCollection.deleteOne(query);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('doctor is running')
})

app.listen(port, ()=>{
    console.log(`Car doctor is running ${port}`)

})