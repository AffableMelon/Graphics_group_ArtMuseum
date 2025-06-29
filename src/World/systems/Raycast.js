import { Raycaster, Vector2 } from "three";

class Raycast {
	constructor(camera, scene, domElement) {
		this.camera = camera;
		this.scene = scene;
		this.domElement = domElement;

		this.raycaster = new Raycaster();
		this.mouse = new Vector2();
		this.interactiveObjects = [];

		this.infoPanel = document.createElement("div");
		this.infoPanel.style.position = "absolute";
		this.infoPanel.style.background = "rgba(0,0,0,0.7)";
		this.infoPanel.style.color = "white";
		this.infoPanel.style.padding = "10px 15px";
		this.infoPanel.style.display = "none";
		document.body.appendChild(this.infoPanel);

		this.domElement.addEventListener("click", this.onClick.bind(this));
	}

	addInteractive(object) {
		this.interactiveObjects.push(object);
	}

	onClick(event) {
		// Normalize mouse position
		const rect = this.domElement.getBoundingClientRect();
		this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(
			this.interactiveObjects,
			true
		);

		if (intersects.length > 0) {
			const selected = intersects[0].object;

			const title = selected.userData.title || "Unnamed Artwork";
			const artist = selected.userData.artist || "Unknown Artist";
			const medium = selected.userData.medium || "Unknown Medium";

			// Construct HTML for an unordered list
			this.infoPanel.innerHTML = `
                <ul>
                    <li><strong>Title:</strong> ${title}</li>
                    <li><strong>Artist:</strong> ${artist}</li>
                    <li><strong>Medium:</strong> ${medium}</li>
                </ul>
            `;
			this.infoPanel.style.left = `${event.clientX + 10}px`;
			this.infoPanel.style.top = `${event.clientY + 10}px`;
			this.infoPanel.style.display = "block";

			setTimeout(() => {
				this.infoPanel.style.display = "none";
			}, 2500);

		}
		else {
			// If no intersection, hide the panel immediately (if it was showing)
			this.infoPanel.style.display = "none";
		}

	}


}

export { Raycast };
