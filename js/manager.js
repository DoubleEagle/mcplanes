function Manager(){
	this.plane = {step: function(){}};
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild($(renderer.domElement).addClass('game')[0]);
	
	//objects here

	camera.position.y = 20;
	camera.rotation.x = Math.PI+Math.PI/2*1.3;
	camera.rotation.z = Math.PI;
	camera.position.z += 10;
	
	load('models/plane02.json', 
		$.proxy(function(plane){
			this.plane = new Plane(plane);
		}, this)
	);
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( -1, 1, 1 );
	scene.add( directionalLight );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, .3 );
	directionalLight.position.set( 1, -1, -1 );
	scene.add( directionalLight );
	
	this.render = function(){
		requestAnimationFrame($.proxy(this.render, this));
		renderer.render(scene, camera);
		this.plane.step();
	}
	this.render();
	
	function load(file, callback){
		var loader = new THREE.JSONLoader(1);
		loader.load(file, function(geometry, materials){
			for(i in materials){
				materials[i].shading = THREE.FlatShading;
				materials[i].side = THREE.DoubleSide;
			}
			var material = new THREE.MeshFaceMaterial(materials);
			var mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);
			callback(mesh);
		});
	}
}