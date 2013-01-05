
width = 800
height = 600

scene = null
renderer = null
camera = null
controls = null
zmesh = null
mouseX = 0
mouseY = 0

robot = null

i = 0

document.addEventListener  'mousemove', onDocumentMouseMove, false

onDocumentMouseMove = (event) ->
    mouseX = event.clientX - width/2
    mouseY = event.clientY - height/2

init = ->
    canvas = document.getElementById 'robotCanvas'
    renderer = new THREE.WebGLRenderer()
    renderer.setSize width, height
    renderer.domElement.id = 'robotCanvas'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.border = 'solid'
    renderer.domElement.style.top = '150px'
    renderer.domElement.style.left = '50px'
    document.body.appendChild renderer.domElement
    
    scene = new THREE.Scene()
    robot = new Robot()
    robot.loadRdf 'js/rdf/robot2012/Robot2012.js', robotInitCallback

test = ->
	joint1 = robot.joints[1]
	joint2 = robot.joints[2]
	
#	joint1.sceneNode.position.set 0, 0, 0
#	joint2.sceneNode.position.set 0, 0, 0
	
	scene.add joint2.sceneNode

robotInitCallback = ->
    
    # ambient light
    ambient = new THREE.AmbientLight( 0xffffff )
    scene.add ambient
            
    # direct lights
    directionalLight = new THREE.DirectionalLight 0xffeedd, 0.6
    directionalLight.position.set( 0, 10, 10 ).normalize()
    scene.add directionalLight
    
    directionalLight = new THREE.DirectionalLight 0xffeedd, 0.6
    directionalLight.position.set( 0, -10, 10 ).normalize()
    scene.add directionalLight
    
    directionalLight = new THREE.DirectionalLight 0xffeedd, 0.3
    directionalLight.position.set( 10, 0, 10 ).normalize()
    scene.add directionalLight
    
    directionalLight = new THREE.DirectionalLight 0xffeedd, 0.3
    directionalLight.position.set( -10, 0, 10 ).normalize()
    scene.add directionalLight
    
    camera = new THREE.PerspectiveCamera( 35, 800 / 600, 0.1, 10000 )
    camera.position.set 0, 0, 10
    camera.lookAt 0, 0, 0
    scene.add camera
    
    # controls
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.target.set 0, 0, 0
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 1.2
    controls.panSpeed = 0.8
    controls.noZoom = false
    controls.noPan = false
    controls.staticMoving = true
    controls.dynamicDampingFactor = 0.3
    # keys "A", "S", "D"
    controls.keys = [ 65, 83, 68 ]
    controls.addEventListener( 'change', render )
    
#    test()
    
    animate()

render = ->
    renderer.render scene, camera

# animation loop
animate = ->
    robot.joints[1].rotate 0.1 * i
    i++
    requestAnimationFrame animate
    controls.update()
    render()
