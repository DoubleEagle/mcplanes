function plane(){
	this.position = {x:0,y:0,z:0};
	this.speed = {x:0,y:0,z:0};
	this.direction{
		pitch = {x:1,y:0,z:0};
		roll = {x:0,y:1,z:0};
		yaw = {x:0,y:0,z:1};
	};
	this.throttle = 0;
	
	function rotate(v1, v2, angle){
		t1 = {x: v1.x, y: v1.y, z: v1.z};
		t2 = {x: v2.x, y: v2.y, z: v2.z};
		t1 = t1 * math.cos(angle) +  t2 * math.sin(angle);
		t2 = t1 * math.sin(angle) +  t2 * math.cos(angle);
		v1 = t1;
		v2 = t2;
	};
	
	this.pressed = [];
	
	$(document).keydown(function(e){
		this.pressed[e.which] = true;
	});
	$(document).keyup(function(e){
		this.pressed[e.which] = false;
	});
	
	this.step = function(){
		//attitude
		//yaw
		if(this.pressed[68]){
			rotate(this.direction.roll, this.direction.pitch, .1);
		};
		if(this.pressed[65]){
			rotate(this.direction.roll, this.direction.pitch, -.1);
		};
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
	};
};