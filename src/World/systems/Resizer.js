
const setSize = (container, camera, renderer) => {
	camera.aspect = container.clientWidth / container.clientHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(container.clientWidth, container.clientHeight);
	renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
	constructor(camera, renderer, container) {
		console.log(container.clientWidth, container.clientHeight)
		// camera.aspect = container.clientWidth / container.clientHeight
		// camera.updateProjectionMatrix();
		setSize(container, camera, renderer);

		window.addEventListener('resize', () => {
			// set the size again if a resize occurs
			setSize(container, camera, renderer);
			// perform any custom actions
			this.onResize();
		});
		// renderer.setSize(container.clientWidth, container.clientHeight);

		// renderer.setPixelRatio(window.devicePixelRatio);

	}
	onResize() { }


}

export { Resizer }; 
