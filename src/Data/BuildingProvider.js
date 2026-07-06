export default class BuildingProvider {

    constructor(map) {

        this.map = map;

    }

    getBuildings() {

        const features = this.map.querySourceFeatures(
            "maptiler_planet",
            {
                sourceLayer: "building"
            }
        );

        return features;

    }

}