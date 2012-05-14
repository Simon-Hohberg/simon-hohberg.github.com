var camera = new Camera();
var canvas;
var context;
var rotation = 5;
var cube;
var canvasWidth = 600;
var canvasHeight = 400;
var mouseX = canvasWidth/2;
var mouseY = canvasHeight/2;
var forward = false;
var backward = false;
var left = false;
var right = false;

function initRender(canvasID) {
    canvas = document.getElementById(canvasID);
    canvas.onmousemove = getMousePosition;
    document.onkeydown = keyDown;
    document.onkeyup = keyUp;
    context = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setTimeout(render, 50);
    var cubePos = Vector.create([10, 0, 0]);
    cube = new Cube(2, cubePos);
}

function render() {

    camera.setMouse(mouseX, mouseY);

    if (forward) {
        camera.setPosition(camera.position.add(camera.n.map(function (e) { return -e; })));
    } else if (backward) {
        camera.setPosition(camera.position.add(camera.n));
    }
    
    if (left) {
        camera.setPosition(camera.position.add(camera.u.map(function (e) { return -e; })));
    } else if (right) {
        camera.setPosition(camera.position.add(camera.u));
    }

    camera.setMouse(mouseX, mouseY);
    context.clearRect(0, 0, canvas.width, canvas.height);
    //cube.rotateY(rotation);
    //cube.rotateX(rotation);
    //cube.rotateZ(rotation);
    var edges = cube.getEdges();
    for (var i = 0; i < edges.length; i++) {
        renderEdge(edges[i], context);
    }
    setTimeout(render, 50);
}

function renderEdge(edge, context) {
    var v0 = toCartesian(camera.transform(edge[0]));
    var v1 = toCartesian(camera.transform(edge[1]));
    //console.log(v0.inspect());
    //console.log(vectorToString(v1));
    context.beginPath();
    var x0 = Math.round( (canvasWidth/2) * v0.e(1) + canvasWidth/2 );
    var y0 = Math.round( (canvasHeight/2) * v0.e(2) + canvasHeight/2 ) ;
    var x1 = Math.round( (canvasWidth/2) * v1.e(1) + canvasWidth/2 );
    var y1 = Math.round( (canvasHeight/2) * v1.e(2) + canvasHeight/2 );
    //console.log(x0 + ", " + y0);
    //console.log(x1 + ", " + y1);
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
}

function getMousePosition(event) {
    if (event.offsetY) {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    } else if (event.layerY) {
        mouseX = event.layerX;
        mouseY = event.layerY;
    }
}

function keyDown(event) {
    if (event.keyCode == 87)
        forward = true;
    else if (event.keyCode == 83)
        backward = true;
    else if (event.keyCode == 65)
        left = true;
    else if (event.keyCode == 68)
        right = true;
}

function keyUp(event) {
    if (event.keyCode == 87)
        forward = false;
    else if (event.keyCode == 83)
        backward = false;
    else if (event.keyCode == 65)
        left = false;
    else if (event.keyCode == 68)
        right = false;
}
