const path = require("path");
const express = require("express");
const app = express(); // create express app


const Netmask = require('netmask').Netmask;
const myCidr = require("../../ip-helper/cidr");
const blockArg = myCidr.target;
const block = new Netmask(blockArg);
const myIP = require("../../ip-helper/whoisserver").serverIP;


// add middlewares
app.use((req, res, next) => {  
    const clientIP = req.ip;
    console.log("Request received from "+clientIP);
    let contain = block.contains(clientIP);
    if(!contain){
        console.log("Request did NOT come from same network");
        res.status(403);
        return res.send({success:false, note:"Forbidden"});
    }
    next();
  });

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// start express server on port 5000
// start server
const port = 5000;
app.listen(port, myIP, (err) => {
  if (err) { console.log(err); }
  else {
    console.log("HOST IP: "+myIP);
    console.log("Listening at port "+port); 
  }
});