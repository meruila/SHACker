const myIP = require("../ip-helper/whoisserver").serverIP;
const fs = require('fs');

fs.writeFileSync('.env', 'REACT_APP_API_PATH=http://'+myIP+':3001'); // for build
