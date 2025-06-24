import { PlaneGeometry, MeshStandardMaterial, Mesh } from "three"
import { createMaterialNew } from "../util/createMeshWithTexture";


function createFloor(width, length) {
	const floorGeometry = new PlaneGeometry(width, length); 
	const woodTextureFiles = {
    albedo: 'floor/light-plank-flooring_albedo.webp',
    normal: 'floor/light-plank-flooring_normal-ogl.webp',
    metallic: 'floor/light-plank-flooring_metalic.webp', 
    ao: 'floor/light-plank-flooring_ao.webp', 
    height: 'floor/light-plank-flooring_height.webp' 
};
	// const floorMaterial = createMaterial('light-plank-flooring_albedo.png')
	// new MeshStandardMaterial({ color: 0x888888, roughness: 0.3 });
	const floorMaterial = createMaterialNew(woodTextureFiles)

	const floor = new Mesh(floorGeometry, floorMaterial);

	// Rotate the plane to lie flat on the XZ plane
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true; // Important for shadows

	return floor
}

export { createFloor }
