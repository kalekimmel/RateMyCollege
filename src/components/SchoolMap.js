import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AddMarkerOnClick = ({ setMarkers }) => {
  useMapEvent('click', (event) => {
    const { lat, lng } = event.latlng;
    setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
  });
  return null;
};

const SchoolMap = ({ schools }) => {
  const [markers, setMarkers] = useState([]);

  const allMarkers = useMemo(() =>
    [
      ...schools.filter(school => school.latitude && school.longitude).map((school, index) => ({
        position: [school.latitude, school.longitude],
        popup: (
          <Popup key={index}>
            <strong>{school.name}</strong><br />
            {school.address}<br />
            <a href={school.website} target="_blank" rel="noopener noreferrer">Website</a>
          </Popup>
        )
      })),
      ...markers.map((marker, index) => ({
        position: [marker.lat, marker.lng],
        popup: (
          <Popup key={index}>
            New Marker: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}
          </Popup>
        )
      }))
    ],
    [schools, markers]
  );

  return (
    <MapContainer center={[51.505, -0.09]} zoom={2} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {allMarkers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popup}
        </Marker>
      ))}
      <AddMarkerOnClick setMarkers={setMarkers} />
    </MapContainer>
  );
};

export default SchoolMap;