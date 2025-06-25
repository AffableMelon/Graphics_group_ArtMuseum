import { PerspectiveCamera, Vector3 } from "three";


function createCamera() {
	const camera = new PerspectiveCamera(
		35, // fov
		1, // aspect ratio
		0.1, // near clipping
		100000, //far clipping
	);

	camera.position.set(0, 30, 20);
	camera.autoRotate = false;
	camera.rotationSpeed = 0.05;
	camera.rotationTarget = new Vector3(0, 0, 0);
	let orbitAngle = 0; // in radians
	const orbitSpeed = 0.15; // radians per second
	const orbitRadius = 10; // fixed distance from origin

	camera.tick = (delta) => {
		orbitAngle += orbitSpeed * delta; // advance angle based on delta

		// Update position on XYZ plane
		camera.position.x = Math.cos(orbitAngle) * orbitRadius;
		camera.position.y = Math.abs(Math.sin(orbitAngle)) * orbitRadius;
		camera.position.z = Math.sin(orbitAngle) * (orbitRadius) * 5;

		camera.lookAt(0, 0, 0); // always look at the center
	};

	return camera;
}

export { createCamera };
