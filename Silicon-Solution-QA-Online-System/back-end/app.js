const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const multiparty = require('multiparty');

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
  dbo.collection(stationCollection).find({},{fields:{_id: 0, id: 1, vender: 1, chipset: 1, device: 1, timestamp: 1}}).toArray(function(err, result){
    if(err) throw err;
    response.send(result);
  })
})

app.post('/addStation', function(request, response){
  let form = new multiparty.Form();
  let station = {};

  form.on('error', function(err){
    console.log("Error parsing form" + err.stack);
  });

  form.on('part', function(part){
    if(part.filename){
      chunks = [];
      part.on("data", function(chunk){
        chunks.push(chunk);
      })

      part.on("end", function(){
        station[part.name] = Buffer.concat(chunks)
      })
    }
  })

  form.on('field', function(name, value){
    station[name] = value;
  })

  form.on('close', function(){
    //handle the final station info when every thing is loaded especially the picture
    //now store all the info in database
    dbo.collection(stationCollection).insertOne(station, function(err, result){
      if (err) {
        response.send(false);
        throw err;
      }
      if (result.result.ok && result.result.ok == 1)
        response.send(true);
      else 
      response.send(false);
    })
  })

  form.parse(request);

})

app.post('/getStation', function(request, response){
  let query = {id: request.body["id"]};
  dbo.collection(stationCollection).findOne(query, function(err, result){
    if (err) throw err;
/*     if(result.DUT_connection_picture){
      let buffer = result.DUT_connection_picture.buffer;
      let ab = new ArrayBuffer(buffer.length);
      let view = new Uint8Array(ab);
      for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
      }
      result.DUT_connection_picture = view;
    } */

    response.send(result);
  })
});

app.post('/deleteStation', function(request, response){
  let query = {id: request.body["id"]};
  dbo.collection(stationCollection).remove(query, {justOne: true}, function(err, result){
    if (err) {
      response.send(false);
      throw err;
    }
    if (result.result.ok && result.result.ok == 1)
        response.send(true);
      else 
      response.send(false);
  })
})

app.post('/updateStation', function(request, response){
  let form = new multiparty.Form();
  let station = {};
  let prevStationId = "";
  form.on('error', function(err){
    console.log("Error parsing form" + err.stack);
  });

  form.on('part', function(part){
    if(part.filename){
      chunks = [];
      part.on("data", function(chunk){
        chunks.push(chunk);
      })

      part.on("end", function(){
        station[part.name] = Buffer.concat(chunks)
      })
    }
  })

  form.on('field', function(name, value){
    if(name == 'prevId'){
      prevStationId = value;
    }
    else{
      station[name] = value;
    }
  })

  form.on('close', function(){
    //handle the final station info when every thing is loaded especially the picture
    //now store all the info in database
    let query = {id: prevStationId}
    dbo.collection(stationCollection).updateOne(query, {$set:station}, function(err, result){
      if (err) {
        response.send(false);
        throw err;
      }
      if (result.result.ok && result.result.ok == 1)
        response.send(true);
      else 
      response.send(false);
    })
  })

  form.parse(request);
})

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
});