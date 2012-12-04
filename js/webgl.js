var gl;
var horizAspect = 480.0/640.0;
var shaderProgram;
var mvMatrix;
var vertexPositionAttribute;
var perspectiveMatrix;

function initRendering() {
	var canvas = document.getElementById("renderCanvas");

	initWebGL(canvas);

	if (gl) {
		gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque  
		gl.enable(gl.DEPTH_TEST);                               // Enable depth testing  
		gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things  
		gl.clear(gl.COLOR_BUFFER_BIT | 	gl.DEPTH_BUFFER_BIT);   // Clear the color as well as the depth buffer.
	}
	
	initShaders();
	
	initBuffers();
	
	drawScene();
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function initBuffers() {  
	squareVerticesBuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);  
	
	var vertices = [  
	                1.0,  1.0,  0.0,  
	                -1.0, 1.0,  0.0,  
	                1.0,  -1.0, 0.0,  
	                -1.0, -1.0, 0.0  
	                ];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);  
}

/**
 * Copied from {@link http://developer.mozilla.org/en/WebGL/Getting_started_with_WebGL}.
 * @param canvas
 */
function initWebGL(canvas) {
	// Initialize the global variable gl to null.
	gl = null;
	
	try {  
		// Try to grab the standard context. If it fails, fallback to experimental.  
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");  
	}  
	catch(e) {
		alert(e);
	}  
    
	// If we don't have a GL context, give up now  
	if (!gl) {  
		alert("Unable to initialize WebGL. Your browser may not support it.");  
	}
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function initShaders() {  
	var fragmentShader = getShader(gl, "shader-fs");  
	var vertexShader = getShader(gl, "shader-vs");  
	  
	// Create the shader program  
	  
	shaderProgram = gl.createProgram();  
	gl.attachShader(shaderProgram, vertexShader);  
	gl.attachShader(shaderProgram, fragmentShader);  
	gl.linkProgram(shaderProgram);  
	  
	// If creating the shader program failed, alert  
	  
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {  
	  alert("Unable to initialize the shader program.");  
	}  
	  
	gl.useProgram(shaderProgram);  
	  
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");  
	gl.enableVertexAttribArray(vertexPositionAttribute);  
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
        return null;
    }

    theSource = "";
    currentChild = shaderScript.firstChild;

	while(currentChild) {
    	if (currentChild.nodeType == currentChild.TEXT_NODE) {
        	theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
	}

    if (shaderScript.type == "x-shader/x-fragment") {
    	shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		// Unknown shader type
		return null;
	}

    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    	alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
        return null;
	}
        
	return shader;  
}

/**
 * Copied from {@link https://developer.mozilla.org/en/WebGL/Adding_2D_content_to_a_WebGL_context}
 */
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	perspectiveMatrix = makePerspective(45, 640.0/480.0, 0.1, 100.0);

	loadIdentity();
	mvTranslate([0.0, 0.0, -6.0]);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	
	setTimeout(drawScene, 50);
}