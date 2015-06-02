function Environment(manager) {

    manager.load('models/cloud.json', function(cloud) {
        cloud.position.x = 5;
        cloud.position.y = 10;
        cloud.position.z = 10;
        cloud.material = new THREE.MeshPhongMaterial(
                {color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
        );

    });

    manager.load('models/cloud.json', function(cloud) {
        cloud.position.x = 5;
        cloud.position.y = -40;
        cloud.position.z = 10;
        cloud.material = new THREE.MeshPhongMaterial(
                {color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
        );

    });

    manager.load('models/cloud.json', function(cloud) {
        cloud.position.x = -20;
        cloud.position.y = -30;
        cloud.position.z = 10;
        cloud.material = new THREE.MeshPhongMaterial(
                {color: 0xFFFFFF, transparent: true, opacity: 0.5, specular: 0xFFFFFF, shininess: 8}
        );

    });

    var geometry = new THREE.PlaneGeometry(200, 200);
    
    var texture = THREE.ImageUtils.loadTexture('images/grass.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(60,60);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide, map: texture});
    
    var plane = new THREE.Mesh(geometry, material);
    plane.position.z = -50;
    
    
    manager.scene.add(plane);

}