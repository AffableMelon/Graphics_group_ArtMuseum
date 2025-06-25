import { createCamera } from "./components/camera";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene";
import { createRenderer } from "./systems/rendere";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/loop.js";
import { cameraControls, cameraControlsDev } from "./systems/controls.js";
import { createFloor } from "./components/floor.js";
import { TextureLoader } from "three";
import { createWalls } from "./components/walls.js";
import { createGridHelper } from "./components/helpers.js";
import { createCentralStructures } from "./components/insideBlock.js";
import { Box3, Vector3 } from "three/webgpu";
import { decorateWallWithArtAndLights } from "./components/add2Dart.js";

// let wallBoundingBoxes = []
let textureLoader;
class World {
  constructor(container) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer(this.scene, this.camera);
    this.textureLoader = new TextureLoader();

    const { wallsGroup, wallBoundingBoxes } = createWalls();

    // this.controls = cameraControlsDev(this.camera, this.renderer.domElement);
    this.controls = cameraControls(this.camera, this.renderer.domElement, wallBoundingBoxes);
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    container.append(this.renderer.domElement);

    // const floor = createFloor(40, 20);
    const floor = createFloor(100, 100);
    // const walkin = createCentralStructures();
    // const walkin2 = createCentralStructures();
    floor.position.y = 0;
    const helper = createGridHelper();
    this.scene.add(helper);
    const { keyLight, fillLight, ambientLight } = createLights();

    for (const wall of wallsGroup.children) {
      const size = new Vector3();
      new Box3().setFromObject(wall).getSize(size);

      if (Math.max(size.x, size.z) > 15) {
        decorateWallWithArtAndLights(this.scene, wall,this.textureLoader, {
          maxArtPieces: 3,
          artTextureURL: "https://placehold.co/512x512?text=Art",
        });
      }
    }

    this.scene.add(floor, keyLight, fillLight, ambientLight);
    // walkin.position.set(-12, 0, -8);
    // walkin2.rotation.y = Math.PI;
    // walkin2.position.set(-16, 0, 8);

    this.loop.updateables.push(this.controls);
    // this.scene.add(walkin, walkin2)

    const resizer = new Resizer(this.camera, this.renderer, container);

    this.scene.add(wallsGroup);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  // Getters for instance properties
  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }
}

export { World };
