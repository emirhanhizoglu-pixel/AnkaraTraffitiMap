import * as THREE from "three";

export default class TraffitiRenderer {

    constructor(map) {

        this.map = map;

        this.id = "traffiti-renderer";
        this.type = "custom";
        this.renderingMode = "3d";

        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        this.renderer = null;
        this.sceneOrigin = null;

        this.buildings = [];

    }

    add(building) {

        this.buildings.push(building);
        this.scene.add(building.mesh);

    }

    onAdd(map, gl) {

        const light1 = new THREE.DirectionalLight(0xffffff, 1);
        light1.position.set(0, -70, 100);
        this.scene.add(light1);

        const light2 = new THREE.DirectionalLight(0xffffff, 1);
        light2.position.set(0, 70, 100);
        this.scene.add(light2);

        this.renderer = new THREE.WebGLRenderer({

            canvas: map.getCanvas(),
            context: gl,
            antialias: true

        });

        this.renderer.autoClear = false;

    }

    render(gl, args) {

        if (!this.renderer || !this.sceneOrigin) return;

        const projectionMatrix =
            new THREE.Matrix4().fromArray(
                args.defaultProjectionData.mainMatrix
            );

        const sceneTransform =
            new THREE.Matrix4()
                .makeTranslation(
                    this.sceneOrigin.coordinate.x,
                    this.sceneOrigin.coordinate.y,
                    this.sceneOrigin.coordinate.z
                )
                .scale(
                    new THREE.Vector3(
                        this.sceneOrigin.scale,
                        -this.sceneOrigin.scale,
                        this.sceneOrigin.scale
                    )
                );

        this.camera.projectionMatrix.copy(
            projectionMatrix.multiply(sceneTransform)
        );

        // --------------------------------------------------
        // Height depends on the point at the center
        // of the screen.
        // --------------------------------------------------

        const canvas = this.map.getCanvas();

        const focusLngLat = this.map.unproject([
            canvas.width / 2,
            canvas.height / 2
        ]);

        const localCenter = this.sceneOrigin.toLocal(
            focusLngLat.lng,
            focusLngLat.lat
        );

        const focusPoint = new THREE.Vector2(
            localCenter.x,
            localCenter.y
        );

        const radius = 500;

        for (const building of this.buildings) {

            const distance =
                building.center.distanceTo(focusPoint);

            const influence =
                Math.max(
                    0,
                    1 - distance / radius
                );

            const height =
                2 + influence * 80;

            building.setHeight(height);

        }

        // --------------------------------------------------

        this.renderer.resetState();

        this.renderer.render(
            this.scene,
            this.camera
        );

        this.map.triggerRepaint();

    }

}