function Manager(){
	this.load = load;
	this.init3d = init3d;
	this.render = render;

	this.objects = [];
	
	/*this.attMeter = $('.att-meter')[0];
	this.attMeter.ctx = this.attMeter.getContext('2d');
	this.attMeter.horizon = $('.att-meter .horizon')[0];
	this.attMeter.horizon.ctx = this.attMeter.horizon.getContext('2d');
	this.attMeter.overlay = $('.att-meter .overlay')[0];*/
	
	this.init3d();
	
	this.environment = new Environment(this);
	this.objects.push(this.environment);
	
	this.lastDate = new Date();
	
	
	function load(file, callback){
		var loader = new THREE.JSONLoader(1);
		loader.load(file, $.proxy(function(geometry, materials){
			for(i in materials){
				materials[i].shading = THREE.FlatShading;
				materials[i].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial(materials);
			callback(geometry, material);
		}, this));
	}
	
	function init3d(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 25000 );

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		$('body').prepend($(this.renderer.domElement).addClass('game')[0]);
		
		$(window).resize($.proxy(function(){
			$('.game').attr({width: window.innerWidth, height: window.innerHeight});
			this.renderer.setSize( window.innerWidth, window.innerHeight );
		}, this));
		
		//objects here

		this.camera.position.y = 20;
		this.camera.rotation.z = Math.PI;
		this.camera.rotation.x = Math.PI+Math.PI/2*1.3;
		this.camera.position.z = 10;
		var modelName = 'models/plane01.json';
		this.load(modelName,
			$.proxy(function(geometry, material){
				this.planeGeometry = geometry.clone();
				var mesh = new THREE.Mesh(geometry, material);
				mesh.modelName = modelName;
				this.scene.add(mesh);
				var plane = this.plane = new Plane(mesh, this.camera);
				plane.main = true;
				this.objects.push(plane);
				this.mpManager = new MpManager(plane, this);
			}, this)
		);
		
		var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set( -1, 1, 1 );
		this.scene.add(directionalLight);
		
		var directionalLight = new THREE.DirectionalLight(0xffffff, .3);
		directionalLight.position.set( 1, -1, -1 );
		this.scene.add(directionalLight);
		this.render();
		
		var ambientLight = new THREE.AmbientLight(0x404040);
		this.scene.add(ambientLight);
		this.render();
	}
	
	function render(){
		requestAnimationFrame($.proxy(this.render, this));
		
		this.renderer.render(this.scene, this.camera);
		
		var time = new Date();
		var dt = time - this.lastDate;
		this.lastDate = time;
		
		for(var i in this.objects){
			this.objects[i].step(dt);
		}
		
		/*if(this.plane){
			this.attMeter.width = this.attMeter.width;
			this.attMeter.horizon.width = this.attMeter.horizon.width;
			var ctx = this.attMeter.horizon.ctx;
			ctx.fillStyle = '#FFCC88';
			ctx.fillRect(0, 0, 64, 64);
			ctx.fillStyle = '#8888FF';
			ctx.beginPath();
			var angle = Math.asin(this.plane.direction.pitch.z) + (Math.sign(this.plane.direction.yaw.z)-1)/2*Math.PI;
			var middle = 32 + this.plane.direction.roll.z*32*Math.sign(this.plane.direction.yaw.z);
			var corner1 = {x:32 - Math.cos(angle)*96, y: middle - this.plane.direction.pitch.z*96};
			var corner2 = {x:32 + Math.cos(angle)*96, y: middle + this.plane.direction.pitch.z*96};
			ctx.moveTo(corner1.x, corner1.y);
			ctx.lineTo(corner2.x, corner2.y);
			if(corner2.x > 32){
				if(middle+(corner2.y-middle)/(corner2.x-32)*32 > 64){
					ctx.lineTo(64, 64);
				}
				if(middle+(corner2.y-middle)/(corner2.x-32)*32 > 0){
					ctx.lineTo(64, 0);
				}
				if(middle-(corner2.y-middle)/(corner2.x-32)*32 > 0){
					ctx.lineTo(0, 0);
				}
				if(middle-(corner2.y-middle)/(corner2.x-32)*32 > 64){
					ctx.lineTo(0, 64);
				}
			}
			if(corner2.x < 32){
				if(middle+(corner2.y-middle)/(32-corner2.x)*32 < 0){
					ctx.lineTo(0, 0);
				}
				if(middle+(corner2.y-middle)/(32-corner2.x)*32 < 64){
					ctx.lineTo(0, 64);
				}
				if(middle-(corner2.y-middle)/(32-corner2.x)*32 < 64){
					ctx.lineTo(64, 64);
				}
				if(middle-(corner2.y-middle)/(32-corner2.x)*32 < 0){
					ctx.lineTo(64, 0);
				}
			}
			ctx.fill();
			ctx.closePath();
			ctx.globalCompositeOperation = 'destination-atop';
			ctx.beginPath();
			ctx.arc(32, 32, 28, 0, Math.PI*2, true);
			ctx.fill();
			ctx.globalCompositeOperation = 'source-over';
			this.attMeter.ctx.drawImage(this.attMeter.horizon, 0, 0);
			this.attMeter.ctx.drawImage(this.attMeter.overlay, 0, 0);
		}*/
	}
}

THREE.Matrix3.prototype.inverse = function(){
	var coords = [];
	for(var i in this.elements){
		coords[i] = {x: i%3, y: Math.floor(i/3)};
	}
	var inverse = new THREE.Matrix3();
	var determinant = 
		this.elements[0] * this.elements[4] * this.elements[8] +
		this.elements[1] * this.elements[5] * this.elements[6] +
		this.elements[2] * this.elements[3] * this.elements[7] -
		this.elements[2] * this.elements[4] * this.elements[6] -
		this.elements[1] * this.elements[3] * this.elements[8] -
		this.elements[0] * this.elements[5] * this.elements[7];
	for(var i in this.elements){
		var matrix2 = [];
		for(var j in this.elements){
			if(coords[i].x !== coords[j].x && coords[i].y !== coords[j].y){
				matrix2.push(this.elements[j]);
			}
		}
		inverse.elements[i] = 1/determinant * (matrix2[0] * matrix2[3] - matrix2[1] * matrix2[2]) * (i % 2 == 0 ? 1 : -1);
	}
	inverse.transpose();
	return inverse;
}

THREE.Matrix3.prototype.to4 = function(){
	var mat4 = new THREE.Matrix4();
	mat4.set(this.elements[0], this.elements[3], this.elements[6], 0, this.elements[1], this.elements[4], this.elements[7], 0, this.elements[2], this.elements[5], this.elements[8], 0, 0, 0, 0, 1);
	return mat4;
}