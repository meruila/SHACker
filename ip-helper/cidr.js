const os = require('os');
const interfaces = os.networkInterfaces();
const myIP = require("./whoisserver").serverIP;
let array = [];
let buffer;
try{
    for (const [key, value] of Object.entries(interfaces)) {
        array.push(value);
    }
    
    array = [].concat.apply([], array);
    for(i in array){
        const interface = array[i];
        if(interface.address === myIP){
            buffer = interface.cidr;
        }
    }
}
catch{
    console.log("Manually put cidr in code");
    buffer = ""; // manually put cidr here (inside "")
}

exports.target = buffer;

  

