function MpManager(plane, manager){
	this.socket = io.connect('192.168.0.20:8080');
	
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
				$('.player-list').append($('<p data-id="'+data[i].id+'">'+data[i].name+' <span></span></p>')).click($.proxy(function(e){
					this.plane.input(this.planes[$(e.target).data('id')].output());
				}, this));
				if(this.planes[data[i].id] == undefined){
					var mesh = new THREE.Mesh(this.plane.plane.geometry.clone(), this.plane.plane.material.clone());
					mesh.modelName = this.plane.modelName;
					this.planes[data[i].id] = new Plane(mesh, new THREE.PerspectiveCamera());
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
		this.socket.emit('data', this.plane.output());
	}, this), 200);
	
	this.socket.on('data', $.proxy(function(data){
		data = data.data;
		for(var i in data){
			if(this.planes[data[i].id] != undefined){
				this.planes[data[i].id].input(data[i].data);
			}
		}
	}, this));
	/*socket.emit('my other event', {my:'data'});*/
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
		'Nerdo'
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
		'air'
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
		'plane'
	];
	return first[Math.floor(Math.random()*first.length)]+' '+
		second[Math.floor(Math.random()*second.length)]+
		third[Math.floor(Math.random()*third.length)];
}