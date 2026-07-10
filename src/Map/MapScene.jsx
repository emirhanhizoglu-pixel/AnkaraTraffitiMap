import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

import TraffitiRenderer from "../Renderer/TraffitiRenderer";
import SceneBuilder from "../Scene/SceneBuilder";
import GraffitiProvider from "../Data/GraffitiProvider";

import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";

console.log("========== MAPSCENE VERSION 15 ==========");

const BUILDING_THRESHOLD = 87;

function MapScene() {

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!mapContainerRef.current) return;

        mapRef.current = new maplibregl.Map({

            container: mapContainerRef.current,

            style: "https://api.maptiler.com/maps/019f3360-f517-7c04-a558-fa1c2ec026bd/style.json?key=uSbxwm6B5wLPbHFgbnVz",

            center: [32.859537, 39.904965],

            zoom: 15.8,

            minZoom: 10,

            maxZoom: 18,

            pitch: 35,

            bearing: 50,

            antialias: true

        });

        const renderer = new TraffitiRenderer(mapRef.current);

        mapRef.current.on("load", () => {

            console.log("MAP LOADED");

            console.log("Sources:");
            console.log(mapRef.current.getStyle().sources);

            console.table(
                mapRef.current
                    .getStyle()
                    .layers
                    .map(layer => ({
                        id: layer.id,
                        type: layer.type,
                        source: layer.source,
                        sourceLayer: layer["source-layer"]
                    }))
            );

            
            // ==========================================
            // Wait for enough building features
            // ==========================================

            const interval = setInterval(() => {

                const count = mapRef.current.querySourceFeatures(
                    "maptiler_planet",
                    {
                        sourceLayer: "building"
                    }
                ).length;

                console.log("Available building features:", count);

                if (count >= BUILDING_THRESHOLD) {

                    console.log("Neighborhood ready.");

                    clearInterval(interval);

                    setLoading(false);

                }

            }, 1000);

            // ==========================================
            // Build Scene
            // ==========================================

            const sceneBuilder = new SceneBuilder(mapRef.current);

            sceneBuilder.build(renderer);

            console.log("Scene:", renderer.scene);
            console.log("Children:", renderer.scene.children.length);

            mapRef.current.addLayer(renderer);

            // ==========================================
            // Graffiti Markers
            // ==========================================

            const graffitiProvider = new GraffitiProvider();

            graffitiProvider.getGraffiti().forEach(graffiti => {

                new maplibregl.Marker()

                    .setLngLat([
                        graffiti.lng,
                        graffiti.lat
                    ])

                    .setPopup(
                        new maplibregl.Popup({
                            offset: 25
                        }).setText(graffiti.title)
                    )

                    .addTo(mapRef.current);

            });

            mapRef.current.on("remove", () => {

                clearInterval(interval);

            });

        });

        return () => {

            mapRef.current?.remove();

        };

    }, []);

    return (

        <div className="app">

            {loading && (

                <div className="loading-screen">

                    <h1>TRAFFITI</h1>

                    <p>Initializing world...</p>

                </div>

            )}

            <div
                ref={mapContainerRef}
                className="map"
            />

            <div className="spotlight"></div>

        </div>

    );

}

export default MapScene;