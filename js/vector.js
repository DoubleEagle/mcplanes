function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.add = add;
	this.multiply = multiply;
	this.clone = clone;
	this.copy = copy;
	
	function add(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	};
	
	function multiply(n){
		this.x = this.x * n;
		this.y = this.y * n;
		this.z = this.z * n;
		return this;
	};
	
	function clone(){
		return new Vector(this.x, this.y, this.z);
	};
	
	function copy(vector){
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
	}
}