"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { Container, Box } from '@mui/material';
import { useCallback, useState, useRef, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import type { LatLngExpression } from 'leaflet';

// const officeCoordinates: LatLngExpression = [-6.342705163707955, 106.57729809989186];
const greenOptions = { color: 'green', fillColor: 'green' };

interface Props {
	coords: [number, number];
	radius: number;
}

const InputMap = ({ coords, radius }: Props) => {
	const provider = new OpenStreetMapProvider();
	const markerRef = useRef(null);
	const mapRef = useRef(null);
	const [search, setSearch] = useState('');
	const [placeOptions, setPlaceOptions] = useState<{ label: string, value: number[] }[]>([]);

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
	}, []);

	useEffect(() => {
		if (!search) {
			setPlaceOptions([]);
			return;
		};
		const delayDebounceFn = setTimeout(async () => {
			const results = await provider.search({ query: search });
			const normalizedResults = results.map(result => ({
				label: result.label,
				value: [result.y, result.x]
			}))

			setPlaceOptions(normalizedResults);
		}, 1000);

		return () => clearTimeout(delayDebounceFn);
  }, [search])

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