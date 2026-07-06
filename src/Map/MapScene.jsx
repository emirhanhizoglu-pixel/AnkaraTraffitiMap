import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import ThreeLayer from '../Renderer/ThreeLayer';
import BuildingProvider from '../Data/BuildingProvider';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';

console.log("========== MAPSCENE VERSION 3 ==========");

function MapScene() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const threeLayer = new ThreeLayer();
    console.log(threeLayer);

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        'https://api.maptiler.com/maps/019f3360-f517-7c04-a558-fa1c2ec026bd/style.json?key=uSbxwm6B5wLPbHFgbnVz',
      center: [32.859537, 39.904965],
      zoom: 15.8,
      minZoom: 10,
      maxZoom: 18,
      pitch: 35,
      bearing: 50,
      antialias: true
    });

    mapRef.current.on('idle', () => {
      console.log("MAP IS IDLE");

      const provider = new BuildingProvider(mapRef.current);

      const buildings = provider.getBuildings();

      console.log("BUILDING COUNT:", buildings.length);

      if (buildings.length > 0) {
        console.log("FIRST BUILDING:", buildings[0]);
      }
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