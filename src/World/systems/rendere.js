import { WebGLRenderer } from "three";

function createRenderer(scene, camera) {
	const renderer = new WebGLRenderer({ antialias: true });
	renderer.physicallyCorrectLights = true;
	// renderer.shadowMap.enabled = true;
	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});

	return renderer;
}

export { createRenderer }
