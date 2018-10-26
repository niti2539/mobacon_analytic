var io = require('socket.io-client');
socket = io.connect('http://localhost:3000/');
socket.on('connect', function () {
    console.log("socket connected");
});

socket.on('connect_error', function (e) {
    console.error(e);
});

// new billing data
socket.on('billing.new', function (e) {
    console.dir(e);
});