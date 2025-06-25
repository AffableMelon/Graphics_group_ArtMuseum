import { PlaneGeometry, MeshStandardMaterial, Mesh } from "three"
import { createMaterialNew } from "../util/createMeshWithTexture";


function createFloor(width, length) {
	const floorGeometry = new PlaneGeometry(width, length); 
	const woodTextureFiles = {
    albedo: 'floor/light-plank-flooring_albedo.webp',
    normal: 'floor/light-plank-flooring_normal-ogl.webp',
    metallic: 'floor/light-plank-flooring_metalic.webp', 
    ao: 'floor/light-plank-flooring_ao.webp', 
    height: 'floor/light-plank-flooring_height.webp' 
};
const elegantStoneTiles = {
  diff: 'elegant-stone-tiles-unity/elegant-stone-tiles_albedo.webp',
  nor_gl: 'elegant-stone-tiles-unity/elegant-stone-tiles_normal-ogl.webp',
  ao: 'elegant-stone-tiles-unity/elegant-stone-tiles_ao.webp',
  metal: 'elegant-stone-tiles-unity/elegant-stone-tiles_metallic.webp',
  disp: 'elegant-stone-tiles-unity/elegant-stone-tiles_height.webp',
};
const rectanglePolishedTile = {
  diff: 'rectangle-polished-tile-unity/rectangle-polished-tile_albedo.webp',
  nor_gl: 'rectangle-polished-tile-unity/rectangle-polished-tile_normal-ogl.webp',
  ao: 'rectangle-polished-tile-unity/rectangle-polished-tile_ao.webp',
  metal: 'rectangle-polished-tile-unity/rectangle-polished-tile_metallic.webp',
  disp: 'rectangle-polished-tile-unity/rectangle-polished-tile_height.webp',
};
const slab_tiles = {
  diff: 'slab_tiles_diff_4k.webp',
  nor_gl: 'slab_tiles_nor_gl_4k.webp',
  rough: 'slab_tiles_rough_4k.webp',
  ao: 'slab_tiles_ao_4k.webp',
  disp: 'slab_tiles_disp_4k.webp',
  arm: 'slab_tiles_arm_4k.webp',
};
	// const floorMaterial = new MeshStandardMaterial({ color: 0x888888, roughness: 0.3 });
	const floorMaterial = createMaterialNew(elegantStoneTiles, { repeat: [width, length] })

	const floor = new Mesh(floorGeometry, floorMaterial);

	// Rotate the plane to lie flat on the XZ plane
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true; // Important for shadows

	return floor
}

export { createFloor }
