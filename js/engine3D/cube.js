
function Cube(size, position) {
    var self = this;
    //initially there is no transformation
    this.transform = Matrix.Diagonal([1,1,1,1]);
    
    //add homogenous coordinate if necessary
    if (position.dimensions() == 3)
        this.position = Vector.create([position.e(1), position.e(2), position.e(3), 1]);
    else
        this.position = position;
    
    this.size = size;   //edge length
    
    this.edges = new Array(12);
    var v0 = Vector.create([-self.size/2, -self.size/2, -self.size/2, 1]);
    var v1 = Vector.create([ self.size/2, -self.size/2, -self.size/2, 1]);
    var v2 = Vector.create([ self.size/2,  self.size/2, -self.size/2, 1]);
    var v3 = Vector.create([ self.size/2,  self.size/2,  self.size/2, 1]);
    var v4 = Vector.create([-self.size/2,  self.size/2,  self.size/2, 1]);
    var v5 = Vector.create([ self.size/2, -self.size/2,  self.size/2, 1]);
    var v6 = Vector.create([-self.size/2,  self.size/2, -self.size/2, 1]);
    var v7 = Vector.create([-self.size/2, -self.size/2,  self.size/2, 1]);

    this.edges[0]  = [v0, v6];
    this.edges[1]  = [v0, v7];
    this.edges[2]  = [v0, v1];
    
    this.edges[3]  = [v4, v6];
    this.edges[4]  = [v4, v3];
    this.edges[5]  = [v4, v7];
    
    this.edges[6]  = [v5, v3];
    this.edges[7]  = [v5, v7];
    this.edges[8]  = [v5, v1];
    
    this.edges[9]  = [v2, v6];
    this.edges[10] = [v2, v3];
    this.edges[11] = [v2, v1];
    
    //returns the edges for the transformed and translated cube
    this.getEdges = function() {
        
        //apply transformation and translation
        return this.edges.map(function (e) { return e.map(function (v) { return self.transform.multiply(v).add(self.position); })});
    };
    
    this.rotateX = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotX(rad));
    };
    
    this.rotateY = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotY(rad));
    };
    
    this.rotateZ = function(degrees) {
        var rad = degToRad(degrees);
        this.transform = this.transform.multiply(rotZ(rad));
    };
}
