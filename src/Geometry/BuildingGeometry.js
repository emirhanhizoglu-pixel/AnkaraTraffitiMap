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

        mercatorPoints.forEach((p, i) => {

            const x =
                (p.x - sceneOrigin.coordinate.x) / sceneOrigin.scale;

            const y =
                (sceneOrigin.coordinate.y - p.y) / sceneOrigin.scale;

            if (i === 0) {

                shape.moveTo(x, y);

            } else {

                shape.lineTo(x, y);

            }

        });

        const first = mercatorPoints[0];

        return {

            shape,

            position: {

                x:
                    (first.x - sceneOrigin.coordinate.x) /
                    sceneOrigin.scale,

                y:
                    (sceneOrigin.coordinate.y - first.y) /
                    sceneOrigin.scale,

                z: 0

            }

        };

    }

}