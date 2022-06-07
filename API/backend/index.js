const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// server's ip and cidr
const Netmask = require('netmask').Netmask;
const myCidr = require("../../ip-helper/cidr")
const blockArg = myCidr.target;
const block = new Netmask(blockArg);
const myIP = require("../../ip-helper/whoisserver").serverIP;

// connect to Mongo DB
mongoose.connect(
  "mongodb://localhost:27017/shac-database",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }, //useCreateIndex was set to true to get rid of deprecation warning
  (err) => {
    if (err) { console.log(err); }
    else { console.log("Successfully connected to Mongo DB."); }
  });

// register the models with Mongoose
require("../database/models/regular-user");
require("../database/models/admin");
require("../database/models/student-record");
require("../database/models/curriculum");
require("../database/models/subject");
require("../database/models/log");

// initialize the server
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// allow CORS
app.use((req, res, next) => {  
  const clientIP = req.ip;
  console.log("Request received from "+clientIP);
  let contain = block.contains(clientIP);
  if(contain){
    console.log("Request came from same network");
    res.setHeader("Access-Control-Allow-Origin", req.get('origin'));
    res.setHeader("Access-Control-Allow-Methods", "POST");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type");
    res.setHeader("Access-Control-Allow-Credentials","true");
  }else{
    console.log("Request did NOT come from same network");
    res.status(403);
    return res.send({success:false, note:"Forbidden"});
  }
  next();
});

// declare routes
require("./router")(app);

// start server
const port = 3001;
app.listen(port, myIP, (err) => {
  if (err) { console.log(err); }
  else {
    console.log("HOST IP: "+myIP);
    console.log("API listening at port "+port); 
  }
});