const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wiiut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run(){
     try{
        await client.connect();
        const productCollection =client.db('car_tools').collection('products');
        const orderCollection = client.db('car_tools').collection('order');


        app.get('/order', async(req,res)=>{
          const client = req.query.email;
          const query = {email : email};
          const orders = await orderCollection.find(query).toArray();
          res.send(orders);
        })
        app.get('/products', async(req,res)=>{
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);



        })

        app.put('/user/:email', async(req,res)=>{
          const email = req.params.email;
          const user = req.body;
          const filter ={email : email};
          const options = {upsert : true};
          const updateDoc = { $set : user}
        })
        app.post('/orders',async(req,res)=>{
          const order = req.body;
          const query = {order :orders.order, name : orders.name}
          const exist = await orderCollection.findOne(query);
          if (exist){
            return res.send({success : false, orders :exist})
          }
          const result = await orderCollection.insertOne(booking);
          return res.send({success :true, result});
        })
     }
  finally{

  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('car!')
})

app.listen(port, () => {
  console.log(` app listening   ${port}`)
})