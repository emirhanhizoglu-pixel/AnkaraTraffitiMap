import * as THREE from "three";

export default class TraffitiRenderer {

    constructor(map) {

        this.map = map;

        this.scene = new THREE.Scene();

        this.camera = new THREE.Camera();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    }

    add(mesh) {

        this.scene.add(mesh);

    }

    onAdd(map, gl) {

        console.log("TraffitiRenderer added");

    }

    render(gl, matrix) {

        console.log("render()");

    }

}