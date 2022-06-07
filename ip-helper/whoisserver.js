//  reference: gabemeola (https://gist.github.com/sviatco/9054346)

// Network interfaces
var address,
    ifaces = require('os').networkInterfaces();
for (var dev in ifaces) {
    ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
}

exports.serverIP = address;