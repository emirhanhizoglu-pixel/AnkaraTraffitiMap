import * as THREE from "three";

export default class Cube {

    static create() {

        const geometry = new THREE.BoxGeometry(20, 20, 20);

        const material = new THREE.MeshNormalMaterial();

        const cube = new THREE.Mesh(
            geometry,
            material
        );

        // IMPORTANT:
        // Local model.
        // Position comes from modelTransform.
        cube.position.set(0, 0, 0);

        return cube;

    }

}