import  { BoxGeometry, Group, Mesh, MeshStandardMaterial, PlaneGeometry, Vector3 } from 'three';

export function createCentralStructures() {
    const centralStructuresGroup = new Group();

    const wallMaterial = new MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.1 });
    const insideWallMaterial = new MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.1 }); // Slightly lighter for inside

    const structureHeight = 3.5; // Height of the internal room
    const wallThickness = 0.1;

    const structure1Size = 8; // Width and depth of the square room
    const structure1Position = new Vector3(-2, 0, 3); // Position on the gallery floor

    const createStructureWall = (width, height, depth, x, y, z, rotationY = 0) => {
        const geometry = new BoxGeometry(width, height, depth);
        const wall = new Mesh(geometry, wallMaterial);
        wall.position.set(x, y + height / 2, z);
        wall.rotation.y = rotationY;
        wall.castShadow = true;
        wall.receiveShadow = true;
        return wall;
    };

    centralStructuresGroup.add(createStructureWall(structure1Size, structureHeight, wallThickness,
        structure1Position.x, structure1Position.y, structure1Position.z - structure1Size / 2
    ));
    // Front wall (split for entrance)
    const entranceWidth = 1.5;
    const sideSegmentWidth = (structure1Size - entranceWidth) / 2;
    centralStructuresGroup.add(createStructureWall(sideSegmentWidth, structureHeight, wallThickness,
        structure1Position.x - (structure1Size / 2 - sideSegmentWidth / 2), structure1Position.y, structure1Position.z + structure1Size / 2
    ));
    centralStructuresGroup.add(createStructureWall(sideSegmentWidth, structureHeight, wallThickness,
        structure1Position.x + (structure1Size / 2 - sideSegmentWidth / 2), structure1Position.y, structure1Position.z + structure1Size / 2
    ));
    // Left wall
    centralStructuresGroup.add(createStructureWall(wallThickness, structureHeight, structure1Size,
        structure1Position.x - structure1Size / 2, structure1Position.y, structure1Position.z, 
    ));
    // Right wall
    centralStructuresGroup.add(createStructureWall(wallThickness, structureHeight, structure1Size,
        structure1Position.x + structure1Size / 2, structure1Position.y, structure1Position.z
    ));

    // Ceiling for Structure 1
    const ceiling1Geometry = new PlaneGeometry(structure1Size, structure1Size);
    const ceiling1 = new Mesh(ceiling1Geometry, wallMaterial);
    ceiling1.position.set(structure1Position.x, structureHeight, structure1Position.z);
    ceiling1.rotation.x = Math.PI / 2;
    ceiling1.castShadow = true;
    ceiling1.receiveShadow = true;
    centralStructuresGroup.add(ceiling1);

    // --- Modern Bench inside Structure 1 ---
    const benchGroup = new Group();
    const benchMaterial = new MeshStandardMaterial({ color: 0x666666, roughness: 0.5 }); // Bench color

    // Bench Seat
    const seatGeometry = new BoxGeometry(2.5, 0.2, 0.8); // Long, thin seat
    const seat = new Mesh(seatGeometry, benchMaterial);
    seat.position.set(0, 0.4, 0); // Position above legs
    seat.castShadow = true;
    seat.receiveShadow = true;
    benchGroup.add(seat);

    // Bench Legs
    const legGeometry = new BoxGeometry(0.1, 0.4, 0.7); // Thin legs
    const leg1 = new Mesh(legGeometry, benchMaterial);
    leg1.position.set(-1.1, 0.2, 0); // Left leg
    leg1.castShadow = true;
    leg1.receiveShadow = true;
    benchGroup.add(leg1);

    const leg2 = new Mesh(legGeometry, benchMaterial);
    leg2.position.set(1.1, 0.2, 0); // Right leg
    leg2.castShadow = true;
    leg2.receiveShadow = true;
    benchGroup.add(leg2);

    // Position the bench inside the first hollow structure
    benchGroup.position.set(structure1Position.x, structure1Position.y, structure1Position.z + 0.6); // Move slightly inside
    centralStructuresGroup.add(benchGroup);


    return centralStructuresGroup;
}
