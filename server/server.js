var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app),
  env = require('./node_modules/terrainGeneration.js');

app.listen(8080);

console.log('a');

function handler(req, res){}

players = [];

var environment = env.vectorenGeneration(8);

io.sockets.on('connection', function(socket){
	socket.on('join', function(data){
		players[socket.client.conn.id] = data;
		players[socket.client.conn.id].id = socket.client.conn.id;
		
		socket.emit('settings', {id: socket.client.conn.id});
		playerList();
		planeList();
		setTimeout(function(){socket.emit('env-data', {environment: environment})}, 1000);
		
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

setInterval(playerList, 2500);
setInterval(planeList, 50);

function playerList(){
	var list = [];
	for(var i in players){
		list.push({name: players[i].name, id: players[i].id});
	}
	io.sockets.emit('player-list', {data: list});
}

function planeList(){
	var planes = [];
	for(var i in players){
		planes.push({id: i, data: players[i].data});
	}
	io.sockets.emit('plane-data', {planes: planes});
}