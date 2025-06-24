import { Body, Box, RaycastVehicle, Vec3 } from "cannon-es";
import { BoxGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from "three";



class Car {
    constructor(world, scene, chassisDimensions, startPosition = new Vec3(0, 5, 0)) {
        this.world = world;
        this.scene = scene;
        this.chassisDimensions = chassisDimensions;

        this.createCarPhysics(chassisDimensions, startPosition); // Pass chassisDimensions here
        this.createCarMesh();
        this.scene.add(this.meshGroup);

        // Store wheel indices for steering
        this.frontLeftWheelIndex = 1; // Based on your current addWheel order
        this.frontRightWheelIndex = 2; // Based on your current addWheel order

        this.maxSteerVal = 0.5; // Maximum steering angle in radians (e.g., ~28 degrees)
        this.engineForce = 0;
        this.breakingForce = 0;
    }


    createCarPhysics(chassisDimensions, startPosition = new Vec3(0, 5, 0)) {
    const chassisShape = new Box(new Vec3(chassisDimensions.x , chassisDimensions.y / 2, chassisDimensions.z / 4));
    const chassisBody = new Body({
        mass: 150,
        // material: this.carMaterial,
        position: startPosition,
    });
    chassisBody.addShape(chassisShape);

   
    // chassisBody.quaternion.setFromEuler(0, -Math.PI / 2, 0); // Rotate -90 degrees around Y

    this.world.addBody(chassisBody);
    this.carChassisBody = chassisBody;

    const vehicle = new RaycastVehicle({ chassisBody: chassisBody });

 const wheelOptions = {
          radius: 0.5,
          directionLocal: new Vec3(0, -1, 0),
          suspensionStiffness: 30,
          suspensionRestLength: 0.3,
          frictionSlip: 2.4,
          dampingRelaxation: 2.3,
          dampingCompression: 2.4,
          maxSuspensionForce: 100000,
          rollInfluence: 0.3,
          axleLocal: new Vec3(0, 0, 1),
          chassisConnectionPointLocal: new Vec3(-1, 0, 1),
          maxSuspensionTravel: 0.3,
          customSlidingRotationalSpeed: -30,
          useCustomSlidingRotationalSpeed: true,
        }
        wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(1, 0, 1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(1, 0, -1)
        vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(this.world);
    this.carVehicle = vehicle;
    return {
        chassisBody: chassisBody,
        vehicle: vehicle
    };
}
    
    createCarMesh() {
        const { x, y, z } = this.chassisDimensions;

        this.meshGroup = new Group();

        // Chassis mesh
        const chassisGeometry = new BoxGeometry(x*2 , y, z /2);
        const chassisMaterial = new MeshStandardMaterial({ color: 0xff0000 });
        const chassisMesh = new Mesh(chassisGeometry, chassisMaterial);
        this.meshGroup.add(chassisMesh);
        this.chassisMesh = chassisMesh;

        // Wheel mesh setup
        const wheelRadius = 0.5;
        const wheelGeometry = new CylinderGeometry(wheelRadius, wheelRadius, 0.3, 16);
  wheelGeometry.rotateX(-Math.PI / 2);

        const wheelMaterial = new MeshStandardMaterial({ color: 0x333333 });

        this.wheelMeshes = [];

        for (let i = 0; i < 4; i++) {
            const mesh = new Mesh(wheelGeometry, wheelMaterial);
            // mesh.rotation.z = Math.PI / 2;
            this.meshGroup.add(mesh);
            this.wheelMeshes.push(mesh);
        }
    }

    // New method for handling steering input
    steer(direction) {
        let steerValue = 0;
        if (direction === 'left') {
            steerValue = this.maxSteerVal;
        } else if (direction === 'right') {
            steerValue = -this.maxSteerVal;
        }

        this.carVehicle.setSteeringValue(steerValue, this.frontLeftWheelIndex);
        this.carVehicle.setSteeringValue(steerValue, this.frontRightWheelIndex);
    }

    // New methods for handling acceleration/braking
    applyEngineForce(force) {
        this.engineForce = force;
        // Apply force to rear wheels (or all if 4WD)
        this.carVehicle.applyEngineForce(this.engineForce, 0); // Rear Left
        this.carVehicle.applyEngineForce(this.engineForce, 3); // Rear Right
    }

    setBrake(force) {
        this.breakingForce = force;
        // Apply brake force to all wheels for simplicity
        this.carVehicle.setBrake(this.breakingForce, 0);
        this.carVehicle.setBrake(this.breakingForce, 1);
        this.carVehicle.setBrake(this.breakingForce, 2);
        this.carVehicle.setBrake(this.breakingForce, 3);
    }

    update() {
        // Sync chassis
        this.chassisMesh.position.copy(this.carChassisBody.position);
        this.chassisMesh.quaternion.copy(this.carChassisBody.quaternion);

        // Sync wheels
        for (let i = 0; i < this.carVehicle.wheelInfos.length; i++) {
            this.carVehicle.updateWheelTransform(i);
            const t = this.carVehicle.wheelInfos[i].worldTransform;
            this.wheelMeshes[i].position.copy(t.position);
            this.wheelMeshes[i].quaternion.copy(t.quaternion);
        }
    }
}

// export { Car }

class Car1 {
    constructor(world, scene, chassisDimensions, startPosition = new  Vec3(0, 5, 0)) {
        this.world = world;
        this.scene = scene;
        this.chassisDimensions = chassisDimensions;

        this.createCarPhysics(startPosition);
        this.createCarMesh();
        this.scene.add(this.meshGroup);
    }

    createCarPhysics(chassisDimensions, startPosition = new Vec3(0, 5, 0)) {
    const chassisShape = new Box(new Vec3(chassisDimensions.x , chassisDimensions.y / 2, chassisDimensions.z / 4));
    const chassisBody = new Body({
        mass: 150,
        // material: this.carMaterial,
        position: startPosition,
    });
    chassisBody.addShape(chassisShape);

   
    // chassisBody.quaternion.setFromEuler(0, -Math.PI / 2, 0); // Rotate -90 degrees around Y

    this.world.addBody(chassisBody);
    this.carChassisBody = chassisBody;

    const vehicle = new RaycastVehicle({ chassisBody: chassisBody });

 const wheelOptions = {
          radius: 0.5,
          directionLocal: new Vec3(0, -1, 0),
          suspensionStiffness: 30,
          suspensionRestLength: 0.3,
          frictionSlip: 2.4,
          dampingRelaxation: 2.3,
          dampingCompression: 2.4,
          maxSuspensionForce: 100000,
          rollInfluence: 0.3,
          axleLocal: new Vec3(0, 0, 1),
          chassisConnectionPointLocal: new Vec3(-1, 0, 1),
          maxSuspensionTravel: 0.3,
          customSlidingRotationalSpeed: -30,
          useCustomSlidingRotationalSpeed: true,
        }
        wheelOptions.chassisConnectionPointLocal.set(-1, 0, -1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(-1, 0, 1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(1, 0, 1)
        vehicle.addWheel(wheelOptions)

        wheelOptions.chassisConnectionPointLocal.set(1, 0, -1)
        vehicle.addWheel(wheelOptions)

    vehicle.addToWorld(this.world);
    this.carVehicle = vehicle;
    return {
        chassisBody: chassisBody,
        vehicle: vehicle
    };
}
    createCarMesh() {
        const { x, y, z } = this.chassisDimensions;

        this.meshGroup = new Group();

        // Chassis mesh
        const chassisGeometry = new BoxGeometry(x*2 , y, z /2);
        const chassisMaterial = new MeshStandardMaterial({ color: 0xff0000 });
        const chassisMesh = new Mesh(chassisGeometry, chassisMaterial);
        this.meshGroup.add(chassisMesh);
        this.chassisMesh = chassisMesh;

        // Wheel mesh setup
        const wheelRadius = 0.5;
        const wheelGeometry = new CylinderGeometry(wheelRadius, wheelRadius, 0.3, 16);
  wheelGeometry.rotateX(-Math.PI / 2);

        const wheelMaterial = new MeshStandardMaterial({ color: 0x333333 });

        this.wheelMeshes = [];

        for (let i = 0; i < 4; i++) {
            const mesh = new Mesh(wheelGeometry, wheelMaterial);
            // mesh.rotation.z = Math.PI / 2;
            this.meshGroup.add(mesh);
            this.wheelMeshes.push(mesh);
        }
    }

    update() {
        // Sync chassis
        this.chassisMesh.position.copy(this.carChassisBody.position);
        this.chassisMesh.quaternion.copy(this.carChassisBody.quaternion);

        // Sync wheels
        for (let i = 0; i < this.carVehicle.wheelInfos.length; i++) {
            this.carVehicle.updateWheelTransform(i);
            const t = this.carVehicle.wheelInfos[i].worldTransform;
            this.wheelMeshes[i].position.copy(t.position);
            this.wheelMeshes[i].quaternion.copy(t.quaternion);
        }
    }
}

export { Car }