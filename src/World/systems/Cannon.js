
import { Body, Box, ContactMaterial, Material, Plane, RaycastVehicle, SAPBroadphase, Vec3, World } from "cannon-es";

class CannonizedWorld {

    constructor() {
        this.world = new World({
            gravity: new Vec3(0, -9.82, 0),
        });
        this.world.broadphase = new SAPBroadphase(this.world);
        this.world.allowSleep = true;
        this.syncedObjects = [];

    }

      addGround(mesh) {
        // Assume the mesh is a THREE.Mesh with a THREE.BoxGeometry or PlaneGeometry
        // We will create a thin Cannon.Box for physics.
        const floorWidth = mesh.geometry.parameters.width;
        const floorDepth = mesh.geometry.parameters.height; // In Three.js PlaneGeometry, it's 'height'
        const floorThickness = 0.1; // Make the physics ground a thin box

        const groundShape = new Box(new Vec3(floorWidth / 2, floorThickness / 2, floorDepth / 2));
        const groundBody = new Body({
            mass: 0, // static floor
            material: this.groundMaterial,
            shape: groundShape,
        });

        // Position the physics body. Adjust Y to be half the thickness below the mesh position.
        groundBody.position.copy(mesh.position);
        groundBody.position.y -= floorThickness / 2;

        this.world.addBody(groundBody);
    }


    update(deltaTime) {
        if (!this.world) return;
        
        this.world.step(1 / 60, deltaTime, 3);

        for (const { mesh, body } of this.syncedObjects) {
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion);
        }

        if (this.carVehicle && this.carWheelMeshes && this.carWheelMeshes.length > 0) {
            for (let i = 0; i < this.carVehicle.wheelInfos.length; i++) {
                this.carVehicle.updateWheelTransform(i);
                const transform = this.carVehicle.wheelInfos[i].worldTransform;
                this.carWheelMeshes[i].position.copy(transform.position);
                this.carWheelMeshes[i].quaternion.copy(transform.quaternion);
            }
        }
    }

}
export { CannonizedWorld }