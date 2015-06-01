function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.add = add;
	this.multiply = multiply;
	this.clone = clone;
	
	function add(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	};
	
	function multiply(n){
		x = this.x * n;
		y = this.y * n;
		z = this.z * n;
		return this;
	};
	
	function clone(){
		return new Vector(this.x, this.y, this.z);
	};
}