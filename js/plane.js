function Plane(){
	this.position = new Vector(0,0,0);
	this.speed = new Vector(0,0,0);
	this.direction = {
		pitch: new Vector(1,0,0),
		roll: new Vector(0,1,0),
		yaw: new Vector(0,0,1)
	};
	this.throttle = 0;
	
	function rotate(v1, v2, angle){
		t1 = v1.clone();
		t2 = v2.clone();
		v1 = t1.clone().multiply(Math.cos(angle)).add(t2.clone().multiply(Math.sin(angle)));
		v2 = t1.clone().multiply(Math.sin(angle)).multiply(-1).add(t2.clone().multiply(Math.cos(angle)));
	};
	
	this.pressed = [];
	
	$(document).keydown(function(e){
		this.pressed[e.which] = true;
	});
	$(document).keyup(function(e){
		this.pressed[e.which] = false;
	});
	
	this.step = function(){
		//pitch
		if(this.pressed[87]){
			rotate(this.direction.roll, this.direction.yaw, .1);
		};
		if(this.pressed[83]){
			rotate(this.direction.roll, this.direction.yaw, -.1);
		};
		
		//roll
		if(this.pressed[69]){
			rotate(this.direction.pitch, this.direction.yaw, .1);
		};
		if(this.pressed[81]){
			rotate(this.direction.pitch, this.direction.yaw, -.1);
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
		
		matrix = Matrix3(this.direction.pitch.x, this.direction.roll.x, this.direction.yaw.x,this.direction.pitch.y, this.direction.roll.y, this.direction.yaw.y,this.direction.pitch.z, this.direction.roll.z, this.direction.yaw.z);
		
		this.speed = this.direction.roll.multiply(this.throttle);
	};
};