function Manager(){
	this.load = load;

	this.plane = {step: function(){}};
	
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild($(renderer.domElement).addClass('game')[0]);
	
	$(window).resize(function(){
		$('.game').attr({width: window.innerWidth, height: window.innerHeight});
	});
	
	//objects here

	this.camera.position.y = 20;
	this.camera.rotation.z = Math.PI;
	this.camera.rotation.x = Math.PI+Math.PI/2*1.3;
	this.camera.position.z = 10;
	this.load('models/plane01.json', 
		$.proxy(function(plane){
			this.plane = new Plane(plane, this.camera);
		}, this)
	);
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( -1, 1, 1 );
	this.scene.add(directionalLight);
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, .3 );
	directionalLight.position.set( 1, -1, -1 );
	this.scene.add(directionalLight);
	
	this.environment = new Environment(this);
	
	this.render = function(){
		requestAnimationFrame($.proxy(this.render, this));
		renderer.render(this.scene, this.camera);
		var time = new Date();
		var dt = time - this.lastDate;
		this.lastDate = time;
		this.plane.step(dt);
	}
	this.lastDate = new Date();
	this.render();
	
	function load(file, callback){
		var loader = new THREE.JSONLoader(1);
		loader.load(file, $.proxy(function(geometry, materials){
			for(i in materials){
				materials[i].shading = THREE.FlatShading;
				materials[i].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial(materials);
			var mesh = new THREE.Mesh(geometry, material);
			this.scene.add(mesh);
			callback(mesh);
		}, this));
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