import * as THREE from "three";

export default class BuildingMesh {

    static create(shape) {

        const geometry = new THREE.ExtrudeGeometry(shape, {
            depth: 20,
            bevelEnabled: false
        });

        const material = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        const mesh = new THREE.Mesh(geometry, material);

        return mesh;

    }

}