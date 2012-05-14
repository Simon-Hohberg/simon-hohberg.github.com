
var mouseSens = 2.5;

function Camera() {
    this.distNear = 6;
    this.distFar  = 14;
    this.hOpeningAngle = degToRad(30);
    this.n = Vector.create([-1, 0, 0]);
    this.position = Vector.create([0, 0, 0]);
    
    this.calculate = function () {
        this.sizeX    = Math.tan(this.hOpeningAngle/2) * this.distNear * 2;
        this.sizeY    = this.sizeX * (4/6);
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
    }
    
    this.setPosition = function (vector) {
        this.position = vector;
        this.calculate();
    }
    
    this.calculate();
}

function joinVectors() {
    var args = joinVectors.arguments;
    //assuming all vectors have the same dimension
    var rows = args[0].dimensions();
    var cols = args.length;
    var arr = new Array(rows);

    for (var i = 0; i < args.length; i++) {
        var vec = args[i];
        for (var j = 0; j < rows; j++) {
            if (typeof arr[j] == "undefined")
                arr[j] = new Array(cols);
            arr[j][i] = vec.e(j+1);
        }
    }
    return Matrix.create(arr);
}

Camera.prototype.transform = function (vector) {
    return this.F.multiply(vector);
}

Camera.prototype.setMouse = function (mouseX, mouseY) {
    var deltaX = (mouseX - canvasWidth/2) / canvasWidth;
    var deltaY = (mouseY - canvasHeight/2) / canvasHeight;
    if (deltaX == 0 && deltaY == 0)
        return;
    var angleX = Math.pow(deltaX * mouseSens, 6) * sign(deltaX);
    var angleY = Math.pow(deltaY * mouseSens, 6) * -sign(deltaY);
    var radX = degToRad(angleX);
    var radY = degToRad(angleY);
    var rot = rotZ(radX).multiply(rotY(radY));
    var homN = toHomogeneous(this.n);
    homN = rot.multiply(homN);
    this.n = toCartesian(homN);
    this.calculate();
}
