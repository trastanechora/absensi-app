"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { Container, Box } from '@mui/material';
import { useCallback, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import type { LatLngExpression } from 'leaflet';

const greenOptions = { color: 'green', fillColor: 'green' };

interface Props {
	coords: [number, number];
	radius: number;
}

const InputMap = ({ coords, radius }: Props) => {
	const markerRef = useRef(null);
	const mapRef = useRef(null);

	const CustomMapWithMarker = useCallback(({ coord }: { coord: LatLngExpression }) => {
		return (
			<>
				<Circle
					center={coords}
					pathOptions={greenOptions}
					radius={radius}
				/>
				<Marker ref={markerRef} position={coord}>
					<Popup>
						Titik tengah lokasi
					</Popup>
				</Marker>
			</>
		)
	}, [coords, radius]);

	if (!coords[0] || !coords[1]) return null;

	return (
		<Container maxWidth={false} disableGutters sx={{ width: '100%', marginBottom: 3 }}>
			<Box sx={{ width: '100%' }}>
				<MapContainer
					ref={mapRef}
					preferCanvas={true}
					center={coords}
					zoom={17}
					style={{ height: "300px", width: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					<CustomMapWithMarker coord={coords} />
				</MapContainer>
			</Box>
		</Container>
  );
}

export default InputMap;