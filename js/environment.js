function Environment(manager) {

    manager.load('models/cloud.json', function(geometry) {
        var material = new THREE.MeshPhongMaterial(
                {color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
        );
        var mesh = new THREE.Mesh(geometry, material);
        manager.scene.add(mesh);

    });

    var geometry = new THREE.PlaneGeometry(200, 200);
    var texture = THREE.ImageUtils.loadTexture('images/grass.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(60, 60);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, map: texture});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.z = -50;
//    manager.scene.add(plane);


    vectoren = [[-200, -200], [-200]];
    for (i = 0; i < 8; i++) {
        var temp = [];
        for (j = 0; j < (Math.pow(2, i + 1) + 1); j++) {
            temp[j] = [];
        }
        for (j in vectoren) {
            for (k in vectoren[j]) {
                temp[j * 2][k * 2] = vectoren[j][k];
            }
        }
        for (x = 0; x < (Math.pow(2, i + 1) + 1); x++) {
            for (y = 0; y + x < (Math.pow(2, i + 1) + 1); y++) {
                if (y % 2 !== 0 || x % 2 !== 0) {
                    var dx = 0, dy = 0;
                    if (x % 2 !== 0) {
                        dx = 1;
                    }
                    if (y % 2 !== 0) {
                        dy = 1;
                    }
                    temp[x][y] = (temp[x + dx][y - dy] + temp[x - dx][y + dy]) / 2 + (Math.random() - .5) * Math.pow(2, 10 - i) / 3;
                }
            }
        }
        vectoren = temp;
    }

    var normal = new THREE.Vector3(0, 1, 0);
    var color = new THREE.Color(0xffaa00);
    var face = new THREE.Face3(0, 1, 2, normal, color, 0);
    scale = 1600 / (vectoren.length - 1);
    positionX = -400;
    positionY = 400;
    var geometry = new THREE.Geometry();
    var indices = [];

    for (var x = 0; x < vectoren.length; x++) {
        indices[x] = [];
        for (var y = 0; y < vectoren[x].length; y++) {
            indices[x][y] = geometry.vertices.length;
//            console.log(geometry.vertices.length);
            geometry.vertices.push(new THREE.Vector3(x * scale+positionX, y * scale+positionY, vectoren[x][y]));
        }
    }
    for (var x = 0; x < vectoren.length; x++) {
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
    geometry.mergeVertices();
    geometry.computeVertexNormals();
    var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({shading: THREE.SmoothShading}));
    manager.scene.add(mesh);


    var light = new THREE.AmbientLight(0x404040); // soft white light
    manager.scene.add(light);
}