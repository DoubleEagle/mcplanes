function Environment(manager) {
	// ONLY CLOUD IN THE GAME
	manager.load('models/cloud.json', function(geometry) {
		var material = new THREE.MeshPhongMaterial(
			{color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
		);
		var mesh = new THREE.Mesh(geometry, material);
		manager.scene.add(mesh);
	});
	// feel free to add more loading hints, copy this: ,'<p class="banner"></p>'
	this.loadingHints = [
		 '<p class="banner">Making sense...</p>'
		,'<p class="banner">Adding pepper and salt...</p>'
		,'<p class="banner">Inventing more loading hints...</p>'
		,'<p class="banner">Abusing physics...</p>'
		,'<p class="banner">Trying to reach space...</p>'
		,'<p class="banner">Assigning stupid names...</p>'
		,'<p class="banner">Rendering flying fish...</p>'
		,'<p class="banner">Getting a drink with taste...</p>'
		,'<p class="banner">Eating syrup waffles...</p>'
		,'<p class="banner">Going back in time...</p>'
		,'<p class="banner">Making pizza soup...</p>'
	];
	
	this.manager = manager;
	var banner = $('.banners').append(this.loadingHints[Math.floor(Math.random()*this.loadingHints.length)]);
	// TERRAIN GENERATION AND HEIGHTMAP
	this.input = function(vectors) {
		var normal = new THREE.Vector3(0, 1, 0);
		var color = new THREE.Color(0xffaa00);
		var face = new THREE.Face3(0, 1, 2, normal, color, 0);
		scale = 6400 / (vectors.length - 1);
		var geometry = new THREE.Geometry();
		var indices = [];
		var colors = [];
		var heighestZ = 0;
		var lowestZ = 0;

		for (var x = 0; x < vectors.length; x++) {
			for (var y = 0; y < vectors.length; y++) {
				if (vectors[x][y] < lowestZ) {
					lowestZ = vectors[x][y];
				}
				if (vectors[x][y] > heighestZ) {
					heighestZ = vectors[x][y];
				}
			}
		}
		for (var x = 0; x < vectors.length; x++) {
			indices[x] = [];
			for (var y = 0; y < vectors[x].length; y++) {
				indices[x][y] = geometry.vertices.length;
				geometry.vertices.push(new THREE.Vector3(x * scale, y * scale, vectors[x][y]));
				// geometry.colors.push(new THREE.Color(0x00ff00));
				if (vectors[x][y] < 0) {
					var red = Math.floor(100 - ((vectors[x][y] * -1) * 100 / (lowestZ * -1)));
					var green = Math.floor((vectors[x][y] * -1) * 45 / (lowestZ * -1) + 55);
					var val = Math.floor(((vectors[x][y]) * -1) * 255 / (lowestZ * -1));
					geometry.colors.push(new THREE.Color('rgb(' + red + ',' + green + ',0)'));	
				}
				else {
					var blue = Math.floor(((vectors[x][y])) * 255 / (heighestZ));
					var red = Math.floor(100 + vectors[x][y] * 155 / heighestZ);
					var green = Math.floor(55 + vectors[x][y] * 200 / heighestZ);
					geometry.colors.push(new THREE.Color('rgb(' + red + ',' + green + ',' + blue + ')'));
				}
			}
		}
		for (var x = 0; x < vectors.length - 1; x++) {
			for (var y = 0; y < vectors[x].length - 1; y++) {
				var val = Math.floor((vectors[x][y] + vectors[x + 1][y] + vectors[x][y + 1] + 1000) / 2000 * 255);
				var face = new THREE.Face3(indices[x][y], indices[x + 1][y], indices[x][y + 1]);
				face.vertexColors.push(geometry.colors[indices[x][y]]);
				face.vertexColors.push(geometry.colors[indices[x + 1][y]]);
				face.vertexColors.push(geometry.colors[indices[x][y + 1]]);
				geometry.faces.push(face);
			}
		}

		for (var x = 1; x < vectors.length; x++) {
			for (var y = 1; y < vectors[x].length; y++) {
				var val = Math.floor((vectors[x][y] + vectors[x - 1][y] + vectors[x][y - 1] + 1000) / 2000 * 255);
				var face = new THREE.Face3(indices[x][y], indices[x - 1][y], indices[x][y - 1]);
				face.vertexColors.push(geometry.colors[indices[x][y]]);
				face.vertexColors.push(geometry.colors[indices[x - 1][y]]);
				face.vertexColors.push(geometry.colors[indices[x][y - 1]]);
				geometry.faces.push(face);
			}
		}
		geometry.computeBoundingSphere();
		geometry.computeFaceNormals();
		// Uncomment for smooth mountains
		// geometry.mergeVertices();
		// geometry.computeVertexNormals();
		var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors}));
		mesh.position.x = -3200;
		mesh.position.y = -3200;
		manager.scene.add(mesh);

		var c = document.getElementsByClassName('heightmap')[0];
		var ctx = c.getContext("2d");
		var height = heighestZ - lowestZ;
		for (x in vectors) {
			for (y in vectors[x]) {
				if (vectors[x][y] < 0) {
					var val = Math.floor(((vectors[x][y]) * -1) * 255 / (lowestZ * -1));
					ctx.fillStyle = 'rgb(0,' + val + ',0)';
					ctx.fillRect(x * (128 / vectors.length), y * (128 / vectors.length), 1, 1);
				}
				else {
					var val = Math.floor((vectors[x][y]) * 255 / height);
					ctx.fillStyle = 'rgb(' + val + ',' + val + ',' + val + ')';
					ctx.fillRect(x * (128 / vectors.length), y * (128 / vectors.length), 1, 1);
				}
			}
		}
		//DRAW PLANE
		setInterval($.proxy(function() {
			var c = document.getElementsByClassName('heightmap_overlay')[0];
			var ctx = c.getContext("2d");
			ctx.clearRect(0, 0, 128, 128);
			ctx.fillStyle = 'rgb(255,0,0)';
			ctx.fillRect(Math.round((this.manager.plane.position.x * (128 / 6400)) + 64), Math.round((this.manager.plane.position.y * (128 / 6400)) + 64), 2, 2);
			if ((this.manager.plane.position.x * (128 / 6400)) + 64 > 128 || (this.manager.plane.position.y * (128 / 6400)) + 64 > 128 || (this.manager.plane.position.x * (128 / 6400)) + 64 < 0 || (this.manager.plane.position.y * (128 / 6400)) + 64 < 0) {
				ctx.strokeStyle = 'red';
				ctx.rect(1, 1, 127, 127);
				ctx.stroke();
			}
		}, this), 50);
		
		banner.remove();
	};
	
	//Cubemap
	var urls = ["images/posx.png", "images/negx.png",
		"images/posy.png", "images/negy.png",
		"images/posz.png", "images/negz.png"];
	var materials = [];
	for (var i in urls) {
		materials.push(
			new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(urls[i]),
				side: THREE.DoubleSide,
				depthWrite: false
			})
		);
	}
	this.skybox = new THREE.Mesh(new THREE.CubeGeometry(25000, 25000, 25000), new THREE.MeshFaceMaterial(materials));
	this.manager.scene.add(this.skybox);
	this.step = function(step) {
		if (manager.plane) {
			this.skybox.position = this.manager.plane.position.toThree();
		}
	}
}