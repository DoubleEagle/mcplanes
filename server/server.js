var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app);

app.listen(8080);

console.log('a');

function handler(req, res){}

players = [];

io.sockets.on('connection', function(socket){
	socket.on('join', function(data){
		players[socket.client.conn.id] = data;
		players[socket.client.conn.id].id = socket.client.conn.id;
		
		socket.emit('settings', {id: socket.client.conn.id});
		
		playerList();
		
		console.log(data.name + ' joined!');
	});
	socket.on('disconnect', function(){
		for(var i in players){
			if(players[i].id == socket.client.conn.id){
				console.log(players[i].name+' left.');
				delete players[i];
				break;
			}
		}
		
		playerList();
	});
	
	socket.on('data', function(data){
		players[socket.client.conn.id].data = data.plane;
	});
});

setInterval(function(){
	var planes = [];
	for(var i in players){
		planes.push({id: i, data: players[i].data});
	}
	io.sockets.emit('data', {planes: planes});
}, 50);

setInterval(playerList, 2500);

function playerList(){
	var list = [];
	for(var i in players){
		list.push({name: players[i].name, id: players[i].id});
	}
	io.sockets.emit('player-list', {data: list});
}