import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';

const providers = [
  { id: 1, name: 'CrashOut Rental 1', lat: 13.7466, lng: 100.5328, address: 'Pathum Wan, Bangkok' },
  { id: 2, name: 'CrashOut Rental 2', lat: 13.7211, lng: 100.5320, address: 'Sathorn, Bangkok' },
  { id: 3, name: 'CrashOut Rental 3', lat: 13.7768, lng: 100.5794, address: 'Huai Khwang, Bangkok' },
  { id: 4, name: 'CrashOut Rental 4', lat: 13.7690, lng: 100.6520, address: 'Bang Kapi, Bangkok' },
  { id: 5, name: 'CrashOut Rental 5', lat: 13.8005, lng: 100.5530, address: 'Chatuchak, Bangkok' },
  { id: 6, name: 'CrashOut Rental 6', lat: 13.7852, lng: 100.5383, address: 'Phaya Thai, Bangkok' },
];

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

const App = () => {
  const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; // ⚠️ Replace with your real key

  return (
    <div className="App">
      <h1>CrashOut Rental Providers</h1>

      <ul>
        {providers.map(p => (
          <li key={p.id}>
            <b>{p.name}</b> — {p.address}
          </li>
        ))}
      </ul>

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {providers.map(p => (
            <Marker key={p.id} position={{ lat: p.lat, lng: p.lng }} title={p.name} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default App;
