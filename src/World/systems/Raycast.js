import { Raycaster, Vector2 } from "three";

class Raycast {
	constructor(camera, scene, domElement) {
		this.camera = camera;
		this.scene = scene;
		this.domElement = domElement;

		this.raycaster = new Raycaster();
		this.mouse = new Vector2();
		this.interactiveObjects = [];

		// Create info panel with better styling
		this.infoPanel = document.createElement("div");
		Object.assign(this.infoPanel.style, {
			position: "absolute",
			background: "rgba(30, 30, 30, 0.85)",
			color: "#fff",
			padding: "8px 16px",
			borderRadius: "8px",
			fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
			fontSize: "14px",
			fontWeight: "600",
			pointerEvents: "none",
			transition: "opacity 0.3s ease",
			opacity: "0",
			whiteSpace: "nowrap",
			userSelect: "none",
			zIndex: "9999",
		});
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
			const title = selected.userData.title || "Untitled";

			this.infoPanel.textContent = title;
			this.infoPanel.style.left = `${event.clientX + 12}px`;
			this.infoPanel.style.top = `${event.clientY + 12}px`;
			this.infoPanel.style.opacity = "1";

			clearTimeout(this.hideTimeout);
			this.hideTimeout = setTimeout(() => {
				this.infoPanel.style.opacity = "0";
			}, 2500);
		} else {
			this.infoPanel.style.opacity = "0";
		}
	}
}

export { Raycast };
