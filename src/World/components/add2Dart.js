import {
	Box3,
	Mesh,
	MeshStandardMaterial,
	Object3D,
	PlaneGeometry,
	SpotLight,
	SpotLightHelper,
	Vector3,
} from "three";
// import { artworkImages, artworkImage } from "./artworks.js";
import { artWorkImages } from "./met_public_artworks2.js"

let imageIndex = 0;

export function decorateWallWithArtAndLights(scene, wallMesh, textureLoader, raycaster, options = {}) {
	const {
		maxArtPieces = 6,
		artWidth = 3,
		artHeight = 3,
		wallOffset = 0.01,
		spotHeight = 4,
		artSpacing = 4.25,
	} = options;

	const size = new Vector3();
	new Box3().setFromObject(wallMesh).getSize(size);
	const isVertical = size.z - size.x > 0.01;

	const availableLength = isVertical ? size.z : size.x;
	const numArtPieces = Math.max(1, Math.min(
		maxArtPieces,
		Math.floor(availableLength / (artWidth + artSpacing))
	));

	const startOffset = -((numArtPieces - 1) * (artWidth + artSpacing)) / 2;

	function getNextImage() {
		const url = artWorkImages[imageIndex % artWorkImages.length];
		imageIndex++;
		return url;
	}

	function placeArtOnSide(side = 'front') {
		const direction = side === 'front' ? 1 : -1;

		for (let i = 0; i < numArtPieces; i++) {
			const artTextureURL = getNextImage();

			const artMesh = new Mesh(
				new PlaneGeometry(artWidth, artHeight),
				new MeshStandardMaterial({
					map: textureLoader.load(artTextureURL.url),
				})
			);

			const x = isVertical
				? wallMesh.position.x + direction * wallOffset
				: wallMesh.position.x + startOffset + i * (artWidth + artSpacing);

			const z = isVertical
				? wallMesh.position.z + startOffset + i * (artWidth + artSpacing)
				: wallMesh.position.z + direction * wallOffset;

			const y = wallMesh.position.y

			artMesh.position.set(x, y, z);
			artMesh.rotation.y = isVertical
				? direction * Math.PI / 2
				: direction * Math.PI;

			scene.add(artMesh);

			artMesh.userData.title = artTextureURL.title;
			artMesh.userData.artist = artTextureURL.artist;
			artMesh.userData.medium = artTextureURL.medium;

			raycaster.addInteractive(artMesh)

			if (direction === 1) {
				const normal = new Vector3(0, 0, -1).applyEuler(artMesh.rotation);
				const spotPosition = new Vector3().copy(artMesh.position)
					.addScaledVector(normal, 5)
					.add(new Vector3(0, spotHeight, 0));

				const spot = new SpotLight(0xffffff, 100, 5, Math.PI / 6);
				spot.position.copy(spotPosition);

				const target = new Object3D();
				target.position.copy(artMesh.position);
				scene.add(target);

				spot.target = target;
				scene.add(spot);

				// const helper = new SpotLightHelper(spot);
				// scene.add(helper);
			}
		}
	}

	const artLabel = wallMesh.userData.art;
	if (artLabel === "left_wall") {
		placeArtOnSide("front");
	} else if (["front_wall", "right_wall"].includes(artLabel)) {
		placeArtOnSide("back");
	} else if (artLabel === "empty") {
		return;
	} else {
		placeArtOnSide("front");
		placeArtOnSide("back");
	}
}
