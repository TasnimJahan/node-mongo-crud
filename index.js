const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = '2DEjKPoPDPgXdizC';
const uri = "mongodb+srv://organicUser:2DEjKPoPDPgXdizC@cluster0.stbya.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  ///form er jnno

app.get('/', (req, res) =>{
  res.sendFile(__dirname + '/index.html');    //underscore 2ta
    // res.send("Hello, I am working");
})



client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  //get
  app.get("/products", (req, res) => {
    productCollection.find({})
    // productCollection.find({}).limit(2)
    .toArray((err,documents) => {
      res.send(documents);
    })
  })


  // post
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);   //terminal e dekhanor jjnno
    productCollection.insertOne(product)
    .then(result =>{
      console.log("data added successfully");
      // res.send("added successfully");    //eta dile kichu ekta add hoe addProduce e jai and added successfully dekhai. but kichu j add korechi sheta bujha jaina
      res.redirect('/');    //eta dile add hoie pg ta reload hoie jai fle ki add korechi sheta chole ashe .so CREATE ,READ done
    })
  })



  //load single product
  app.get('/product/:id',(req, res)=>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents)=>{
      res.send(documents[0]);
    })
  })



  //update data
  app.patch('/update/:id', (req, res)=>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price , quantity: req.body.quantity}
    })
    .then(result=>{
      console.log(result);
      res.send(result.modifiedCount > 0);
    })
  })



  //delete
  app.delete('/delete/:id',(req, res)=>{
    // console.log(req.params.id);
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      console.log(result);
      res.send(result.deletedCount > 0);
    })
  })


  console.log("database connected");
  // client.close();
});



app.listen(3000);