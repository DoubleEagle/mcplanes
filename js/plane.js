function Plane(plane, camera){
	this.position = new Vector(0,0,0);
	this.speed = new Vector(0,0,0);
	this.direction = {
		pitch: new Vector(1,0,0),
		roll: new Vector(0,1,0),
		yaw: new Vector(0,0,1)
	};
	this.direction.pitch.name = 'pitch';
	this.direction.roll.name = 'roll';
	this.direction.yaw.name = 'yaw';
	this.throttle = 0;
	this.plane = plane;
	this.camera = camera;
	this.lastMatrix = new THREE.Matrix3();
	this.a = -10;
	this.b = 0.7;
	this.plane.material.materials[1].opacity = .2;
	this.g = new Vector(0,0,0);
	this.lift = new Vector(0,0,0);
	this.maxthrust = 20;
	this.cl = .6;
	this.cd = .05;
	this.main = false;
	
	function rotate(v1, v2, angle){
		t1 = v1.clone();
		t2 = v2.clone();
		v1.copy(t1.clone().multiply(Math.cos(angle)).add(t2.clone().multiply(Math.sin(angle))));
		v2.copy(t1.clone().multiply(Math.sin(angle)).multiply(-1).add(t2.clone().multiply(Math.cos(angle))));
	};
	
	this.pressed = [];
	
	$(document).keydown($.proxy(function(e){
		if(this.main){
			this.pressed[e.which] = true;
		}
	},this));
	$(document).keyup($.proxy(function(e){
		if(this.main){
			this.pressed[e.which] = false;
		}
	},this));
	
	this.step = function(step){
		//pitch
		if(this.pressed[87]){
			rotate(this.direction.roll, this.direction.yaw, -1*step/1000);
		};
		if(this.pressed[83]){
			rotate(this.direction.roll, this.direction.yaw, 1*step/1000);
		};
		
		//roll
		if(this.pressed[69]){
			rotate(this.direction.pitch, this.direction.yaw, -2*step/1000);
		};
		if(this.pressed[81]){
			rotate(this.direction.pitch, this.direction.yaw, 2*step/1000);
		};
		
		//yaw
		if(this.pressed[68]){
			rotate(this.direction.roll, this.direction.pitch, .2*step/1000);
		};
		if(this.pressed[65]){
			rotate(this.direction.roll, this.direction.pitch, -.2*step/1000);
		};
		
		//throttle
		if(this.pressed[82]){
			if(this.throttle < 1){
				this.throttle += .01;
			};
		};
		if(this.pressed[70]){
			if(this.throttle > 0){
				this.throttle -= .01;
			};
		};
		
		matrix = new THREE.Matrix3();
		matrix.set(this.direction.pitch.x, this.direction.roll.x, this.direction.yaw.x, this.direction.pitch.y, this.direction.roll.y, this.direction.yaw.y, this.direction.pitch.z, this.direction.roll.z, this.direction.yaw.z);
		
		this.plane.geometry.applyMatrix(matrix.to4().multiply(this.lastMatrix.inverse().to4()));
		this.plane.geometry.verticesNeedUpdate = true;
		
		this.lastMatrix = matrix;
		
		this.lift = this.direction.yaw.clone().multiply(this.speed.getLength()*this.cl);
		this.g.z = -9.81;
		this.thrust = this.direction.roll.clone().multiply(this.maxthrust*this.throttle);
		this.drag = this.speed.clone().multiply(this.speed.clone().getLength()*-1*this.cd);
		this.fres = this.lift.clone().add(this.g.clone()).add(this.thrust.clone()).add(this.drag.clone());
		
		this.speed = this.speed.add(this.fres.multiply(step/1000));
		this.position = this.position.add(this.speed.clone().multiply(step/1000));
		this.plane.position = this.position;
		// console.log(this.drag);
		// console.log(this.lift);
		// console.log(this.speed);
		var camRotation = new THREE.Matrix4();
		camRotation.set(this.direction.pitch.x, this.direction.yaw.x, -this.direction.roll.x, 0, this.direction.pitch.y, this.direction.yaw.y, -this.direction.roll.y, 0, this.direction.pitch.z, this.direction.yaw.z, -this.direction.roll.z, 0, 0, 0, 0, 1);
		
		this.camera.position = this.position.clone().add(this.direction.roll.clone().multiply(this.a)).add(this.direction.yaw.clone().multiply(this.b)).toThree();
		if(this.pressed[38]){
			this.a -= .1;
		}
			if(this.pressed[40]){
			this.a += .1;
		}

		if(this.pressed[37]){
			this.b += .1;
		}
		if(this.pressed[39]){
			this.b -= .1;
		}
		this.camera.rotation.setEulerFromRotationMatrix(camRotation, 'XYZ');
		
		console.log(this.speed.getLength());
		console.log(this.position.z);
	};
};