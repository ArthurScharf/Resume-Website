import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



/*
TODO: Do some math research/practice to figure out how to rotate
the cube into position

bShow = false intiiaally.
Once we manipulate the cube once, we'll begin showing faces.
*/



/*
 Controls: left-click + drag for rotation
           right-click + drag for movement
*/

// Creates a scene object and a camera object
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0x120821);
const camera = new THREE.PerspectiveCamera(75, (window.innerWidth*2) / window.innerHeight, 0.1, 1000);



// Creates a renderer object, set's it's size, and appends it to the DOM as a child
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight / 2);
document.getElementById("scene_container").appendChild(renderer.domElement);




// Create a single point light and add it to the scene
const light = new THREE.PointLight(0xffffff, 10, 100);
light.position.set(camera.position.x, camera.position.y, camera.position.z);
scene.add(light);




// Create texture loader
const loader = new THREE.TextureLoader();


// Creates a cube with 6 faces to be textured differently. Defines a default texture
const defaultTex = loader.load('public/cardboard.jpg');
const faceTex = loader.load('public/face.jpg');
const cube = new THREE.Mesh(
	new THREE.BoxGeometry(2, 2, 2),
	[
		new THREE.MeshPhongMaterial({ map: faceTex }),
		new THREE.MeshPhongMaterial({ map: defaultTex }),
		new THREE.MeshPhongMaterial({ map: defaultTex }),
		new THREE.MeshPhongMaterial({ map: defaultTex }),
		new THREE.MeshPhongMaterial({ map: defaultTex }),
		new THREE.MeshPhongMaterial({ map: defaultTex }),
	]
);
scene.add(cube);



// ----- Creates controls ----- //
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // cube should stay centered
controls.enableZoom = false;
controls.enableDamping = true;
controls.rotateSpeed = 0.3;
controls.minPolarAngle = Math.PI * (1 / 4);
controls.maxPolarAngle = Math.PI * (3 / 4);
camera.position.set(1.8, 1.8, 1.8);
controls.update(); // must be called after any changes to the camera's transform




/* ----- Event Listeners ----- 
* I use lambda's here because I believe it's more succinct
*/
addEventListener('resize', (event) => { 
	/*
	resizing aspect ratio and updating projection matrix.
	Without this, the camera will continue to calculate geometry position relative to the camera
	as if the canvas were at the same size. This sill distort the image
	*/
	camera.aspect = (window.innerWidth *2)/ (window.innerHeight);
	camera.updateProjectionMatrix(); // This step is key to avoid distortion

	// Resizing renderer
	renderer.setSize(window.innerWidth , window.innerHeight / 2);
});










// -- Debugging Lines -- //
const red_X = new THREE.LineBasicMaterial({
	color: 0xff0000
})
const blue_Y = new THREE.LineBasicMaterial({
	color: 0x0000ff
})
const green_Z = new THREE.LineBasicMaterial({
	color: 0x00ff00
})

var points = [];
points.push(new THREE.Vector3(0, 0, 0));

var vec;
var geometry;
var line;

// red_x
vec = new THREE.Vector3(2, 0, 0);
points.push(vec);
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, red_X);
scene.add(line);

// blue_y
vec = new THREE.Vector3(0, 2, 0);
points[1] = vec;
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, blue_Y);
scene.add(line);


// green_z
vec = new THREE.Vector3(0, 0, 2);
points[1] = vec;
geometry = new THREE.BufferGeometry().setFromPoints(points);
line = new THREE.Line(geometry, green_Z);
scene.add(line);





let bAutoRotate = true;

controls.addEventListener('start', () => {
	bAutoRotate = false;
});

controls.addEventListener('end', () => {
	bAutoRotate = true;
});




/* Figure out which of the 4 possible angles we're closest to.
   Render text based on which angle we've chosen
*/

let cameraFacing = new THREE.Vector3(0, 0, 0);
let dot = 0;

// ----- Main Loop ----- //
renderer.setAnimationLoop(
	() => {
		light.position.set(camera.position.x, camera.position.y, camera.position.z);


		// ---- Auto rotating to nearest face ---- //
		if (bAutoRotate) {
			camera.getWorldDirection(cameraFacing);
			cameraFacing.y = 0; // projection into XZ-Plane
			cameraFacing.normalize();
			cameraFacing.multiplyScalar(-1); // Want the camera facing vector to be colinear with which face is closest

			// console.log(cameraFacing);
			
			dot = cameraFacing.dot(new THREE.Vector3(1, 0, 0)); // + x-axis
			console.log(dot);
			if (dot >= (Math.PI / 4)) { // We're closest to x-axis
				console.log(" x");
			}
			else if (dot <= -(Math.PI / 4)) { // still positive but closest to z-axis
				console.log(" -x");
			}
			dot = cameraFacing.dot(new THREE.Vector3(0, 0, 1));
			if (dot >= (Math.PI / 4)) { 
				console.log(" z");
			}
			else if (dot <= -(Math.PI / 4)) { // Must be closest to -z
				console.log("-z")
			}

		}


		// TODO: Consider passing delta time here so things don't get weird
		controls.update(); // controls.enableDamping == true so this must be here

		renderer.render(scene, camera);
	}
);

