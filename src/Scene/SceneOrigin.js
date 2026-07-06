import maplibregl from "maplibre-gl";

export default class SceneOrigin {

    constructor(lng, lat, altitude = 0) {

        this.lng = lng;
        this.lat = lat;
        this.altitude = altitude;

        this.mercator =
            maplibregl.MercatorCoordinate.fromLngLat(
                { lng, lat },
                altitude
            );

    }

    get coordinate() {

        return this.mercator;

    }

    get scale() {

        return this.mercator.meterInMercatorCoordinateUnits();

    }

}