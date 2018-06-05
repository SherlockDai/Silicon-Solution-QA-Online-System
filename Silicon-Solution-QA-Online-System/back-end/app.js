const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multiparty = require('multiparty');

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, "./uploads");
  },
  filename: function(req, file, callback) {
    callback(null, Date.now()+file.originalname);
  }
});
const upload = multer({storage: storage}).single('DUT_connection_picture');

const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Silicon-Solution-Online-System-DB";

const userCollection = "userInfo"
const stationCollection = "stationInfo"

var dbo

app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

MongoClient.connect(url,  { useNewUrlParser: true },  function(err, db) {
  if (err) throw err;
  dbo = db.db("Silicon-Solution-Online-System-DB");
  console.log("MongoDB connect success!");
  
});

app.get('/', function (req, res) {
  res.send('Developing');
})


app.post("/userInfo", function(request, response){
  console.log(request.body);
  var query = {username: request.body["username"]};
  dbo.collection(userCollection).findOne(query, function(err, result){
    if(err) throw err;
    console.log(result);
    if(result == null){
      response.send({result: false, reason: "username"});
    }
    //check if the password is the same
    else if(request.body["password"] === result["password"]){
      response.send({result: true, user: result});
    }
    else{
      response.send({result: false, reason: "password"});
    }
  })
})

app.get('/allStationInfo',  function(request, response){
  dbo.collection(stationCollection).find({},{id: 1, vender: 1, chipset: 1, device: 1, timestamp: 1}).toArray(function(err, result){
    if(err) throw err;
    console.log(result);
    response.send(result);
  })
})

app.post('/addStation', function(request, response){
  upload(request, response, function(err){
    if(err){
      return response.end("Error");
    }
    response.end("uploaded")
  })
})


var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
});