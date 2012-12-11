// Generated by CoffeeScript 1.3.3
var animate, camera, controls, height, init, mouseX, mouseY, onDocumentMouseMove, render, renderer, robot, scene, width, zmesh;

width = 800;

height = 600;

scene = null;

renderer = null;

camera = null;

controls = null;

zmesh = null;

mouseX = 0;

mouseY = 0;

robot = null;

document.addEventListener('mousemove', onDocumentMouseMove, false);

onDocumentMouseMove = function(event) {
  mouseX = event.clientX - width / 2;
  return mouseY = event.clientY - height / 2;
};

init = function() {
  var ambient, canvas, directionalLight;
  robot = new Robot('js/rdf/robot2012/Robot2012.js');
  canvas = document.getElementById('robotCanvas');
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.domElement.id = 'robotCanvas';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '150px';
  renderer.domElement.style.left = '50px';
  document.body.appendChild(renderer.domElement);
  scene = new THREE.Scene();
  ambient = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambient);
  directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, -70, 100).normalize();
  scene.add(directionalLight);
  camera = new THREE.PerspectiveCamera(35, 800 / 600, 0.1, 10000);
  camera.position.set(0, 0, 50);
  camera.lookAt(scene.position);
  scene.add(camera);
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  controls.keys = [65, 83, 68];
  return controls.addEventListener('change', render);
};

render = function() {
  return renderer.render(scene, camera);
};

animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  return render();
};
