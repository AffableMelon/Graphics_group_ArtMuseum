import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Marble textures for pedestal
const pedestalMaterial = new THREE.MeshStandardMaterial({
  map: textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Color.jpg"),
  normalMap: textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_NormalGL.jpg"),
  roughnessMap: textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Roughness.jpg"),
  displacementMap: textureLoader.load("/assets/textures/stand/Marble014_1K-JPG_Displacement.jpg"),
  displacementScale: 0.005,
});

export function addSculpturesToScene(scene, raycaster) {
  const sculptures = [
    { path: "/assets/models/sculpture.glb", gx: 2, gz: 0, title: "Embrace Form", needStand: true, standScale: { height: 0.3, radius: 0.8 }, fitSize: 3, yOffset: -0.35 },
    { path: "/assets/models/horse_sculpture.glb", gx: 4, gz: 0, title: "Elegant Equine", fitSize: 3.3 },
    { path: "/assets/models/head_sculpture.glb", gx: 6, gz: 0, fitSize: 3, title: "Monolithic Face", yOffset: 0 },
    { path: "/assets/models/rusted_sculpture.glb", gx: 8, gz: 0, title: "Scrap Sentinel", fitSize: 3.5, yOffset: -0.65 },
    { path: "/assets/models/concept_lamp_sculpture.glb", gx: 1, gz: 7, title: "Grasping Light", fitSize: 3 },
    { path: "/assets/models/abstract_sculpture.glb", gx: 3, gz: 6, title: "Crystal Harmony", needStand: true, standScale: { height: 0.4, radius: 0.9 }, fitSize: 3 },
    { path: "/assets/models/sculpture_in_tenerife.glb", gx: 5, gz: 7, title: "Spiral Motion", fitSize: 2.6 },
    { path: "/assets/models/angel_sculpture.glb", gx: 7, gz: 6, title: "Guardian Angel", fitSize: 3.5 },
  ];

  const tileSize = 10;
  const defaultFitSize = 3;

  const group = new THREE.Group();
  scene.add(group);

  // Helper to load a single sculpture
  function loadSculpture(sculptureData) {
    return new Promise((resolve, reject) => {
      loader.load(
        sculptureData.path,
        (gltf) => {
          const sculpture = gltf.scene;

          sculpture.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Bounding box and scaling
          const box = new THREE.Box3().setFromObject(sculpture);
          const size = new THREE.Vector3();
          box.getSize(size);

          const maxDimension = Math.max(size.x, size.y, size.z);
          const maxAllowed = sculptureData.fitSize ?? defaultFitSize;
          const scale = maxDimension > 0 ? maxAllowed / maxDimension : 1;
          sculpture.scale.setScalar(scale);

          // Recalculate bounding box after scaling
          box.setFromObject(sculpture);

          const posX = sculptureData.gx * tileSize - 50 + tileSize / 2;
          const posZ = sculptureData.gz * tileSize - 50 + tileSize / 2;
          let posY = -box.min.y + (sculptureData.yOffset ?? 0);

          // Add pedestal if needed
          if (sculptureData.needStand) {
            const standHeight = sculptureData.standScale?.height ?? 0.8;
            const standRadius = sculptureData.standScale?.radius ?? 0.7;

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

          // Mark meshes interactive for raycaster
          sculpture.traverse((child) => {
            if (child.isMesh) {
              child.userData.title = sculptureData.title || "Untitled Sculpture";
              if (raycaster) raycaster.addInteractive(child);
            }
          });

          group.add(sculpture);

          // Add spotlight above sculpture
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

          resolve(sculpture);
        },
        undefined,
        (error) => {
          console.error(`Error loading sculpture ${sculptureData.path}`, error);
          reject(error);
        }
      );
    });
  }

  // Return a promise that resolves when all sculptures are loaded
  return Promise.all(sculptures.map(loadSculpture)).then(() => group);
}
