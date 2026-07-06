import BuildingProvider from "../Data/BuildingProvider";
import BuildingGeometry from "../Geometry/BuildingGeometry";
import BuildingMesh from "../Meshes/Building";
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

        console.log("Total buildings:", buildings.length);

        buildings.forEach(feature => {

            let rings = [];

            if (feature.geometry.type === "Polygon") {

                rings.push(feature.geometry.coordinates[0]);

            } else if (feature.geometry.type === "MultiPolygon") {

                feature.geometry.coordinates.forEach(polygon => {
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

                const building = BuildingGeometry.create(
                    points,
                    sceneOrigin
                );

                const mesh = BuildingMesh.create(
                    building.shape,
                    sceneOrigin.scale,
                    height
                );

                // Geometry is already expressed relative to the scene origin.
                // The mesh itself stays at the scene origin.
                mesh.position.set(0, 0, 0);

                renderer.add(mesh);

            });

        });

    }

}