import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

const App = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5003/api/v1/providers') // make sure port matches your backend
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setProviders(response.data);
        } else {
          setError('Failed to load providers');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load providers:', err);
        setError('Failed to load providers');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading providers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      <h1>CrashOut Rental Providers</h1>

      <ul>
        {providers.map(p => (
          <li key={p._id}>
            <b>{p.name}</b>  {p.address}, {p.district}, {p.province}, {p.postalcode}, {p.tel}
          </li>
        ))}
      </ul>

      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
          {providers.map(p => (
            <Marker
              key={p._id}
              position={{ lat: Number(p.lat), lng: Number(p.lng) }}
              title={p.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default App;
