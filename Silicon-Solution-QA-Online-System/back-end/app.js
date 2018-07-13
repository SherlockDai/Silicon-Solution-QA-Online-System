const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const rimraf = require('rimraf');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'litepoint-qateam@outlook.com',
    pass: 'lp12345LP'
  }
});

const uploadPath = "./uploads/"
app.use(express.static(__dirname + '/uploads/'));

const multiparty = require('multiparty');
const fs = require("fs")

const port = 3000;
const serverUrl =" http://localhost:3000/";
const MongoClient = require('mongodb').MongoClient;
const dbUrl = "mongodb://localhost:27017/Silicon-Solution-Online-System-DB";

const userCollection = "userInfo"


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

MongoClient.connect(dbUrl,  { useNewUrlParser: true },  function(err, db) {
  if (err) throw err;
  dbo = db.db("Silicon-Solution-Online-System-DB");
  console.log("MongoDB connect success!");
  
});

app.get('/', function (req, res) {
  res.send('Developing');
})


app.post("/login", function(request, response, next){
  var query = {email: request.body["email"]};
  dbo.collection(userCollection).findOne(query, function(err, result){
    if(err) throw err;
    if(result == null){
      response.send({result: false, reason: "email"});
    }
    //check if the password is the same
    else if(request.body["password"] === result["password"]){
      //create JWT and send the result back
      const token = jwt.sign({ }, 'shhhhh', {expiresIn: '8h'});
      response.send({result: true, user: result, token: token});
    }
    else{
      response.send({result: false, reason: "password"});
    }
  })
})

app.post('/register', function(request, resposne){
  let query = {email: request.body.email, password: request.body.password};
  dbo.collection(userCollection).insertOne(query, function(err, result){
    if (err) throw err
    if (result.result.ok && result.result.ok == 1){
        const mailOptions = {
          from: 'litepoint-qateam@outlook.com',
          to: request.body.email,
          subject: 'Silicon Solution Online System Registration Confirmation',
          text: `Hello! \nThanks for using our QA Team\'s online system. Your registered email address is ${request.body.email} and your password is ${request.body.password}.
                \nCheers!\nSilicon Solution QA Team\nLitepoint - A Teradyne Company`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        resposne.send(true);
      }
      else 
        response.send(false);
  })
})

app.post('/retrievePassword', function(request, resposne){
  let query = {email: request.body.email};
  dbo.collection(userCollection).findOne(query, function(err, result){
    if (err) throw err
    if (result){
      const mailOptions = {
        from: 'litepoint-qateam@outlook.com',
        to: request.body.email,
        subject: 'Silicon Solution Online System retrieve password',
        text: `Hello! \nThanks for using our QA Team\'s online system. Your registered email address is ${request.body.email} and your password is ${result.password}.
        \nCheers!\nSilicon Solution QA Team\nLitepoint - A Teradyne Company`
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          resposne.send(false);
        } else {
          console.log('Email sent: ' + info.response);
          resposne.send(true);
        }
      });
    }
    else{
      resposne.send(false);
    }
  })
})

app.post('/getAll',  function(request, response, next){
  if (request.body['collection']){
    var coll = request.body['collection']
  }
  else{
    response.status(400).send({
      message: 'Must input collection!'
    })
    return next();
  }
  if (request.body['option'])
    var option = request.body['option']
  dbo.collection(coll).find({},{fields:option}).toArray(function(err, result){
    if(err) throw err;
    response.send(result);
  })
})

app.post('/getMany', function(request, response, next){
  if (request.body['collection']){
    var coll = request.body['collection']
  }
  else{
    response.status(400).send({
      message: 'Must input collection!'
    })
    return next();
  }
  let fields = {};
  if (request.body['fields']){
    fields = request.body.fields;
  }
  if (request.body['option'])
    var option = request.body['option']
  dbo.collection(coll).find(fields, {fields: option}).toArray(function(err, result){
    if (err) throw err;
    response.send(result);
  })
})

