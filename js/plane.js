function Plane(plane, camera, environment){
	this.position = new Vector(0,0,300);
	this.speed = new Vector(0,0,0);
	this.direction = {
		pitch: new Vector(1,0,0),
		roll: new Vector(0,1,0),
		yaw: new Vector(0,0,1)
	};
	this.direction.pitch.name = 'pitch';
	this.direction.roll.name = 'roll';
	this.direction.yaw.name = 'yaw';
	this.throttle = 1;
	this.plane = plane;
	this.camera = camera;
	this.lastMatrix = new THREE.Matrix3();
	this.a = -10;
	this.b = 3;
	this.plane.material.materials[1].opacity = .2;
	this.g = new Vector(0,0,-9.80665);
	this.lift = new Vector(0,0,0);
	this.verticalLift = new Vector(0,0,0);
	this.maxthrust = 10;
	this.cl = .1;
	this.cvl = .05;
	this.cd = .0001;
	this.main = false;
	this.pitchAuthority = 1;
	this.rollAuthority = 2;
	this.yawAuthority = .2;
	this.counter = 0;
	this.drag = new Vector(0,0,0);
	this.lift = new Vector(0,0,0);
	this.fres = new Vector(0,0,0);
	this.fresmax = 0;
	this.speedmax = 0;
	this.zeroThrustAltitude = 18000;
	this.p0 = 1;
	this.scaleHeight = 7640;
	this.environment = environment;
	
	function rotate(v1, v2, angle){
		t1 = v1.clone();
		t2 = v2.clone();
		v1.copy(t1.clone().multiply(Math.cos(angle)).add(t2.clone().multiply(Math.sin(angle))));
		v2.copy(t1.clone().multiply(Math.sin(angle)).multiply(-1).add(t2.clone().multiply(Math.cos(angle))));
	};
	
	this.calcflareright = function(){
		if(this.plane.modelName == 'models/plane01.json'){
			return this.position.clone().add(this.direction.pitch.clone().multiply(2.6).add(this.direction.roll.clone().multiply(-0.2))).toThree();
		}
		if(this.plane.modelName == 'models/plane02.2.json'){
			return this.position.clone().add(this.direction.pitch.clone().multiply(3.6).add(this.direction.roll.clone().multiply(-2.2))).toThree();
		}
	};
	this.calcflareleft = function(){
		if(this.plane.modelName == 'models/plane01.json'){
			return this.position.clone().add(this.direction.pitch.clone().multiply(-2.6).add(this.direction.roll.clone().multiply(-0.2))).toThree();
		}
		if(this.plane.modelName == 'models/plane02.2.json'){
			return this.position.clone().add(this.direction.pitch.clone().multiply(-3.6).add(this.direction.roll.clone().multiply(-2.2))).toThree();
		}
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
	
	var material = new THREE.LineBasicMaterial({
		color: 0xffffff,
	});
	this.geometryright = new THREE.Geometry();
	this.geometryleft = new THREE.Geometry();
	for(i=0; i<300; i++){
		this.geometryright.vertices.push(this.calcflareright());
		this.geometryleft.vertices.push(this.calcflareleft());
	}
	var lineright = new THREE.Line(this.geometryright, material);
	var lineleft = new THREE.Line(this.geometryleft, material);
	manager.scene.add(lineright);
	manager.scene.add(lineleft);
	
	this.step = function(step){
		if(step > 50){
			step = 50;
		}
		if(this.environment.vectors[Math.round((this.position.x+3200)/this.environment.scale)] && this.position.z < this.environment.vectors[Math.round((this.position.x+3200)/this.environment.scale)][Math.round((this.position.y+3200)/this.environment.scale)]){console.log("You're dead!")};
		
		//pitch
		if(this.pressed[87]){
			rotate(this.direction.roll, this.direction.yaw, -this.pitchAuthority*step/1000);
		};
		if(this.pressed[83]){
			rotate(this.direction.roll, this.direction.yaw, this.pitchAuthority*step/1000);
		};
		//roll
		if(this.pressed[69]){
			rotate(this.direction.pitch, this.direction.yaw, -this.rollAuthority*step/1000);
		};
		if(this.pressed[81]){
			rotate(this.direction.pitch, this.direction.yaw, this.rollAuthority*step/1000);
		};
		//yaw
		if(this.pressed[68]){
			rotate(this.direction.roll, this.direction.pitch, this.yawAuthority*step/1000);
		};
		if(this.pressed[65]){
			rotate(this.direction.roll, this.direction.pitch, -this.yawAuthority*step/1000);
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
		
		this.pressure = this.p0 * Math.exp(-this.position.z / this.scaleHeight);
		
		this.speed = this.speed.add(this.fres.clone().multiply(step/1000));
		
		this.lift = this.direction.yaw.clone().multiply(Math.pow(this.speed.getLength(), 2)*Math.sin(Math.acos(this.speed.clone().normalize().x * this.direction.yaw.x + this.speed.clone().normalize().y * this.direction.yaw.y + this.speed.clone().normalize().z * this.direction.yaw.z)-Math.PI/2)*this.pressure*this.cl);
		
		this.verticalLift = this.direction.pitch.clone().multiply(Math.pow(this.speed.getLength(), 2)*Math.sin(Math.acos(this.speed.clone().normalize().x * this.direction.pitch.x + this.speed.clone().normalize().y * this.direction.pitch.y + this.speed.clone().normalize().z * this.direction.pitch.z)-Math.PI/2)*this.pressure*this.cvl);
		
		// rotate(this.direction.roll, this.direction.pitch, (Math.acos(this.speed.clone().normalize().x * this.direction.pitch.x + this.speed.clone().normalize().y * this.direction.pitch.y + this.speed.clone().normalize().z * this.direction.pitch.z)-Math.PI/2)*step/1000);
		
		// rotate(this.direction.yaw, this.direction.roll, (Math.acos(this.speed.clone().normalize().x * this.direction.yaw.x + this.speed.clone().normalize().y * this.direction.yaw.y + this.speed.clone().normalize().z * this.direction.yaw.z)-Math.PI/2)*step/1000);
		
		if(this.position.z < this.zeroThrustAltitude){
			this.thrust = this.direction.roll.clone().multiply(this.maxthrust*this.throttle*(1-this.position.z/this.zeroThrustAltitude));
		}
		else{this.thrust = new Vector(0,0,0)}
		
		this.drag = this.speed.clone().multiply(this.speed.clone().getLength()*-1*this.pressure*this.cd);
		
		this.fres = this.lift.clone().add(this.g.clone()).add(this.thrust.clone()).add(this.drag.clone()).add(this.verticalLift.clone());
		
		this.position = this.position.add(this.speed.clone().multiply(step/1000));
		this.plane.position = this.position;
		var camRotation = new THREE.Matrix4();
		camRotation.set(this.direction.pitch.x, this.direction.yaw.x, -this.direction.roll.x, 0, this.direction.pitch.y, this.direction.yaw.y, -this.direction.roll.y, 0, this.direction.pitch.z, this.direction.yaw.z, -this.direction.roll.z, 0, 0, 0, 0, 1);
		
		//camera controls
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
		
		if(this.fres.clone().getLength() > this.fresmax){
			this.fresmax = this.fres.clone().getLength();
		};
		
		if(this.speed.clone().getLength() > this.speedmax){
			this.speedmax = this.speed.clone().getLength();
		};
		
		this.counter += 1;
		if(this.counter == 4){
			this.counter = 0;
			if(this.main){
				$("div.info").html(
					"fps: " + Math.round(100000/step)/100 + "<br>" +
					"airspeed (m/s): " + Math.round(this.speed.getLength()*100)/100 + "<br>" +
					"altitude (m): " + Math.round((this.position.z)*100)/100 + "<br>" +
					"throttle (%): " + Math.round(this.throttle * 10000)/100 + "<br>" +
					"horizontal speed (m/s):   " + (Math.round(Math.pow(this.speed.x * this.speed.x + this.speed.y * this.speed.y, .5)*100)/100) + "<br>" +
					"vertical speed (m/s):   " + (Math.round(this.speed.z*100)/100) + '<br>' +
					"position (m): ("+Math.round(this.position.x)+', '+Math.round(this.position.y)+', '+Math.round(this.position.z)+')' + "<br>" +
					"g-force (g): " + Math.round(this.fres.getLength()/9.81*100)/100 + "<br>" +
					"Max g-force (g): " + Math.round(this.fresmax/9.81*100)/100 + "<br>" +
					"Max speed (m/s): " + Math.round(this.speedmax*100)/100
				);
			}
		}
		else{
			$('.player-list [data-id="'+this.id+'"] span').html('('+Math.round(this.position.x)+', '+Math.round(this.position.y)+', '+Math.round(this.position.z)+')');
		}
		
		//flares draw
		this.geometryright.vertices.push(this.calcflareright());
		this.geometryleft.vertices.push(this.calcflareleft());
		this.geometryright.verticesNeedUpdate = true;
		this.geometryleft.verticesNeedUpdate = true;
		this.geometryright.vertices.shift();
		this.geometryleft.vertices.shift();
		
		//sliders
		if (this.main){
			$('.slider-left').css('top', ( 70 + this.direction.roll.z * 20)+'%');
			$('.slider-right').css('top', ( 70 + this.direction.roll.z * 20)+'%');
			$('.slider-top').css('left', ( 50 + this.direction.pitch.z * 20)+'%');
		};
		
		if(this.main){console.log(
			// this.direction.roll.getLength()
			// this.speed.clone().normalize().getLength()
			// this.speed.clone().normalize()
			// this.speed.clone().normalize().x * this.direction.roll.x + this.speed.clone().normalize().y * this.direction.roll.y + this.speed.clone().normalize().z * this.direction.roll.z
			// Math.sin(Math.acos(this.speed.clone().normalize().x * this.direction.roll.x + this.speed.clone().normalize().y * this.direction.roll.y + this.speed.clone().normalize().z * this.direction.roll.z)*180/Math.PI)
			// this.lift
			// "step: ", step,
			// "speed: ", this.speed.getLength(),
			// "g: ", this.g.getLength(),
			// "thrust: ", Math.round(this.thrust.getLength()*1000000000)/1000000000,
			// "drag: ", Math.round(this.drag.getLength()*1000000000)/1000000000,
			// "lift: ", Math.round(this.lift.getLength()*1000000000)/1000000000,
			// "verticalLift: ", Math.round(this.verticalLift.getLength()*1000000000)/1000000000,
			// "fres: ", this.fres.getLength()
			// "pressure: ", Math.round(this.pressure*1000000000)/1000000000
			// this.speed
			// this.direction.roll
			// this.speed.clone().normalize().x * this.direction.roll.x + this.speed.clone().normalize().y * this.direction.roll.y + this.speed.clone().normalize().z * this.direction.roll.z
			// this.direction.roll
			// (Math.acos(this.speed.clone().normalize().x * this.direction.yaw.x + this.speed.clone().normalize().y * this.direction.yaw.y + this.speed.clone().normalize().z * this.direction.yaw.z)-Math.PI/2)*180/Math.PI
			// (this.verticalLift.clone().normalize().x * this.direction.roll.x + this.verticalLift.clone().normalize().y * this.direction.roll.y + this.verticalLift.clone().normalize().z * this.direction.roll.z)
			// "vertical aoa:",(Math.acos(this.speed.clone().normalize().x * this.direction.pitch.x + this.speed.clone().normalize().y * this.direction.pitch.y + this.speed.clone().normalize().z * this.direction.pitch.z)-Math.PI/2)*180/Math.PI
			// Math.round((this.position.x+3200)/this.environment.scale)
		)};
	};
	
	this.output = function(){
		return {
			direction: this.direction,
			position: this.position,
			speed: this.speed,
			pressed: this.pressed,
			throttle: this.throttle
		};
	}
	
	this.input = function(data){
		if(data != undefined){
			for(var i in data.direction){
				for(var j in data.direction[i]){
					this.direction[i][j] = data.direction[i][j];
				}
			}
			for(var i in data.speed){
				this.speed[i] = data.speed[i];
			}
			for(var i in data.position){
				this.position[i] = data.position[i];
			}
			this.pressed = data.pressed;
			this.throttle = data.throttle;
		}
	}
};