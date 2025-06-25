import { SpotLightHelper } from "three";
import {
	Box3,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	PlaneGeometry,
	SpotLight,
	Vector3,
} from "three";

export function decorateWallWithArtAndLights(scene, wallMesh, textureLoader, options = {}) {
	const {
		artTextureURL = 'https://placehold.co/512x512?text=Art',
		maxArtPieces = 6,
		artWidth = 3,
		artHeight = 3,
		wallOffset = 0.01, // Tighter to wall surface
		spotHeight = 4,
		artSpacing = 2.5,  // Increased spacing
	} = options;

	// Get wall size and orientation
	const size = new Vector3();
	new Box3().setFromObject(wallMesh).getSize(size);
	// const isVertical = size.z > size.x;
	const isVertical = size.z - size.x > 0.01; // only call it vertical if clearly so


	const availableLength = isVertical ? size.z : size.x;
	// const numArtPieces = Math.min(
	// 	maxArtPieces,
	// 	Math.floor(availableLength / (artWidth + artSpacing))
	// );

	const numArtPieces = Math.max(1, Math.min(
  maxArtPieces,
  Math.floor(availableLength / (artWidth + artSpacing))
));


	const startOffset = -((numArtPieces - 1) * (artWidth + artSpacing)) / 2;

	function placeArtOnSide(side = 'front') {
		const direction = side === 'front' ? 1 : -1;

		for (let i = 0; i < numArtPieces; i++) {
			const artMesh = new Mesh(
				new PlaneGeometry(artWidth, artHeight),
				new MeshStandardMaterial({
					map: textureLoader.load(artTextureURL),
				})
			);

			// Positioning based on wall orientation
			const x = isVertical
				? wallMesh.position.x + direction * wallOffset
				: wallMesh.position.x + startOffset + i * (artWidth + artSpacing);

			const z = isVertical
				? wallMesh.position.z + startOffset + i * (artWidth + artSpacing)
				: wallMesh.position.z + direction * wallOffset;
const y = wallMesh.position.y + size.y / 2 - 2;
			// const y = wallMesh.position.y + size.y / 2 - artHeight / 2;

			artMesh.position.set(x, y, z);

			// Rotate to face correct direction
			if (isVertical) {
				artMesh.rotation.y = direction * Math.PI / 2;
			} else {
				artMesh.rotation.y = direction * Math.PI;
			}

			scene.add(artMesh);

			if (direction === 1 ){

				// Calculate direction the artwork is facing
				const normal = new Vector3(0, 0, -1).applyEuler(artMesh.rotation); // the front direction
				
				// Calculate spotlight position: slightly in front and above
				const forwardOffset = 5;    // How far out from the wall
				const verticalOffset = 4; // How high above the art
				
				const spotPosition = new Vector3().copy(artMesh.position)
					.addScaledVector(normal, forwardOffset)
					.add(new Vector3(0, verticalOffset, 0)); // go up
				
				const spot = new SpotLight(0xffffff, 100, 5, Math.PI / 6);
				spot.position.copy(spotPosition);
				
				// Make spotlight point at the art
				const target = new Object3D();
				target.position.copy(artMesh.position);
				scene.add(target);
				
				spot.target = target;
				scene.add(spot);
				
				// Add the helper properly (to the scene, not the light)
				const spotlightHelper = new SpotLightHelper(spot);
				scene.add(spotlightHelper);
			}
		}
	}

	if (wallMesh.userData.art === "left_wall"){
		placeArtOnSide("front");
	}else if (wallMesh.userData.art === "front_wall" || wallMesh.userData.art === "right_wall") {
		placeArtOnSide("back");
		// placeArtOnSide("back"); // Mirror the front on the back
	}else if (wallMesh.userData.art === "empty" ){
		return
	}
	else{
		placeArtOnSide("back");
		placeArtOnSide("front");

	}

	// if (wallMesh.name !== "Perimiter_Wall"){
	// }
}
