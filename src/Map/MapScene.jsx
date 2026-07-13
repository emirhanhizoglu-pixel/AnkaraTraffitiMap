import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

import graffitiMarker from "../assets/traffiti_marker.png";

import TraffitiRenderer from "../Renderer/TraffitiRenderer";
import SceneBuilder from "../Scene/SceneBuilder";
import GraffitiProvider from "../Data/GraffitiProvider";
import GraffitiDetail from "../Graffiti/GraffitiDetail";
import LoadingScreen from "../Loading/LoadingScreen";

import "maplibre-gl/dist/maplibre-gl.css";
import "../App.css";

console.log("========== MAPSCENE VERSION 20 ==========");

const HOME = [32.859537, 39.904965];
const MAX_DISTANCE = 0.0045;
const MIN_ZOOM = 15.2;
const INITIAL_ZOOM = 14.7;
const HOME_ZOOM = 15.8;
const MARKER_ZOOM = 17.2;
const MAP_REVEAL_DURATION = 2200;

function MapScene() {

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [mapReady, setMapReady] = useState(false);
    const [mapRevealActive, setMapRevealActive] = useState(true);
    const [mapRevealing, setMapRevealing] = useState(false);
    const [selectedGraffiti, setSelectedGraffiti] = useState(null);

    useEffect(() => {

        if (!mapContainerRef.current) return;

        const map = new maplibregl.Map({

            container: mapContainerRef.current,

            style: "https://api.maptiler.com/maps/019f3360-f517-7c04-a558-fa1c2ec026bd/style.json?key=uSbxwm6B5wLPbHFgbnVz",

            center: HOME,

            zoom: INITIAL_ZOOM,

            minZoom: INITIAL_ZOOM,

            maxZoom: 17.8,

            pitch: 35,

            bearing: 50,

            antialias: true

        });

        mapRef.current = map;

        // ==========================================
        // Soft Camera Constraint
        // ==========================================

        map.on("dragend", () => {

            const center = map.getCenter();

            if (

                Math.abs(center.lng - HOME[0]) > MAX_DISTANCE ||

                Math.abs(center.lat - HOME[1]) > MAX_DISTANCE

            ) {

                map.easeTo({

                    center: HOME,

                    duration: 1800,

                    easing: t => 1 - Math.pow(1 - t, 3)

                });

            }

        });

        const renderer = new TraffitiRenderer(map);

        map.on("load", () => {

            console.log("MAP LOADED");

            requestAnimationFrame(() => {

                // ==========================================
                // Build custom building scene
                // ==========================================

                const sceneBuilder = new SceneBuilder(
                    map
                );

                sceneBuilder.build(renderer);

                console.log(
                    "Buildings:",
                    renderer.buildings.length
                );

                map.addLayer(renderer);

                // ==========================================
                // Graffiti Markers
                // ==========================================

                const graffitiProvider =
                    new GraffitiProvider();

                graffitiProvider
                    .getGraffiti()
                    .forEach(graffiti => {

                        const element =
                            document.createElement("img");

                        element.src = graffitiMarker;
                        element.className =
                            "graffiti-marker";

                        element.addEventListener("click", () => {

                            map.easeTo({

                                center: [graffiti.lng, graffiti.lat],
                                zoom: MARKER_ZOOM,
                                duration: 1600,
                                easing: t => 1 - Math.pow(1 - t, 3)

                            });

                            setSelectedGraffiti(graffiti);

                        });

                        new maplibregl.Marker({

                            element,
                            anchor: "bottom"

                        })

                            .setLngLat([
                                graffiti.lng,
                                graffiti.lat
                            ])

                            .addTo(map);

                    });

                // The visual loader may exit only after MapLibre has no
                // pending tile or style work for the initial scene.
                map.once("idle", () => {

                    setMapReady(true);

                });

            });

        });

        return () => {

            map.remove();

        };

    }, []);

    const revealMap = () => {

        setLoading(false);

        requestAnimationFrame(() => {

            setMapRevealing(true);

            mapRef.current?.easeTo({

                center: HOME,
                zoom: HOME_ZOOM,
                duration: MAP_REVEAL_DURATION,
                easing: t => 1 - Math.pow(1 - t, 3)

            });

        });

    };

    const closeGraffitiDetail = () => {

        setSelectedGraffiti(null);

        mapRef.current?.easeTo({

            center: HOME,
            zoom: HOME_ZOOM,
            duration: 1600,
            easing: t => 1 - Math.pow(1 - t, 3)

        });

    };

    return (

        <div className="app">

            {loading && (
                <LoadingScreen
                    mapReady={mapReady}
                    onComplete={revealMap}
                />
            )}

            <div
                ref={mapContainerRef}
                className="map"
            />

            {mapRevealActive && (
                <div
                    className={
                        `map-reveal${
                            mapRevealing
                                ? " map-reveal--revealing"
                                : ""
                        }`
                    }
                    onTransitionEnd={() => {

                        mapRef.current?.setMinZoom(MIN_ZOOM);
                        setMapRevealActive(false);

                    }}
                />
            )}

            <div className="spotlight"></div>

            {selectedGraffiti && (
                <GraffitiDetail
                    graffiti={selectedGraffiti}
                    onClose={closeGraffitiDetail}
                />
            )}

        </div>

    );

}

export default MapScene;
