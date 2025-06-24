
import { createCamera } from "./components/camera";
import { createLights } from "./components/lights.js";
import { createScene } from "./components/scene";
import { createRenderer } from "./systems/rendere"; 
import { Resizer } from "./systems/Resizer.js";
import { Loop } from "./systems/loop.js";
import { cameraControls } from "./systems/controls.js";
import { createFloor } from "./components/floor.js";
import { CannonizedWorld } from "./systems/Cannon.js";
import { Vec3 } from "cannon-es"; // Correctly import Vec3 for Cannon.js positions
import CannonDebugger from "cannon-es-debugger";
import { Car } from "./components/Car.js";

class World {
  constructor(container) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer(this.scene, this.camera);
    this.controls = cameraControls(this.camera, this.renderer.domElement);
    this.loop = new Loop(this.camera, this.scene, this.renderer);

    container.append(this.renderer.domElement);

    const floor = createFloor(100, 100);
    floor.position.y = 0;
    const { directionalLight, ambientLight } = createLights();

    this.scene.add(floor, directionalLight, ambientLight);

    const resizer = new Resizer(this.camera, this.renderer, container);

    this.physics = new CannonizedWorld();
    this.physics.addGround(floor);

    // Initialize and add CannonDebugger to the loop for continuous updates
    this.debugger = CannonDebugger(this.scene, this.physics.world);
        this.loop.updateables.push({ tick: () => this.debugger.update() });
    

    const chassisDimensions = new Vec3(2, 0.8, 4); // width, height, length
    this.car = new Car(this.physics.world, this.scene, chassisDimensions);
    this.carVehicle = this.car.carVehicle;
    // Add Car's update() to the loop to sync visuals with physics
    this.loop.updateables.push({
      tick: () => this.car.update(),
    });

    this.setupCarControls(); // Sets up event listeners and pushes input handler to loop

    // Set the physics update function to be called by the loop
    this.loop.setPhysicsUpdater(() => this.physics.update(this.loop.deltaTime));

    // Add controls update to the loop
    this.loop.updateables.push({ tick: () => this.controls.update() });
  }

  setupCarControls() {
    const maxSteerVal = Math.PI / 8;
    const maxForce = 500; // Keep this reasonable, too high can be unstable
    const brakeForce = 30; // Increased brake force for more noticeable braking
    this.keysPressed = {};

    document.addEventListener("keydown", (event) => {
      this.keysPressed[event.key.toLowerCase()] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keysPressed[event.key.toLowerCase()] = false;
    });

    // Add the car input handler to the loop's updateables
    this.loop.updateables.push({
      tick: () => {
        this.handleCarInput(
          maxSteerVal,
          maxForce,
          brakeForce,
          this.keysPressed
        );
      },
    });
  }

  handleCarInput(maxSteerVal, maxForce, brakeForce, keysPressed) {
    const vehicle = this.carVehicle;
    if (!vehicle) return;

    let engineForce = 0;
    let steeringValue = 0;
    let currentBrakeForce = 0;

    // ALOT OF FUCKERY GOES HERE 
    const frontRightWheel = 0;
    const frontLeftWheel = 1;
    const backRightWheel = 3;
    const backLeftWheel = 2;



    if (keysPressed["w"]) {
      engineForce = -maxForce;
    } else if (keysPressed["s"]) {
      engineForce = maxForce;
    }

    if (keysPressed["a"]) {
      steeringValue = maxSteerVal; // Turn left
    } else if (keysPressed["d"]) {
      steeringValue = -maxSteerVal; // Turn right
    }

    if (keysPressed[" "]) {
      // Spacebar for brake
      currentBrakeForce = brakeForce;
    }

    // Apply engine force to rear wheels (standard RWD)
    vehicle.applyEngineForce(engineForce, backLeftWheel);
    vehicle.applyEngineForce(engineForce, backRightWheel);

    // Apply steering to front wheels
    vehicle.setSteeringValue(steeringValue, frontLeftWheel);
    vehicle.setSteeringValue(steeringValue, frontRightWheel);

    // Apply brake force to all wheels (or just the driving wheels)
    vehicle.setBrake(currentBrakeForce, frontLeftWheel);
    vehicle.setBrake(currentBrakeForce, frontRightWheel);
    vehicle.setBrake(currentBrakeForce, backLeftWheel);
    vehicle.setBrake(currentBrakeForce, backRightWheel);
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
