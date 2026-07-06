import maplibregl from "maplibre-gl";
import * as THREE from "three";

export default class BuildingGeometry {

    static getOuterRing(feature) {

        if (!feature) {
            return [];
        }

        if (feature.geometry.type !== "MultiPolygon") {
            return [];
        }

        const ring = feature.geometry.coordinates[0][0];

        return ring.map(point => ({
            lng: point[0],
            lat: point[1]
        }));

    }

    static toMercator(points) {

        return points.map(point => {

            const mercator = maplibregl.MercatorCoordinate.fromLngLat({
                lng: point.lng,
                lat: point.lat
            });

            return {
                x: mercator.x,
                y: mercator.y
            };

        });

    }

    static toShape(points) {

        const shape = new THREE.Shape();

        points.forEach((point, index) => {

            if (index === 0) {

                shape.moveTo(point.x, point.y);

            } else {

                shape.lineTo(point.x, point.y);

            }

        });

        return shape;

    }

}