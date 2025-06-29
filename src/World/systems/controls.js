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

function cameraControls(camera, canvas, colliders = []) {
	// FPS-style movement with collision
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

	// Helper: player's collision box size (approximate)
	const playerBoxSize = 0.4;

	// Lock on click
	canvas.addEventListener("click", () => controls.lock());

	// Key events
	document.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "ShiftLeft":
			case "ShiftRight":
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

	// Function to check collision at a future position
	function checkCollisionAtPosition(position) {
		const playerBox = new Box3().setFromCenterAndSize(
			position,
			new Vector3(playerBoxSize, playerBoxSize, playerBoxSize)
		);

		for (const collider of colliders) {
			let box;
			// collider could be Box3 or mesh with bounding box
			if (collider.isBox3) {
				box = collider;
			} else if (collider.geometry) {
				// Mesh: get or compute bounding box in world coords
				box = new Box3().setFromObject(collider);
			} else {
				continue;
			}

			if (box.intersectsBox(playerBox)) {
				return true; // Collision detected
			}
		}
		return false; // No collision
	}

	controls.tick = (delta) => {
		velocity.x = 0;
		velocity.z = 0;
		direction.z = Number(moveForward) - Number(moveBackward);
		direction.x = Number(moveRight) - Number(moveLeft);
		direction.normalize();

		const currentSpeed = shiftPressed ? speed * 2 : speed;

		if (controls.isLocked) {
			velocity.z = direction.z * currentSpeed * delta;
			velocity.x = direction.x * currentSpeed * delta;

			// Proposed new position vectors
			const forwardVector = new Vector3();
			controls.getDirection(forwardVector); // get forward direction

			// Calculate proposed next position on XZ plane separately for smooth collision
			const newPosition = camera.position.clone();

			// Move on X axis (right/left)
			if (velocity.x !== 0) {
				const rightVector = new Vector3();
				controls.getDirection(forwardVector);
				rightVector.crossVectors(forwardVector, camera.up).normalize();

				const nextPosX = newPosition.clone().addScaledVector(rightVector, velocity.x);
				if (!checkCollisionAtPosition(nextPosX)) {
					camera.position.copy(nextPosX);
				}
			}

			// Move on Z axis (forward/back)
			if (velocity.z !== 0) {
				controls.getDirection(forwardVector);
				forwardVector.y = 0; // restrict movement to XZ plane
				forwardVector.normalize();

				const nextPosZ = newPosition.clone().addScaledVector(forwardVector, velocity.z);
				if (!checkCollisionAtPosition(nextPosZ)) {
					camera.position.copy(nextPosZ);
				}
			}

			// Lock Y position (eye height)
			camera.position.y = 1.6;
		}
	};

	return controls;
}

export { cameraControls, cameraControlsDev };
