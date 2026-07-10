import * as THREE from "three";

export default class Building {

    constructor(shape, height) {

        this.shape = shape;

        this.baseHeight = height;
        this.currentHeight = height;

        this.center = new THREE.Vector2();

        this.material = new THREE.MeshStandardMaterial({

            color: 0xffa500,
            roughness: 0.9,
            metalness: 0,
            side: THREE.DoubleSide

        });

        this.mesh = null;

        this.rebuild();

    }

    rebuild() {

        if (this.mesh) {

            this.mesh.geometry.dispose();

        }

        const geometry = new THREE.ExtrudeGeometry(this.shape, {

            depth: this.currentHeight,
            bevelEnabled: false

        });

        geometry.computeBoundingBox();
        geometry.computeVertexNormals();

        if (geometry.boundingBox) {

            this.center.set(

                (geometry.boundingBox.min.x + geometry.boundingBox.max.x) * 0.5,

                (geometry.boundingBox.min.y + geometry.boundingBox.max.y) * 0.5

            );

        }

        if (!this.mesh) {

            this.mesh = new THREE.Mesh(
                geometry,
                this.material
            );

            this.mesh.frustumCulled = false;

        } else {

            this.mesh.geometry = geometry;

        }

    }

    setHeight(height) {

        if (height === this.currentHeight) return;

        this.currentHeight = height;

        this.rebuild();

    }

}