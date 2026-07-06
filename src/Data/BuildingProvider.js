export default class BuildingProvider {
  constructor(map) {
    this.map = map;
  }

  getBuildings() {
    const buildings = this.map.querySourceFeatures("maptiler_planet", {
      sourceLayer: "building"
    });

    return buildings;
  }
}