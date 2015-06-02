function Plane(plane, camera){
	this.position = new Vector(0,0,0);
	this.speed = new Vector(0,0,0);
	this.direction = {
		pitch: new Vector(-1,0,0),
		roll: new Vector(0,-1,0),
		yaw: new Vector(0,0,1)
	};
	this.direction.pitch.name = 'pitch';
	this.direction.roll.name = 'roll';
	this.direction.yaw.name = 'yaw';
	this.throttle = 0;
	this.plane = plane;
	this.camera = camera;
	this.lastMatrix = new THREE.Matrix3();
	
	function rotate(v1, v2, angle){
		t1 = v1.clone();
		t2 = v2.clone();
		v1.copy(t1.clone().multiply(Math.cos(angle)).add(t2.clone().multiply(Math.sin(angle))));
		v2.copy(t1.clone().multiply(Math.sin(angle)).multiply(-1).add(t2.clone().multiply(Math.cos(angle))));
	};
	
	this.pressed = [];
	
	$(document).keydown($.proxy(function(e){
		this.pressed[e.which] = true;
	},this));
	$(document).keyup($.proxy(function(e){
		this.pressed[e.which] = false;
	},this));
	
	this.step = function(){
		
		//pitch
		if(this.pressed[87]){
			rotate(this.direction.roll, this.direction.yaw, -.1);
		};
		if(this.pressed[83]){
			rotate(this.direction.roll, this.direction.yaw, .1);
		};
		
		//roll
		if(this.pressed[69]){
			rotate(this.direction.pitch, this.direction.yaw, -.1);
		};
		if(this.pressed[81]){
			rotate(this.direction.pitch, this.direction.yaw, .1);
		};
		
		//yaw
		if(this.pressed[68]){
			rotate(this.direction.roll, this.direction.pitch, .1);
		};
		if(this.pressed[65]){
			rotate(this.direction.roll, this.direction.pitch, -.1);
		};
		
		//throttle
		if(this.pressed[16]){
			if(this.throttle < 100){
				this.throttle += 1;
			};
		};
		if(this.pressed[17]){
			if(this.throttle > 0){
				this.throttle -= 1;
			};
		};
		
		matrix = new THREE.Matrix3();
		matrix.set(this.direction.pitch.x, this.direction.roll.x, this.direction.yaw.x, this.direction.pitch.y, this.direction.roll.y, this.direction.yaw.y, this.direction.pitch.z, this.direction.roll.z, this.direction.yaw.z);
		
		this.plane.geometry.applyMatrix(matrix.to4().multiply(this.lastMatrix.inverse().to4()));
		this.plane.geometry.verticesNeedUpdate = true;
		
		this.lastMatrix = matrix;
		
		this.speed = this.direction.roll.clone().multiply(this.throttle);
		this.position = this.position.add(this.speed.multiply(.01));
		this.plane.position = this.position;
		
		var camRotation = new THREE.Matrix4();
		camRotation.set(this.direction.pitch.x, this.direction.yaw.x, -this.direction.roll.x, 0, this.direction.pitch.y, this.direction.yaw.y, -this.direction.roll.y, 0, this.direction.pitch.z, this.direction.yaw.z, -this.direction.roll.z, 0, 0, 0, 0, 1);
		
		this.camera.position = this.position.clone().add(this.direction.roll.clone().multiply(-10)).add(this.direction.yaw.clone().multiply(3)).toThree();
		this.camera.rotation.setEulerFromRotationMatrix(camRotation, 'XYZ');
	};
};