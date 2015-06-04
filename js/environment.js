function Environment(manager) {
    //ENIGE WOLK IN HET SPEL
    manager.load('models/cloud.json', function(geometry) {
        var material = new THREE.MeshPhongMaterial(
                {color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
        );
        var mesh = new THREE.Mesh(geometry, material);
        manager.scene.add(mesh);

    });
    this.manager = manager;
    //TERRAIN GENERATION AND HEIGHTMAP
    this.input = function(vectoren) {
        var normal = new THREE.Vector3(0, 1, 0);
        var color = new THREE.Color(0xffaa00);
        var face = new THREE.Face3(0, 1, 2, normal, color, 0);
        scale = 6400 / (vectoren.length - 1);
        var geometry = new THREE.Geometry();
        var indices = [];
        var heighestZ = 0;
        var lowestZ = 0;

        for (var x = 0; x < vectoren.length; x++) {
            indices[x] = [];
            for (var y = 0; y < vectoren[x].length; y++) {
                if (vectoren[x][y] < lowestZ) {
                    lowestZ = vectoren[x][y];
                }
                if (vectoren[x][y] > heighestZ) {
                    heighestZ = vectoren[x][y];
                }
                indices[x][y] = geometry.vertices.length;
                geometry.vertices.push(new THREE.Vector3(x * scale, y * scale, vectoren[x][y]));
            }
        }
        for (var x = 0; x < vectoren.length - 1; x++) {
            for (var y = 0; y < vectoren[x].length - 1; y++) {
                var val = Math.floor((vectoren[x][y] + vectoren[x + 1][y] + vectoren[x][y + 1] + 1000) / 2000 * 255);
                geometry.faces.push(new THREE.Face3(indices[x][y], indices[x + 1][y], indices[x][y + 1]));
            }
        }

        for (var x = 1; x < vectoren.length; x++) {
            for (var y = 1; y < vectoren[x].length; y++) {
                var val = Math.floor((vectoren[x][y] + vectoren[x - 1][y] + vectoren[x][y - 1] + 1000) / 2000 * 255);
                geometry.faces.push(new THREE.Face3(indices[x][y], indices[x - 1][y], indices[x][y - 1]));
            }
        }
        console.log(indices);
        geometry.computeBoundingSphere();
        geometry.computeFaceNormals();
        //Uncomment for smooth mountains
//        geometry.mergeVertices();
//        geometry.computeVertexNormals();
        var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        mesh.position.x = -3200;
        mesh.position.y = -3200;
        manager.scene.add(mesh);

        var c = document.getElementsByClassName('heightmap')[0];
        var ctx = c.getContext("2d");
        var height = heighestZ - lowestZ;
        for (x in vectoren) {
            for (y in vectoren[x]) {
                if (vectoren[x][y] < 0) {
                    var val = Math.floor(((vectoren[x][y]) * -1) * 255 / (lowestZ * -1));
                    ctx.fillStyle = 'rgb(0,' + val + ',0)';
                    ctx.fillRect(x * (64/vectoren.length), y * (64/vectoren.length), 1, 1);
                } else {
                    var val = Math.floor((vectoren[x][y]) * 255 / height);
                    ctx.fillStyle = 'rgb(' + val + ',' + val + ',' + val + ')';
                    ctx.fillRect(x * (64/vectoren.length), y * (64/vectoren.length), 1, 1);
                }
            }
        }

    };

    //DRAW PLANE
    setInterval($.proxy(function() {
//		console.log(this.manager.plane);
    }, this), 50);
    
	//Cube mapping
	var urls = ["images/posx.png", "images/negx.png",
	"images/posy.png", "images/negy.png",
	"images/posz.png", "images/negz.png"];
	var materials = [];
	for(var i in urls){
		materials.push(
			new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture(urls[i]),
				side: THREE.DoubleSide,
				depthWrite: false
			})
		);
	}
	this.skybox = new THREE.Mesh( new THREE.CubeGeometry(1000, 1000, 1000), new THREE.MeshFaceMaterial( materials));
	this.manager.scene.add( this.skybox );
	this.step = function(step){
		if(manager.plane){
			this.skybox.position = this.manager.plane.position.toThree();
		}
	}
}
