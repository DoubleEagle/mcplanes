function Vector(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
	this.add = add;
	this.multiply = multiply;
	this.clone = clone;
	this.copy = copy;
	this.toThree = toThree;
	this.getLength = getLength;
	
	function add(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
		return this;
	};
	
	function multiply(n){
		this.x *= n;
		this.y *= n;
		this.z *= n;
		return this;
	};
	
	function clone(){
		return new Vector(this.x, this.y, this.z);
	};
	
	function copy(vector){
		this.x = vector.x;
		this.y = vector.y;
		this.z = vector.z;
		return this;
	}
	
	function toThree(){
		return new THREE.Vector3(this.x, this.y, this.z);
	}
	
	function getLength(){
		return Math.pow(this.x*this.x+this.y*this.y+this.z*this.z, .5);
	}
}