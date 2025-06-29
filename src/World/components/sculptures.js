import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Marble textures for pedestal
const marbleColorMap = textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Color.jpg");
const marbleNormalMap = textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_NormalGL.jpg");
const marbleRoughnessMap = textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Roughness.jpg");
const marbleDisplacementMap = textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Displacement.jpg");

const pedestalMaterial = new THREE.MeshStandardMaterial({
  map: marbleColorMap,
  normalMap: marbleNormalMap,
  roughnessMap: marbleRoughnessMap,
  displacementMap: marbleDisplacementMap,
  displacementScale: 0.005,
});

export function addSculpturesToScene(scene, raycaster) {
  const sculptures = [
    { path: "/assets/models/sculpture.glb", gx: 2, gz: 0, title: "Embrace Form",needStand: true, standScale: { height: 0.3, radius: 0.8 }, fitSize: 3, yOffset: -0.35 },
    { path: "/assets/models/horse_sculpture.glb", gx: 4, gz: 0, title: "Elegant Equine", fitSize: 3.3 },
    { path: "/assets/models/head_sculpture.glb", gx: 6, gz: 0, fitSize: 3, title: "Monolithic Face", yOffset: 0 },
    { path: "/assets/models/rusted_sculpture.glb", gx: 8, gz: 0, title: "Scrap Sentinel", fitSize: 3.5, yOffset: -0.65 },
    { path: "/assets/models/concept_lamp_sculpture.glb", gx: 1, gz: 7, title: "Grasping Light", fitSize: 3 },
    { path: "/assets/models/abstract_sculpture.glb", gx: 3, gz: 6, title: "Crystal Harmony",needStand: true, standScale: { height: 0.4, radius: 0.9 }, fitSize: 3 },
    { path: "/assets/models/sculpture_in_tenerife.glb", gx: 5, gz: 7, title: "Spiral Motion", fitSize: 2.6 },
    { path: "/assets/models/angel_sculpture.glb", gx: 7, gz: 6, title: "Guardian Angel", fitSize: 3.5 },
  ];

  const tileSize = 10;
  const defaultFitSize = 3;

  sculptures.forEach(({ path, gx, gz, needStand, standScale, title, fitSize, yOffset }) => {
    loader.load(
      path,
      (gltf) => {
        const sculpture = gltf.scene;

        sculpture.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // Compute bounding box before scaling
        const box = new THREE.Box3().setFromObject(sculpture);
        const size = new THREE.Vector3();
        box.getSize(size);

        // Scale sculpture so largest dimension equals fitSize (or default)
        const maxDimension = Math.max(size.x, size.y, size.z);
        const maxAllowed = fitSize ?? defaultFitSize;
        const scale = maxDimension > 0 ? maxAllowed / maxDimension : 1;
        sculpture.scale.setScalar(scale);

        // Recalculate bounding box after scaling
        box.setFromObject(sculpture);

        const posX = gx * tileSize - 50 + tileSize / 2;
        const posZ = gz * tileSize - 50 + tileSize / 2;

        // Calculate base Y position to sit on ground, add optional yOffset
        let posY = -box.min.y + (yOffset ?? 0);

        // Add pedestal if requested
        if (needStand) {
          const standHeight = standScale?.height ?? 0.8;
          const standRadius = standScale?.radius ?? 0.7;

          const pedestalGeo = new THREE.CylinderGeometry(
            standRadius,
            standRadius * 0.75,
            standHeight,
            64,
            8,
            false
          );

          const pedestal = new THREE.Mesh(pedestalGeo, pedestalMaterial);
          pedestal.position.set(posX, standHeight / 2, posZ);
          pedestal.castShadow = true;
          pedestal.receiveShadow = true;
          scene.add(pedestal);

          posY += standHeight;
        }

        sculpture.position.set(posX, posY, posZ);

        sculpture.traverse((child) => {
          if (child.isMesh) {
            child.userData.title = title || "Untitled Sculpture";
            if (raycaster) raycaster.addInteractive(child);
          }
        });

        scene.add(sculpture);

        // Spotlight
        const spotHeight = 5;
        const light = new THREE.SpotLight(0xffffff, 1.5, 10, Math.PI / 6, 0.2);
        light.position.set(posX, posY + spotHeight, posZ);
        light.target.position.set(posX, posY + size.y / 2, posZ);
        scene.add(light);
        scene.add(light.target);

        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.bias = -0.0005;
      },
      undefined,
      (error) => {
        console.error(`Error loading sculpture ${path}`, error);
      }
    );
  });
}
