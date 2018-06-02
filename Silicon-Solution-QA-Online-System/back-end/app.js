const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = 3000;
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/Silicon-Solution-Online-System-DB";
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
  res.send('Hello World');
})


app.post("/userInfo", function(request, response){
  console.log(request.body);
  var query = {username: request.body["username"]};
  dbo.collection("userInfo").findOne(query, function(err, result){
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


var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
});