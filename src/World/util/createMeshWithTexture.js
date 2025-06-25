import { MeshStandardMaterial, NoColorSpace, RepeatWrapping, SRGBColorSpace, TextureLoader } from "three";

const textureLoader = new TextureLoader();

function createMaterialNew(fileNames, options = {}) {
    const materialProperties = {};
    const basePath = 'assets/textures/';
    const repeat = options.repeat || [1, 1];

    const setTextureProps = (tex) => {
        tex.wrapS = tex.wrapT = RepeatWrapping;
        tex.repeat.set(repeat[0], repeat[1]);
    };

    if (fileNames.diff) {
        const tex = textureLoader.load(`${basePath}${fileNames.diff}`);
        tex.colorSpace = SRGBColorSpace;
        setTextureProps(tex);
        materialProperties.map = tex;
    }

    if (fileNames.nor_gl) {
        const tex = textureLoader.load(`${basePath}${fileNames.nor_gl}`);
        setTextureProps(tex);
        materialProperties.normalMap = tex;
    }

    if (fileNames.rough) {
        const tex = textureLoader.load(`${basePath}${fileNames.rough}`);
        tex.colorSpace = NoColorSpace;
        setTextureProps(tex);
        materialProperties.roughnessMap = tex;
        materialProperties.roughness = 1.0;
    }

    if (fileNames.metal) {
        const tex = textureLoader.load(`${basePath}${fileNames.metal}`);
        tex.colorSpace = NoColorSpace;
        setTextureProps(tex);
        materialProperties.metalnessMap = tex;
        materialProperties.metalness = 1.0;
    }

    if (fileNames.ao) {
        const tex = textureLoader.load(`${basePath}${fileNames.ao}`);
        tex.colorSpace = NoColorSpace;
        setTextureProps(tex);
        materialProperties.aoMap = tex;
        materialProperties.aoMapIntensity = 1.0;
    }

    if (fileNames.disp) {
        const tex = textureLoader.load(`${basePath}${fileNames.disp}`);
        tex.colorSpace = NoColorSpace;
        setTextureProps(tex);
        materialProperties.bumpMap = tex;
        materialProperties.bumpScale = 0.02;
    }

    if (fileNames.arm) {
        const tex = textureLoader.load(`${basePath}${fileNames.arm}`);
        tex.colorSpace = NoColorSpace;
        setTextureProps(tex);
        materialProperties.metalnessMap = tex;
        materialProperties.roughnessMap = tex;
        materialProperties.aoMap = tex;
    }

    return new MeshStandardMaterial(materialProperties);
}

export { createMaterialNew };
