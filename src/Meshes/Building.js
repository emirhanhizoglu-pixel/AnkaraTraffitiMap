import * as THREE from "three";

export default class BuildingMesh {

    static create(shape, meterScale, height) {

        const geometry = new THREE.ExtrudeGeometry(shape, {

            // Geometry is already in local meter coordinates.
            depth: height,
            bevelEnabled: false

        });

        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
        geometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({

            color: 0xffffff,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide

        });

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        mesh.frustumCulled = false;

        return mesh;

    }

}