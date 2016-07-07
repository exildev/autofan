var http = require('http');
var http_serv = http.createServer();
var io = require('socket.io')(http_serv);
var url = require('url');
var fs = require('fs');
var listening = require('./listening');
var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
	var led = new five.Led(13);
	console.log("board ready");
	io.on('connection', function(socket) {
		console.log("start");
		socket.on('fan-on', function(message) {
			console.log("on");
			led.on();
			socket.broadcast.emit('fan-on');
		});
		socket.on('fan-off', function(message) {
			console.log("off");
			led.off();
			socket.broadcast.emit('fan-off');
		});
	});

});

var server = http.createServer(function(request, response) {
	response.setHeader('Content-Type', 'text/html');
	response.writeHead(200, {'Content-Type': 'text/html'});
	var parts = url.parse(request.url, true);
	if (request.method == 'GET') {
		fs.readFile('server/index.html', 'utf8', function (err, data) {
			response.end(data);
		});
	}
});

http_serv.listen(1199, '0.0.0.0', function() {
	console.log("Corriendo en el puerto ", 1199);
});

server.listen(80, '0.0.0.0', function() {
	console.log("Corriendo en el puerto ", 80);
});