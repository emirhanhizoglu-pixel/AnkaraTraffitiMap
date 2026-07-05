import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  return (
    <MapContainer
      center={[39.9334, 32.8597]} // Ankara coordinates
      zoom={13}
      minZoom={10}
      maxZoom={18}
      style={{ height: '100vh', width: '100vw' }}
      scrollWheelZoom={true}
      dragging={true}
      bounds={[
        [39.5, 32.0], // Southwest corner of Ankara metropolitan area
        [40.2, 33.7]  // Northeast corner of Ankara metropolitan area
      ]}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[39.9042, 32.7645]}> // Hardcoded location in Ankara
        <Popup>
          This is a placeholder popup text for the marker.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default App;