app.post('/addOne', function(request, response, next){
  let form = new multiparty.Form();
  let record = {};
  let collection = null;

  form.on('error', function(err){
    console.log("Error parsing form" + err.stack);
  });

  form.on('file', function(name, file){
    //move the file to our upload/image folder
    const temp_path = file.path;
    const image_type = file.originalFilename.split('.').pop();
    
    if (name == 'uploads[]'){
      var newFileName = file.originalFilename;
    }
    else{
      var newFileName = name + '.' + image_type;
    }
    if (!fs.existsSync(uploadPath + record['id'] + "\\")){
      fs.mkdirSync(uploadPath + record['id'] + "\\");
    }
    const new_path = uploadPath + record['id'] + "\\" +  newFileName;
    if (name == 'uploads[]'){
      const result = record.documents.filter(function( doc ) {
        return doc.fileName == file.originalFilename;
      });
      if (result.length > 0){
        for (let doc of result){
          //first time, the doc url might be null
          doc.url = serverUrl
          //filename must be the same so we just update the size and last modified time
          doc.size = file.size
          doc.lastModified = file.lastModified;
        }
      }
      else
        record.documents.push({url: serverUrl, fileName: file.originalFilename, size: file.size, lastModified: file.lastModified})
    }
    else{
      record[name] = {url: serverUrl, fileName: newFileName};
    }
    
    fs.rename(temp_path, new_path, (err) => {
      if (err) throw err;
    })
  });

  form.on('field', function(name, value){
    if(name == "collection"){
      collection = value;
    }
    else{
      try{
        record[name] = JSON.parse(value);
      } catch(e){
        record[name] = value;
      }
      
    }
  })

  form.on('close', function(){
    //handle the final record info when every thing is loaded especially the picture
    //now store all the info in database
    if(collection == null){
      response.send({
        error: 'Must input collection!'
      })
      return next();
    }
    dbo.collection(collection).insertOne(record, function(err, result){
      if (err) {
        const regex = /^E\d+/;
        err_code = err.errmsg.match(regex);
        if (err_code == "E11000")
          response.status(400).send("Insertion failed! Duplicated Station ID! Please change station's name");
        return next();
      }
      if (result.result.ok && result.result.ok == 1)
        response.send(true);
      else 
        response.send(false);
    })
  })

  form.parse(request);

})

app.post('/getOne', function(request, response, next){
  if (request.body['collection']){
    var coll = request.body['collection']
  }
  else{
    response.status(400).send({
      message: 'Must input collection!'
    })
    return next();
  }
  if (request.body['fields']){
    var query = request.body['fields'];
  }
  else{
    response.status(400).send({
      message: 'Must input fields!'
    })
    return next();
  }
  dbo.collection(coll).findOne(query, {fields:{_id: 0}}, function(err, result){
    if (err) throw err;
    //TODO what if this one is already delete by another user?
    response.send(result);
  })
});

