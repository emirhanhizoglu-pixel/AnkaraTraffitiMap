import maplibregl from "maplibre-gl";
import * as THREE from "three";

export default class BuildingGeometry {

    static create(points, sceneOrigin) {

        const mercatorPoints = points.map(point =>
            maplibregl.MercatorCoordinate.fromLngLat({
                lng: point.lng,
                lat: point.lat
            })
        );

        const shape = new THREE.Shape();

        let sumX = 0;
        let sumY = 0;

        mercatorPoints.forEach((p, i) => {

            const x =
                (p.x - sceneOrigin.coordinate.x) /
                sceneOrigin.scale;

            const y =
                (sceneOrigin.coordinate.y - p.y) /
                sceneOrigin.scale;

            sumX += x;
            sumY += y;

            if (i === 0) {

                shape.moveTo(x, y);

            } else {

                shape.lineTo(x, y);

            }

        });

        const centerX = sumX / mercatorPoints.length;
        const centerY = sumY / mercatorPoints.length;

        return {

            shape,

            center: new THREE.Vector2(
                centerX,
                centerY
            ),

            position: {

                x: 0,
                y: 0,
                z: 0

            }

        };

    }

}