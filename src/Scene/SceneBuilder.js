import BuildingProvider from "../Data/BuildingProvider";
import BuildingGeometry from "../Geometry/BuildingGeometry";
import BuildingMesh from "../Meshes/BuildingMesh";

export default class SceneBuilder {

    constructor(map) {

        this.map = map;

    }

    build(renderer) {

        const provider = new BuildingProvider(this.map);

        const buildings = provider.getBuildings();

        console.log("BUILDING COUNT:", buildings.length);

        if (buildings.length === 0) {
            return;
        }

        const feature = buildings[0];

        const ring = BuildingGeometry.getOuterRing(feature);

        const mercator = BuildingGeometry.toMercator(ring);

        const shape = BuildingGeometry.toShape(mercator);

        const mesh = BuildingMesh.create(shape);

        renderer.add(mesh);

        console.log("Scene:", renderer.scene);
        console.log("Children:", renderer.scene.children.length);

    }

}