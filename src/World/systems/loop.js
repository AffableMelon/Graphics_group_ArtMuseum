import { Clock } from "three";


class Loop{
	constructor(camera, scene, renderer){
		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.updateables = [];
		this.physicsUpdater = null; // function to call for physics updates
this.clock = new Clock();

        this.deltaTime = 0;
	}

	setPhysicsUpdater(updaterFunction) {
        this.physicsUpdater = updaterFunction;
    }

	start() {
		this.clock.start()
		this.renderer.setAnimationLoop(() => {
			this.tick();
			this.renderer.render(this.scene, this.camera);
		})
	}

	stop () {
		this.renderer.setAnimationLoop(null);
	}

	tick(){
		if (this.physicsUpdater) {
            this.physicsUpdater(this.deltaTime);
        }
		if (this.debugger) {
            this.debugger.update(); // Update the debugger
        }

		 this.deltaTime = this.clock.getDelta();
		for (const object of this.updateables) {
			object.tick(this.deltaTime);
		}

	}
}

export { Loop }
