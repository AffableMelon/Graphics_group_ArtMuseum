import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Box3, Vector3 } from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
function cameraControlsDev(camera, canvas) {
	const control = new OrbitControls(camera, canvas);
	// control.enableDamping = true;
	// control.target.y = 1;
	control.screenSpacePanning = false;
	control.tick = () => control.update();

	return control;
}

function cameraControls(camera, canvas, wallBoundingBoxes) {
	// use this to have like fps shooter style movment can rework to add more speed on shift click
	const controls = new PointerLockControls(camera, canvas);
	camera.position.set(-4, 1.6, 5); // Eye-level start

	let moveForward = false,
		moveBackward = false;
	let moveLeft = false,
		moveRight = false;
	let shiftPressed = false;

	const velocity = new Vector3();
	const direction = new Vector3();
	const speed = 5;

	// Lock on click
	canvas.addEventListener("click", () => controls.lock());

	// Key events
	document.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "ShiftLeft":
			case "ShiftRight":
				console.log("SHIFTTTT")
				shiftPressed = true;
				break;
			case "KeyW":
				moveForward = true;
				break;
			case "KeyS":
				moveBackward = true;
				break;
			case "KeyA":
				moveLeft = true;
				break;
			case "KeyD":
				moveRight = true;
				break;
		}
	});
	document.addEventListener("keyup", (event) => {
		switch (event.code) {
			case "ShiftLeft":
			case "ShiftRight":
				shiftPressed = false;
				break;
			case "KeyW":
				moveForward = false;
				break;
			case "KeyS":
				moveBackward = false;
				break;
			case "KeyA":
				moveLeft = false;
				break;
			case "KeyD":
				moveRight = false;
				break;
		}
	});

	// const clock = new THREE.Clock();

	controls.tick = (delta) => {
		// const delta = clock.getDelta();

		velocity.x = 0;
		velocity.z = 0;
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveRight) - Number(moveLeft);
		direction.normalize();

		const currentSpeed = shiftPressed ? speed * 2 : speed;


		if (controls.isLocked) {
			velocity.z = direction.z * currentSpeed * delta;
			velocity.x = direction.x * currentSpeed * delta;

			controls.moveRight(velocity.x);
			controls.moveForward(velocity.z);

			// Optional: Lock Y position
			camera.position.y = 1.6;
		}
	};

	return controls;
}

export { cameraControls, cameraControlsDev };
