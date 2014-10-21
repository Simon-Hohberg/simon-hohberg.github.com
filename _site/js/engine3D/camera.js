
var mouseSens = 5;

function Camera() {
    this.distNear = 1;
    this.distFar  = 100;
    this.hOpeningAngle = degToRad(60);
    this.n = Vector.create([-1, 0, 0]);
    this.position = Vector.create([0, 0, 0]);
    
    this.calculate = function () {
        this.sizeX    = Math.tan(this.hOpeningAngle/2) * this.distNear * 2;
        this.sizeY    = this.sizeX * (canvasHeight/canvasWidth);
        this.u        = this.n.cross(Vector.create([0, 0, -1]));
        this.v        = this.n.cross(this.u);
        this.A        = joinVectors(this.u.toUnitVector(), this.v.toUnitVector(), this.n.toUnitVector()).transpose();
        this.x        = this.A.map(function(e) {return -e;}).multiply(this.position);
        this.C        = Matrix.create([[this.A.e(1,1), this.A.e(1,2), this.A.e(1,3), this.x.e(1)],
                                   [this.A.e(2,1), this.A.e(2,2), this.A.e(2,3), this.x.e(2)],
                                   [this.A.e(3,1), this.A.e(3,2), this.A.e(3,3), this.x.e(3)],
                                   [       0,        0,        0,      1]]);
        //assuming H is in the center => right + left = 0, top + bottom = 0
        this.NDC      = Matrix.create([[(2.0*this.distNear)/this.sizeX,               0,                                      0,                                        0],
                                   [              0, (2.0*this.distNear)/this.sizeY,                                      0,                                        0],
                                   [              0,                0, -(this.distFar+this.distNear)/(this.distFar-this.distNear), (-2.0*this.distNear*this.distFar)/(this.distFar - this.distNear)],
                                   [              0,                0,                                     -1,                                        0]]);
        this.F = this.NDC.multiply(this.C);
        this.Finv = this.F.inverse();
    };
    
    this.setPosition = function (vector) {
        this.position = vector;
        this.calculate();
    };
    
    this.calculate();
}

Camera.prototype.transform = function (vector) {
    return this.F.multiply(vector);
};

Camera.prototype.detransform = function (vector) {
    return this.Finv.multiply(vector);
};

Camera.prototype.setMouse = function (deltaX, deltaY) {
    var angleX = (deltaX / canvasWidth) * mouseSens;
    var angleY = (deltaY / canvasHeight) * mouseSens;
    if (deltaX == 0.0 && deltaY == 0.0)
        return;
    var radX = degToRad(angleX);
    var radY = degToRad(angleY);
    var rot = rotZ(radX).multiply(rotAroundAxis(this.u, radY));
    var homN = toHomogeneous(this.n);
    homN = rot.multiply(homN);
    this.n = toCartesian(homN);
    this.calculate();
};