app.post('/deleteOne', function(request, response, next){
  if (request.body['collection']){
    var collection = request.body['collection']
  }
  else{
    response.status(400).send({ 
      message: 'Must input collection!'
    })
    return next();
  }
  if (request.body['fields']){
    var query = request.body['fields'];
  }
  else{
    response.status(400).send({
      message: 'Must input fields!'
    })
    return next();
  }
  //remove files
  rimraf( __dirname + '/uploads/' + request.body['fields']['id'], function(error){
    if (error){
      throw error;
    }
  });
  dbo.collection(collection).remove(query, {justOne: true}, function(err, result){
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

app.post('/updateOne', function(request, response, next){
  let form = new multiparty.Form();
  let record = {};
  let prevId = null
  let collection = null;
  form.on('error', function(err){
    console.log("Error parsing form" + err.stack);
  });

  form.on('file', function(name, file){
    if(collection == null){
      response.status(400).send({
        message: 'Must input collection!'
      })
      return next();
    }
    if(prevId == null){
      response.status(400).send({
        message: 'Must input previous record id!'
      })
      return next();
    }
    //move the file to our upload folder
    const temp_path = file.path;
    const image_type = file.originalFilename.split('.').pop();
    
    if (name == 'uploads[]'){
      var newFileName = file.originalFilename;
    }
    else{
      var newFileName = name + '.' + image_type;
    }
    //move the files to the previous id folder first
    if (!fs.existsSync(uploadPath + prevId + "\\")){
      fs.mkdirSync(uploadPath + prevId + "\\");
    }
    const new_path = uploadPath + prevId + "\\" +  newFileName;
    if (name == 'uploads[]'){
      const result = record.documents.filter(function( doc ) {
        return doc.fileName == file.originalFilename;
      });
      if (result.length > 0){
        for (let doc of result){
          //first time, the doc url might be the local url
          doc.url = serverUrl;
          //filename must be the same so we just update the size and modified time
          doc.size = file.size;
          doc.lastModified = file.lastModified;
        }
      }
      else
        record.documents.push({url: serverUrl, fileName: file.originalFilename, size: file.size, lastModified: file.lastModified})
    }
    else{
      record[name] = {url: serverUrl, fileName: newFileName};
    }
    //use sync rename here, since we will rename the folder lately, async rename might cause folder locked
    fs.renameSync(temp_path, new_path);
  });

  form.on('field', function(name, value){
    //the reason we store it is we don't want to store collection and prevId in our station doc
    if(name == 'prevId'){
      prevId = value;
    }
    else if(name == "collection"){
      collection = value;
    }
    else
      try{
        record[name] = JSON.parse(value);
      } catch(e){
        record[name] = value;
      }   
  })
  form.on('close', function(){
    //handle the final record info when every thing is loaded especially the picture
    //now store all the info in database
    let query = {id: prevId}
    //remove deleted files from file system
    while(record.deleted && record.deleted.length > 0){
      let file = record.deleted.pop()
      rimraf( __dirname + '/uploads/' + prevId + '/' + file.fileName, function(error){
        if (error){
          throw error;
        }
      });
    }
    dbo.collection(collection).updateOne(query, {$set:record}, function(err, result){
      if (err) {
        throw err;
      }
      //change the folder's name if the user changed the id, hopefully they don't
      if(prevId != record['id']){
        const old_path = uploadPath + prevId + "/";
        const new_path = uploadPath + record['id'] + "/";
        fs.rename(old_path, new_path, (err) => {
          if (err) throw err
        })
      }
      if (result.result.ok && result.result.ok == 1)
        response.send(true);
      else 
      response.send(false);
    })
  })

  form.parse(request);
})

app.post('/getSuggestion', function(request, response){
  if (request.body['collection']){
    var collection = request.body['collection']
  }
  else{
    response.status(400).send({
      message: 'Must input collection!'
    })
    return next();
  }
  if (request.body['field']){
    var query = request.body['field'];
  }
  else{
    response.status(400).send({
      message: 'Must input field!'
    })
    return next();
  }
  dbo.collection(collection).distinct(query, function(err, result){
    if (err) {
      response.send([]);
      throw err;
    }
    response.send(result);
  })
})

app.post('/checkExisting', function(request, response){
  if (request.body['collection']){
    var collection = request.body['collection']
  }
  else{
    response.status(400).send({
      message: 'Must input collection!'
    })
    return next();
  }
  if (request.body['field']){
    var query = request.body['field'];
  }
  else{
    response.status(400).send({
      message: 'Must input field!'
    })
    return next();
  }
  dbo.collection(collection).findOne(query, function(err, result){
    if (err){
      response.send(false)
      throw err
    }
    if(result){
      response.send(true);
    }
    else{
      response.send(false);
    }
  })
})

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port
  
  console.log("Example app listening at http://%s:%s", host, port)
});