import { Raycaster, Vector2 } from "three";

class Raycast {
  constructor(camera, scene, domElement, maxDistance = 17) {
    this.camera = camera;
    this.scene = scene;
    this.domElement = domElement;
    this.raycaster = new Raycaster();
    this.interactiveObjects = [];
    this.maxDistance = maxDistance; // max raycast distance

    // Tooltip panel styling — simplified and modern
    this.infoPanel = document.createElement("div");
    Object.assign(this.infoPanel.style, {
      position: "absolute",
      background: "rgba(30, 30, 30, 0.8)",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: "13px",
      fontWeight: "600",
      pointerEvents: "none",
      transition: "opacity 0.3s ease",
      opacity: "0",
      whiteSpace: "nowrap",
      userSelect: "none",
      zIndex: "9999",
      boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
      maxWidth: "280px",
    });
    document.body.appendChild(this.infoPanel);
  }

  addInteractive(object) {
    this.interactiveObjects.push(object);
  }

  tick() {
    this.update();
  }

  update() {
    this.raycaster.setFromCamera(new Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0 && intersects[0].distance <= this.maxDistance) {
      const selected = intersects[0].object;
      const title = selected.userData.title || "Untitled";
      const artist = selected.userData.artist || null;
      const medium = selected.userData.medium || null;

      // Build simple inline info text without bullet list
      let infoText = `<strong>${title}</strong>`;
      if (artist) infoText += ` &mdash; <em>by ${artist}</em>`;
      if (medium) infoText += ` <span style="color:#ccc">(Medium - ${medium})</span>`;

      this.infoPanel.innerHTML = infoText;

      // Position panel near center + offset
      this.infoPanel.style.left = `${window.innerWidth / 2 + 20}px`;
      this.infoPanel.style.top = `${window.innerHeight / 2 - 20}px`;
      this.infoPanel.style.opacity = "1";

      clearTimeout(this.hideTimeout);
      this.hideTimeout = setTimeout(() => {
        this.infoPanel.style.opacity = "0";
      }, 2000);

    } else {
      this.infoPanel.style.opacity = "0";
    }
  }
}

export { Raycast };
