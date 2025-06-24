import { AmbientLight, DirectionalLight, DirectionalLightHelper, HemisphereLight, MathUtils, PointLight, SpotLight } from "three";


function createLights() {
	const radius = 10;
	const height = 10;
	const directionalLight = new DirectionalLight(0xffffff, 1);
	const ambientLight = new HemisphereLight(0xB1E1FF, 0xB97A20, 2,)
	// const directionLightHelper = new DirectionalLightHelper(directionalLight);

	// directionalLight.add(directionLightHelper)
	directionalLight.position.set(5, 10, 0);
	directionalLight.target.position.set(0, 0, 0)
	directionalLight.castShadow = true;
	directionalLight.shadow.mapSize.width = 1024; // Default is 512
    directionalLight.shadow.mapSize.height = 1024; // Default is 512

	// directionalLight.position.set(radius,height,10);
	//	light.target.position.set(10,0,0)
const shadowMapSize = 10; // Adjust this value to fit your scene content
    directionalLight.shadow.camera.left = -shadowMapSize;
    directionalLight.shadow.camera.right = shadowMapSize;
    directionalLight.shadow.camera.top = shadowMapSize;
    directionalLight.shadow.camera.bottom = -shadowMapSize;

	directionalLight.radius = radius;
	directionalLight.height = height;
	directionalLight.angle = 0;
	directionalLight.speed = MathUtils.degToRad(15);
	directionalLight.userData.isPaused = false


directionalLight.tick = function(delta) {
    if (this.userData.isPaused) {
        return;
    }

    if (this.userData.animationTime === undefined) {
        this.userData.animationTime = 0;
    }

    this.userData.animationTime += delta;

    const t = this.userData.animationTime;

    this.angle = this.angle ?? 0;
    this.speed = this.speed ?? 1;
    this.radius = this.radius ?? 10;
    this.height = this.height ?? 5;

    this.angle += delta * this.speed;

    this.position.x = this.radius * Math.cos(this.angle);
    this.position.z = this.radius * Math.sin(this.angle);
    this.position.y = this.height;
};
	return { directionalLight, ambientLight };
}

export { createLights };


