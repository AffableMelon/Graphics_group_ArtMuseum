import { AmbientLight, DirectionalLight, DirectionalLightHelper, HemisphereLight, MathUtils, PointLight, SpotLight } from "three";


function createLights() {
	const ambientLight = new HemisphereLight(0xffffff, 0x444444, 0.4); 

	const fillLight = new DirectionalLight(0xffffff, 0.3);
	fillLight.position.set(5, 10, 5);
	fillLight.castShadow = false;

	const keyLight = new DirectionalLight(0xffffff, 0.8);
	keyLight.position.set(-10, 10, -10);
	keyLight.castShadow = true;
	keyLight.shadow.mapSize.set(2048, 2048);
	const shadowSize = 20;
	keyLight.shadow.camera.left = -shadowSize;
	keyLight.shadow.camera.right = shadowSize;
	keyLight.shadow.camera.top = shadowSize;
	keyLight.shadow.camera.bottom = -shadowSize;

	return {
		ambientLight,
		keyLight,
		fillLight
	};
}

export { createLights };


