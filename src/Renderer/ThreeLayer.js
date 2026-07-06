import * as THREE from "three";

export default class ThreeLayer {

    constructor() {

        this.scene = new THREE.Scene();

        this.camera = new THREE.Camera();

        this.renderer = null;

    }

}