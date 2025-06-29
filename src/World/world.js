import { createCamera } from "./components/camera";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene";
import { createRenderer } from "./systems/rendere";
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/loop.js";
import { cameraControls } from "./systems/controls.js";
import { createFloor } from "./components/floor.js";
import { TextureLoader, Vector3, Box3 } from "three";
import { createWalls } from "./components/walls.js";
import { createGridHelper, showLoadingOverlay } from "./components/helpers.js";
import { decorateWallWithArtAndLights } from "./components/add2Dart.js";
import { Raycast } from "./systems/Raycast.js";
import { addSculpturesToScene } from "./components/sculptures.js";
import { initColliders } from "./systems/Collision.js";

class World {
  constructor(container) {
    this.container = container;
    this.staticMeshes = [];

    // Set up camera, scene, renderer
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer(this.scene, this.camera);
    container.append(this.renderer.domElement);

    // Loaders and utilities
    this.textureLoader = new TextureLoader();
    this.raycaster = new Raycast(this.camera, this.scene, this.renderer.domElement);

    // Add floor and grid
    const floor = createFloor(100, 100);
    floor.position.y = 0;
    const gridHelper = createGridHelper();
    this.scene.add(floor, gridHelper);

    // Add lights
    const { keyLight, fillLight, ambientLight } = createLights();
    this.scene.add(keyLight, fillLight, ambientLight);

    // Add walls and optional art
    const { wallsGroup } = createWalls();
    this.scene.add(wallsGroup);

    wallsGroup.children.forEach((wall) => {
      this.staticMeshes.push(wall);

      // Optional decoration:
      // const size = new Vector3();
      // new Box3().setFromObject(wall).getSize(size);
      // if (Math.max(size.x, size.z) > 10) {
      //   decorateWallWithArtAndLights(this.scene, wall, this.textureLoader, this.raycaster);
      // }
    });

    // Loop setup
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.loop.updateables.push(this.raycaster);

    // Resizing
    new Resizer(this.camera, this.renderer, container);

    // Load sculptures and finish setup
    this.initSculpturesAndControls();
  }

  async initSculpturesAndControls() {
    const sculpturesGroup = await addSculpturesToScene(this.scene, this.raycaster);
    showLoadingOverlay(true);
    // Helper: collect all meshes recursively
    function flattenMeshes(obj) {
      const meshes = [];
      obj.traverse((child) => {
        if (child.isMesh) meshes.push(child);
      });
      return meshes;
    }

    const sculptureMeshes = flattenMeshes(sculpturesGroup);
    sculptureMeshes.forEach((mesh) => this.staticMeshes.push(mesh));

    // Initialize collision detection with all static meshes
    initColliders(this.staticMeshes, this.scene, false);

    // Initialize controls after collision objects are ready
    this.controls = cameraControls(this.camera, this.renderer.domElement, this.staticMeshes);
    this.loop.updateables.push(this.controls);
    showLoadingOverlay(false);
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
