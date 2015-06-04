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
                    ctx.fillRect(x * (64 / vectoren.length), y * (64 / vectoren.length), 1, 1);
                } else {
                    var val = Math.floor((vectoren[x][y]) * 255 / height);
                    ctx.fillStyle = 'rgb(' + val + ',' + val + ',' + val + ')';
                    ctx.fillRect(x * (64 / vectoren.length), y * (64 / vectoren.length), 1, 1);
                }
            }
        }
        //DRAW PLANE
        setInterval($.proxy(function() {
            var c = document.getElementsByClassName('heightmap_overlay')[0];
            var ctx = c.getContext("2d");
//            ctx.clearRect(64,64,0,0);
            console.log(this.manager.plane.position);
            ctx.fillStyle = 'rgb(255,0,0)';
            ctx.fillRect(this.manager.plane.position.x * (64 / vectoren.length), this.manager.plane.position.y * (64 / vectoren.length), 2, 2);
        }, this), 50);

    };

    //DRAW PLANE
//    setInterval($.proxy(function() {
//        console.log(this.manager.plane);
//    }, this), 50);
    
    //Cube mapping
    //  var urls = ["images/posx.png", "images/negx.png",
    //	"images/posy.png", "images/negy.png",
    //	"images/posz.png", "images/negz.png"];
    //  var textureCube = THREE.ImageUtils.loadTextureCube(urls);
    //	var shader = THREE.ShaderLib["cube"];
    //	var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
    //	uniforms['tCube'].texture= textureCube;
    //	var skyboxmaterial = new THREE.ShaderMaterial({
    //		fragmentShader: shader.fragmentShader,
    //		vertexShader: shader.vertexShader,
    //		uniforms: uniforms
    //	});
    //	var skyboxgeometry = new THREE.CubeGeometry(100000, 100000, 100000, 1, 1, 1, null, true);
    //	var skyboxMesh = new THREE.Mesh(skyboxgeometry, skyboxmaterial);
    //	manager.scene.add(skyboxMesh);
}
