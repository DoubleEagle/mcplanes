function Manager(){
	this.plane = {step: function(){}};
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	
	//objects here

	camera.position.y = 10;
	camera.rotation.x = Math.PI+Math.PI/2*1.3;
	camera.rotation.z = Math.PI;
	camera.position.z += 5;
	
	var loader = new THREE.JSONLoader(1);
	loader.load('models/plane01.json', function(geometry, materials){
		console.log(materials);
		for(i in materials){
			materials[i].shading = THREE.FlatShading;
			materials[i].side = THREE.DoubleSide;
		}
		var material = new THREE.MeshFaceMaterial(materials);
		var plane = new THREE.Mesh(geometry, material);
		scene.add(plane);
		this.plane = new Plane(plane);
	});
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
	directionalLight.position.set( -1, 1, 1 );
	scene.add( directionalLight );
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff, .3 );
	directionalLight.position.set( 1, -1, -1 );
	scene.add( directionalLight );
	
	function render() {
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		this.plane.step();
	}
	render();
}