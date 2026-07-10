import BuildingProvider from "../Data/BuildingProvider";
import BuildingGeometry from "../Geometry/BuildingGeometry";
import Building from "../World/Building";
import SceneOrigin from "./SceneOrigin";

export default class SceneBuilder {

    constructor(map) {

        this.map = map;

    }

    build(renderer) {

        const center = this.map.getCenter();

        const sceneOrigin = new SceneOrigin(
            center.lng,
            center.lat
        );

        renderer.sceneOrigin = sceneOrigin;

        const provider = new BuildingProvider(this.map);
        const buildings = provider.getBuildings();

        

        buildings.forEach(feature => {

            let rings = [];

            if (feature.geometry.type === "Polygon") {

                // Use the exterior ring.
                rings.push(feature.geometry.coordinates[0]);

            } else if (feature.geometry.type === "MultiPolygon") {

                // Create one mesh for every polygon.
                feature.geometry.coordinates.forEach(polygon => {

                    // polygon[0] is the exterior ring.
                    rings.push(polygon[0]);

                });

            } else {

                return;

            }

            const height =
                Number(feature.properties.render_height) || 5;

            rings.forEach(ring => {

                const points = ring.map(([lng, lat]) => ({
                    lng,
                    lat
                }));

                

                const geometry = BuildingGeometry.create(
                    points,
                    sceneOrigin
                );

                const building = new Building(
                    geometry.shape,
                    height
                );

                // Store the building's real position in the city.
                building.center.copy(
                    geometry.center
                );

                // Geometry is already in scene-local coordinates.
                building.mesh.position.set(
                    geometry.position.x,
                    geometry.position.y,
                    geometry.position.z
                );

                renderer.add(building);

            });

        });

    }

}