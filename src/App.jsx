import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style:
        'https://api.maptiler.com/maps/019f3360-f517-7c04-a558-fa1c2ec026bd/style.json?key=uSbxwm6B5wLPbHFgbnVz',
      center: [32.8597, 39.9334], // [lng, lat]
      zoom: 16,
      minZoom: 10,
      maxZoom: 18,
      pitch: 35,
      bearing: -20,
      antialias: true
    });

    mapRef.current.on('style.load', () => {
      console.log("STYLE LOADED");

      const layers = mapRef.current.getStyle().layers;
      console.log(layers);

      // Find the first label layer so labels stay above buildings
      const labelLayer = layers.find(layer => layer.type === 'symbol')?.id;

      mapRef.current.addLayer(
        {
          id: '3d-buildings',
          type: 'fill-extrusion',
          source: 'maptiler_planet',
          'source-layer': 'building',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#b0b0a0',

            'fill-extrusion-height': 40,

            'fill-extrusion-base': 0,

            'fill-extrusion-opacity': 1,
            }
        },
        labelLayer
      );
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}

export default App;