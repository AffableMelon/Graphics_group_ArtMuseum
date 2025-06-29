import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const loader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// Load marble texture once
const marbleTexture = textureLoader.load("/assets/textures/marble_diff.jpg");
marbleTexture.wrapS = marbleTexture.wrapT = THREE.RepeatWrapping;
marbleTexture.repeat.set(2, 1);

export function addSculpturesToScene(scene) {
  const sculptures = [
    {
      path: "/assets/models/abstract_sculpture.glb",
      gx: 2,
      gz: 0,
      needStand: true,
      standScale: { height: 1, radius: 0.6 },
    },
    {
      path: "/assets/models/abstract_sculpture.glb",
      gx: 4,
      gz: 0,
      needStand: false,
    },
    {
      path: "/assets/models/abstract_sculpture.glb",
      gx: 6,
      gz: 0,
      needStand: true,
      standScale: { height: 0.6, radius: 0.4 },
    },
    {
      path: "/assets/models/abstract_sculpture.glb",
      gx: 8,
      gz: 0,
      needStand: false,
    },
    {
      path: "/assets/models/sculpture_in_tenerife.glb",
      gx: 1,
      gz: 7,
      needStand: false,
      standScale: { height: 0.9, radius: 0.5 },
    },
    {
      path: "/assets/models/sculpture_in_tenerife.glb",
      gx: 3,
      gz: 6,
      needStand: false,
    },
    {
      path: "/assets/models/sculpture_in_tenerife.glb",
      gx: 5,
      gz: 7,
      standScale: { height: 1.5, radius: 0.7 },
    },
    {
      path: "/assets/models/sculpture_in_tenerife.glb",
      gx: 7,
      gz: 7,
      needStand: true,
    },
  ];

  const tileSize = 10;
  const maxSize = 3;

  sculptures.forEach(({ path, gx, gz, needStand, standScale }) => {
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

        const box = new THREE.Box3().setFromObject(sculpture);
        const size = new THREE.Vector3();
        box.getSize(size);

        const largest = Math.max(size.x, size.y, size.z);
        const scale = largest > maxSize ? maxSize / largest : 1;
        sculpture.scale.setScalar(scale);

        box.setFromObject(sculpture);
        const posX = gx * tileSize - 50 + tileSize / 2;
        const posZ = gz * tileSize - 50 + tileSize / 2;
        let posY = -box.min.y;

        if (needStand) {
          const standHeight = standScale?.height ?? 0.8;
          const standRadius = standScale?.radius ?? 0.7;

          const pedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(standRadius, standRadius * 0.75, standHeight, 32),
            new THREE.MeshStandardMaterial({ map: marbleTexture })
          );
          pedestal.position.set(posX, standHeight / 2, posZ);
          pedestal.castShadow = true;
          pedestal.receiveShadow = true;
          scene.add(pedestal);

          posY += standHeight;
        }

        sculpture.position.set(posX, posY, posZ);
        scene.add(sculpture);

        // SpotLight for each sculpture
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
