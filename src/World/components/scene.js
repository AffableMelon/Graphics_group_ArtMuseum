import { Color, EquirectangularReflectionMapping, Fog, Scene } from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";


function createScene() {
	const scene = new Scene();

	scene.background = new Color(0xaddaaa);
  // uncomment below to add the scene and its environemnt stuff
// 	new RGBELoader()
//   .setPath('/assets/hdris/') // <- Change this!
//   .load('qwantani_afternoon_puresky_4k.hdr', function (texture) {
//     texture.mapping = EquirectangularReflectionMapping;
// // 
//     // Set the environment for lighting and background
//     scene.environment = texture;
//     // scene.background = texture;
// 
  // });
	return scene;

}

export { createScene }; 
