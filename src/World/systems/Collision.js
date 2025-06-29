import * as THREE from 'three';

let colliders = [];

/**
 * Initialize colliders from an array of meshes (walls, sculptures, etc).
 * Computes bounding boxes once and stores them.
 * @param {THREE.Mesh[]} meshes - Array of static meshes to collide against.
 * @param {THREE.Scene} [scene=null] - Optional scene for debug helpers.
 * @param {boolean} [debug=false] - Whether to show bounding box helpers.
 */
export function initColliders(meshes, scene = null, debug = false) {
  colliders = meshes.map(mesh => {
    mesh.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(mesh);

    if (debug && scene) {
      const helper = new THREE.Box3Helper(box, 0xff0000);
      scene.add(helper);
    }

    return { mesh, box };
  });
}

/**
 * Add a single mesh collider dynamically if needed.
 * @param {THREE.Mesh} mesh
 * @param {THREE.Scene} [scene=null]
 * @param {boolean} [debug=false]
 */
export function addCollider(mesh, scene = null, debug = false) {
  mesh.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(mesh);

  if (debug && scene) {
    const helper = new THREE.Box3Helper(box, 0xff0000);
    scene.add(helper);
  }

  colliders.push({ mesh, box });
}

/**
 * Check if player's next position collides with any collider bounding box.
 * @param {THREE.Vector3} playerPosition - The candidate player position to check.
 * @param {number} [buffer=0.4] - Player collision box half-size on each axis.
 * @returns {boolean} true if collision detected, false otherwise.
 */
export function checkCollision(playerPosition, buffer = 0.4) {
  // Create a player's bounding box centered at playerPosition
  const playerBox = new THREE.Box3().setFromCenterAndSize(
    playerPosition.clone(),
    new THREE.Vector3(buffer, buffer * 2, buffer) // Height larger (e.g. 2 units tall)
  );

  for (const { box } of colliders) {
    if (box.intersectsBox(playerBox)) {
      return true; // Collision detected
    }
  }

  return false; // No collision
}

/**
 * Expose colliders if needed for external use.
 */
export { colliders };
