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
	
	this.step = function(){
		this.position = this.position + this.speed;
		
		$(document).keydown(function(e){
			
			//attitude
			//yaw
			if(e.which == 68){
				rotate(this.direction.roll, this.direction.pitch, .1);
			};
			if(e.which == 65){
				rotate(this.direction.roll, this.direction.pitch, -.1);
			};
			//pitch
			if(e.which == 87){
				rotate(this.direction.roll, this.direction.yaw, .1);
			};
			if(e.which == 83){
				rotate(this.direction.roll, this.direction.yaw, -.1);
			};
			//roll
			if(e.which == 69){
				rotate(this.direction.pitch, this.direction.yaw, .1);
			};
			if(e.which == 81){
				rotate(this.direction.pitch, this.direction.yaw, -.1);
			};
			
			//throttle
			if(e.which == 16){
				if(this.throttle < 100){
					this.throttle += 1;
				};
			};
			if(e.which == 17){
				if(this.throttle > 0){
					this.throttle -= 1;
				};
			};
			
		});	
	};
};