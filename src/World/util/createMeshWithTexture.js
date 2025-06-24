import { MeshStandardMaterial, NoColorSpace, SRGBColorSpace, TextureLoader } from "three";

const textureLoader = new TextureLoader();

// function createMaterial(texture_path) {

// 	const texture = textureLoader.load(`assets/textures/${texture_path}`)
// 	console.log("loaded texture is: ", texture)
// 	texture.colorSpace = SRGBColorSpace;


// 	const material = new MeshStandardMaterial({ map: texture });

// 	return material;

// }

function createMaterialNew(fileNames){
    const materialProperties = {};
	const basePath = 'assets/textures/'
	 if (fileNames.albedo) {
        const albedoTexture = textureLoader.load(`${basePath}${fileNames.albedo}`);
        albedoTexture.colorSpace = SRGBColorSpace;
        materialProperties.map = albedoTexture;
    }

    if (fileNames.normal) {
        const normalTexture = textureLoader.load(`${basePath}${fileNames.normal}`);
        materialProperties.normalMap = normalTexture;
    }

    // Roughness Map (grayscale data)
    if (fileNames.roughness) {
        const roughnessTexture = textureLoader.load(`${basePath}${fileNames.roughness}`);
        roughnessTexture.colorSpace = NoColorSpace;
        materialProperties.roughnessMap = roughnessTexture;
        materialProperties.roughness = 1.0;
    }

    // Metallic Map (grayscale data)
    if (fileNames.metallic) {
        const metallicTexture = textureLoader.load(`${basePath}${fileNames.metallic}`);
        metallicTexture.colorSpace = NoColorSpace; // Data texture
        materialProperties.metalnessMap = metallicTexture;
        materialProperties.metalness = 1.0; 
    }

    // Ambient Occlusion Map (grayscale data)
    if (fileNames.ao) {
        const aoTexture = textureLoader.load(`${basePath}${fileNames.ao}`);
        aoTexture.colorSpace = NoColorSpace; // Data texture
        materialProperties.aoMap = aoTexture;
        materialProperties.aoMapIntensity = 1.0; 
    }

    // Height Map (for Bump or Displacement)
    if (fileNames.height) {
        const heightTexture = textureLoader.load(`${basePath}${fileNames.height}`);
        heightTexture.colorSpace = NoColorSpace; 
        materialProperties.bumpMap = heightTexture;
        materialProperties.bumpScale = 0.02; // intensity
    }

    const material = new MeshStandardMaterial(materialProperties);
    return material;
}


export { createMaterialNew };
