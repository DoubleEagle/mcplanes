var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app);

app.listen(8080);

console.log('a');

function handler (req, res) {}

io.sockets.on('connection', function(socket){
  socket.on('', function(data){
	socket.emit('asdf', {other: 'data'});
    console.log(data);
  });
});