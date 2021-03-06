function MpManager(plane, manager){
	var ip = window.location.hostname;
	var port = '81';
	if(window.location.hostname == 'localhost'){
		// change this for local server testing
		ip = '85.151.128.10';
	}
	this.socket = io.connect(ip + ':' + port);
	
	this.socket.emit('join', {name: prompt('Please enter your name', createName())});
	this.settings = {};
	this.plane = plane;
	this.planes = [];
	this.manager = manager;
	
	this.socket.on('player-list', $.proxy(function(data){
		data = data.data;
		$('.player-list').html('');
		for(var i in data){
			if(data[i].id != this.settings.id){
				$('.player-list').append($('<p data-id="'+data[i].id+'">'+data[i].name+' <span></span></p>').click($.proxy(function(e){
					e.stopPropagation();
					this.plane.input(this.planes[$(e.target).data('id')].output());
				}, this)));
				if(this.planes[data[i].id] == undefined){
					var mesh = new THREE.Mesh(this.plane.plane.geometry.clone(), this.plane.plane.material.clone());
					mesh.modelName = this.plane.plane.modelName;
					this.planes[data[i].id] = new Plane(mesh, new THREE.PerspectiveCamera(), this.manager.environment);
					this.planes[data[i].id].id = data[i].id;
					this.manager.objects.push(this.planes[data[i].id]);
					this.manager.scene.add(this.planes[data[i].id].plane);
				}
			}
			else{
				$('.player-list').append($('<p class="me">'+data[i].name+'</p>'));
			}
		}
		for(var i in this.planes){
			var found = false;
			for(var j in data){
				if(i == data[j].id){
					found = true;
				}
			}
			if(found == false){
				this.manager.scene.remove(this.planes[i].plane);
				this.manager.objects.splice(this.manager.objects.indexOf(this.planes[i]), i);
				delete this.planes[i];
			}
		}
	}, this));
	
	this.socket.on('settings', $.proxy(function(data){
		this.settings = data;
	}, this));
	
	setInterval($.proxy(function(){
		this.socket.emit('data', {plane: this.plane.output()});
	}, this), 50);
	
	this.socket.on('plane-data', $.proxy(function(data){
		planes = data.planes;
		for(var i in planes){
			if(this.planes[planes[i].id] != undefined){
				this.planes[planes[i].id].input(planes[i].data);
			}
		}
	}, this));
	
	this.socket.on('env-data', $.proxy(function(data){
		this.manager.environment.input(data.environment);
	}, this));
}

function createName(){
	var first = [
		'Epic',
		'Gloomy',
		'Great',
		'Small',
		'Black',
		'Noisy',
		'Fast',
		'Nerdo',
		'Fat'
	];
	var second = [
		'butter',
		'moon',
		'fire',
		'base',
		'grand',
		'silver',
		'tooth',
		'sauce',
		'air',
		'ham',
		'thunder',
		'brain'
	];
	var third = [
		'fly',
		'light',
		'man',
		'ball',
		'mother',
		'smith',
		'paste',
		'pan',
		'pick',
		'plane',
		'burger',
		'storm',
		'ster'
	];
	return first[Math.floor(Math.random()*first.length)]+' '+
		second[Math.floor(Math.random()*second.length)]+
		third[Math.floor(Math.random()*third.length)];
}