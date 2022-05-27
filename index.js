const express = require('express');
const cors = require('cors');
const jwt =require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, MongoRuntimeError } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wiiut.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 function verifyJwt(req,res,next){
   const authHeader = req.headers.authorization;
   if(!authHeader){
     return res.status(401).send({message : 'Unauthorize access'})

   }
   const token = authHeader.split(' ')[1];
   jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
     if(err){
       return res.status(403).send({message :'Forbidden access'})
     }
     req.decoded =decoded;
     next()
   })
 }

 async function run(){
     try{
        await client.connect();
        const productCollection =client.db('car_tools').collection('products');
        const orderCollection = client.db('car_tools').collection('order');
        const userCollection = client.db('car_tools').collection('user');


        app.get('/order', verifyJwt, async(req,res)=>{
          const client = req.query.patient;
          const decodedEmail = req.query.email;
          if(patient ===decodedEmail){
            const query = {patient : patient};
            const orders = await orderCollection.find(query).toArray();
            return res.send(orders);
          }
          else{
            return res.status(403).send({message : 'forbidden access'})
          }
          // const authorization = req.headers.authorization
          // console.log('auth header', authorization);
          
        })
        app.get('/products', async(req,res)=>{
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);



        });

        app.get('/user', async(req,res)=>{
          const users = await userCollection.find().toArray();
          res.send(users);

        })

        app.put('/user/:email', async(req,res)=>{
          const email = req.params.email;
          const user = req.body;
          const filter ={email : email};
          const options = {upsert : true};
          const updateDoc = {
            $set : user, 
        };
        const result = await userCollection.updateOne(filter,updateDoc,options);
        const token =jwt.sign({email : email},process.env.ACCESS_TOKEN,{expiresIn : '1h'})
        res.send({result, token});

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