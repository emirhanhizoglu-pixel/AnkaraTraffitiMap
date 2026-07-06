import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

import TraffitiRenderer from '../Renderer/TraffitiRenderer';
import SceneBuilder from '../Scene/SceneBuilder';

import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';

console.log("========== MAPSCENE VERSION 6 ==========");

function MapScene() {

    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {

        if (!mapContainerRef.current) return;

        mapRef.current = new maplibregl.Map({
            container: mapContainerRef.current,
            style: 'https://api.maptiler.com/maps/019f3360-f517-7c04-a558-fa1c2ec026bd/style.json?key=uSbxwm6B5wLPbHFgbnVz',
            center: [32.859537, 39.904965],
            zoom: 15.8,
            minZoom: 10,
            maxZoom: 18,
            pitch: 35,
            bearing: 50,
            antialias: true
        });

        const renderer = new TraffitiRenderer(mapRef.current);

        const sceneBuilder = new SceneBuilder(mapRef.current);

        mapRef.current.on("load", () => {

            mapRef.current.addLayer({

                id: "traffiti-renderer",

                type: "custom",

                renderingMode: "3d",

                onAdd: renderer.onAdd.bind(renderer),

                render: renderer.render.bind(renderer)

            });

        });

        mapRef.current.on("idle", () => {

            console.log("MAP IS IDLE");

            sceneBuilder.build(renderer);

        });

        return () => {

            mapRef.current?.remove();

        };

    }, []);

    return (

        <div className="app">

            <div
                ref={mapContainerRef}
                className="map"
            />

            <div className="spotlight"></div>

        </div>

    );

}

export default MapScene;