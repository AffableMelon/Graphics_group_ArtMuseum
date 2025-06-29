import  { Box3, BoxGeometry, Group, Mesh, MeshStandardMaterial, RepeatWrapping } from 'three';
import { createMaterialNew } from '../util/createMeshWithTexture';
import { color } from 'three/tsl';


function smallerWalls(textureLoader) {
    // thought this was tiny so changed it 
    const wallsGroup = new Group();

    const wallTexture = textureLoader.load('https://placehold.co/1024x1024/CCCCCC/333333?text=WallTexture', (texture) => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.repeat.set(2, 1); // Adjust repeat for wall size
    });
    const wallMaterial = new MeshStandardMaterial({ map: wallTexture });
    const defaultWallHeight = 5;
     const thinness = 0.2
    const wallThickness = 0.1;
    const gallerySize = 20; // Matches floor size


const addWall = (width, height, depth, x, y, z, rotationY = 0) => {
      const geometry = new BoxGeometry(width, height, depth);
        const wall = new Mesh(geometry, wallMaterial);
        wall.position.set(x, y + height / 2, z); // Position based on bottom center
        wall.rotation.y = rotationY;
        wall.receiveShadow = true;
        wall.castShadow = true;
        wallsGroup.add(wall);

         wall.updateMatrixWorld();
  const box = new THREE.Box3().setFromObject(wall);
  wallBoundingBoxes.push(box);
    };
    // Outter walls
    addWall(40, defaultWallHeight, thinness, 0, 0, -10); // back most wall 
    addWall(thinness, defaultWallHeight, 20, -20, 0, 0); // Outer left wall
    addWall(12, defaultWallHeight, thinness, -14, 0, 10);  // left most front wall befoire glass openning
    addWall(14, defaultWallHeight, thinness, 3, 0, 10);  // right most front wall after glass opening
    addWall(14.14, defaultWallHeight, thinness, 15, 0, 5, Math.PI / 4); // slanted wall connecting right most wall to front wall
    addWall(thinness, defaultWallHeight, 10, 20, 0, -5); // right most wall


    // Inner walls 
    addWall(thinness, defaultWallHeight, 8, -8, 0, -6); // Left inner wall close to the back wall
    addWall(thinness, defaultWallHeight, 8, -8, 0, 6);  // Further from back wall wall ()

    // Left Wall (with an opening to the side room)
    // walls inside but used for hanging art pieces and making space fuller (can have a seat in front of them and such)
    addWall(4, 3, thinness, 8, 0, -4, Math.PI / 2);
    addWall(10, 3, thinness, 0, 0, 0, Math.PI / 2); 


  


    return wallsGroup;
}


  export  function createWalls() {
    const wallsGroup = new Group();

    const beige_wall_001 = {
    diff: 'beige_wall_001_4k/beige_wall_001_diff_4k.webp',
    nor_gl: 'beige_wall_001_4k/beige_wall_001_nor_gl_4k.webp',
    rough: 'beige_wall_001_4k/beige_wall_001_rough_4k.webp',
    ao: 'beige_wall_001_4k/beige_wall_001_ao_4k.webp',
    disp: 'beige_wall_001_4k/beige_wall_001_disp_4k.webp',
    arm: 'beige_wall_001_4k/beige_wall_001_arm_4k.webp'  
};

    const concrete_wall_006 = {
  diff: 'concrete_wall_006_2k/concrete_wall_006_diff_2k.webp',
  nor_gl: 'concrete_wall_006_2k/concrete_wall_006_nor_gl_2k.webp',
  rough: 'concrete_wall_006_2k/concrete_wall_006_rough_2k.webp',
  ao: 'concrete_wall_006_2k/concrete_wall_006_ao_2k.webp',
  disp: 'concrete_wall_006_2k/concrete_wall_006_disp_2k.webp',
  arm: 'concrete_wall_006_2k/concrete_wall_006_arm_2k.webp', // optional — see notes above
};


const plastered_wall = {
  diff: 'plastered_wall_4k/plastered_wall_diff_4k.webp',
  nor_gl: 'plastered_wall_4k/plastered_wall_nor_gl_4k.webp',
  rough: 'plastered_wall_4k/plastered_wall_rough_4k.webp',
  ao: 'plastered_wall_4k/plastered_wall_ao_4k.webp',
  disp: 'plastered_wall_4k/plastered_wall_disp_4k.webp',
  arm: 'plastered_wall_4k/plastered_wall_arm_4k.webp',
};



    // const wallTexture = new MeshStandardMaterial({color: "skyblue"})
  


    // const options = {
    //     repeat: [80,80]
    // }
    // const wallMaterial = createMaterialNew(concrete_wall_006, options)
    // const innerMaterial = createMaterialNew(plastered_wall)
    const defaultWallHeight = 5;
    const thinness = 0.01;
    const wallThickness = 0.1;
    const wallBoundingBoxes = []

    // For a 100x100 gallery
    const galleryWidth = 100;
    const galleryDepth = 100;

   const getMaterial = (isOuter, width, height, depth) => {
    const repeatX = Math.max(width, depth); // Choose the longer side for horizontal tiling
    const repeatY = height;

    if (isOuter) {
        return createMaterialNew(beige_wall_001, { repeat: [repeatX, repeatY] });
    } else {
        return createMaterialNew(plastered_wall, { repeat: [repeatX, repeatY] });
    }
};


    const addWall = (width, height, depth, x, y, z, rotationY = 0, options = {outter: false}) => {
        const geometry = new BoxGeometry(width, height, depth);
        const material = getMaterial(options.outter, width, height,depth);
        const wall = new Mesh(geometry, material);
        if (options){
            wall.userData.art = options.art
        }
        wall.position.set(x, y + height / 2, z);
        wall.rotation.y = rotationY;
        // wall.receiveShadow = true;
        wall.castShadow = true;
        wallsGroup.add(wall);

    };

    // ===== PERIMETER WALLS =====
    addWall(galleryWidth, defaultWallHeight, thinness, 0, 0, -galleryDepth / 2 , 0, { outter: true, art: "empty"}); // back
    addWall(galleryWidth, defaultWallHeight, thinness, 0, 0, 30, 0,{ outter: true, art: "front_wall"});  // front
    addWall(thinness, defaultWallHeight, 80, -50, 0, -10, 0 ,{ outter: true, art: "left_wall"}); // left
    addWall(thinness, defaultWallHeight, 80, 50, 0, -10, 0, { outter: true, art: "right_wall"});  // right

    // ===== FRONT ENTRY AREA (based on your layout) =====
    // addWall(25, defaultWallHeight, thinness, -30, 0, galleryDepth / 2 - 5); // left side of entry
    // addWall(30, defaultWallHeight, thinness, 25, 0, galleryDepth / 2 - 5);  // right side of entry
    // addWall(21.2, defaultWallHeight, thinness, 50, 0, galleryDepth / 2 - 20, Math.PI / 4); // angled right connector

    // ===== INTERIOR WALLS FOR ART DISPLAY =====
    // Parallel display dividers
    addWall(thinness, defaultWallHeight, 40, -30, 0, -20);
    addWall(thinness, defaultWallHeight, 30, -10, 0, -20);
    addWall(thinness, defaultWallHeight, 30, 10, 0, -20);
    addWall(thinness, defaultWallHeight, 40, 30, 0, -20);

    // Horizontal short walls (like standalone displays)
    addWall(15, 3, thinness, -25, 0, 0, Math.PI / 2);
    addWall(20, 3, thinness, 0, 0, 0, Math.PI / 2);
    addWall(15, 3, thinness, 20, 0, 0, Math.PI / 2);

    // Smaller angled or short visual breaks
    addWall(thinness, 3, 10, 40, 0, -10);
    addWall(thinness, 3, 10, -40, 0, -10);

    // Side room entrance + walls (left wing)
    addWall(20, defaultWallHeight, thinness, -galleryWidth / 2 + 10, 0, -30,  Math.PI, {art: "empty"} );
    // addWall(thinness, defaultWallHeight, 20, -galleryWidth / 2 + 20, 0, -30);

    // Side room on right wing
    addWall(20, defaultWallHeight, thinness, galleryWidth / 2 - 10, 0, -30, 0,{art: "empty"});

    return {wallsGroup, wallBoundingBoxes};
}
