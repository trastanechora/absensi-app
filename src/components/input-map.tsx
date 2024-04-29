"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { Autocomplete, TextField, Container, Box, FormControl } from '@mui/material';
import { useCallback, useState, useMemo, useRef, useEffect, forwardRef } from 'react';
import type { RefAttributes } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useMapEvents } from 'react-leaflet/hooks'
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import type { LatLngExpression } from 'leaflet';

// const officeCoordinates: LatLngExpression = [-6.342705163707955, 106.57729809989186];
const greenOptions = { color: 'green', fillColor: 'green' };

interface Props {
	coords: [number, number];
	setCurrentPayload: (coords: number[]) => void;
}

interface CustomMapProps {
	coord: LatLngExpression;
	setCoord: (latLong: [number, number]) => void
	eventHandlers: () => void;
}

// @ts-ignore
const CustomMapWithMarker = forwardRef<RefAttributes<LeafletMarker<any>>, CustomMapProps>(({ coord, setCoord, eventHandlers }, ref) => {
	const currentMap = useMapEvents({
		click: (e) => {
			setCoord([e.latlng.lat, e.latlng.lng]);
			currentMap.setView([e.latlng.lat, e.latlng.lng]);
		},
	})

	return (
		// @ts-ignore
		<Marker ref={ref} position={coord} draggable eventHandlers={eventHandlers}>
			<Popup>
				Titik tengah lokasi
			</Popup>
		</Marker>
	)
});

const InputMap = ({ coords, setCurrentPayload }: Props) => {
	const provider = new OpenStreetMapProvider();
	const markerRef = useRef(null);
	const mapRef = useRef(null);
	const [coord, setCoord] = useState<LatLngExpression>(coords);
	const [search, setSearch] = useState('');
	const [placeOptions, setPlaceOptions] = useState<{ label: string, value: number[] }[]>([]);
	
	const eventHandlers = useMemo(
		() => ({
			dragend() {
				const marker = markerRef.current;
				// @ts-ignore
				const position = marker?.getLatLng();
				// @ts-ignore
				mapRef.current?.setView([position.lat, position.lng]);
				setCurrentPayload([position.lat, position.lng]);
			},
		}),
		[mapRef.current, setCurrentPayload],
	);

	// @ts-ignore
	const handleSearch = (e) => {
		console.warn('[DEBUG] seearch', e.target.value);
		setSearch(e.target.value);
	}

	const handleLocationChange = useCallback((coords: [number, number]) => {
		setCoord(coords);
		setCurrentPayload(coords)
	}, [])

	useEffect(() => {
		if (!search && placeOptions.length !== 0) {
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
  }, [search, provider])

	return (
		<Container maxWidth={false} disableGutters sx={{ width: '100%', marginBottom: 3 }}>
			<Box sx={{ width: '100%' }}>
				<FormControl fullWidth>
					<Autocomplete
						id="select-place-autocomplete"
						options={placeOptions}
						getOptionLabel={(option) => option.label}
				// @ts-ignore
						onChange={(_, newValue: { label: string, value: number[] }) => {
							if (newValue == null) return;
							// @ts-ignore
							// setCoord(newValue.value);
							// @ts-ignore
							mapRef.current?.setView(newValue.value);
							setCurrentPayload(newValue.value);
						}}

						renderInput={(params) => (
							<TextField
								{...params}
								variant="filled"
								id="name-input"
								label="Cari Kota / Kabupaten"
								name="name"
								onChange={handleSearch}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
						noOptionsText="Ketik untuk mencari..."
					/>
				</FormControl>
			</Box>
			<Box sx={{ width: '100%' }}>
				<MapContainer
					ref={mapRef}
					preferCanvas={true}
					center={coord}
					zoom={17}
					style={{ height: "300px", width: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{/* @ts-ignore */}
					<CustomMapWithMarker ref={markerRef} coord={coord} setCoord={handleLocationChange} eventHandlers={eventHandlers} />
				</MapContainer>
			</Box>
		</Container>
  );
}

CustomMapWithMarker.displayName = 'CustomMapWithMarker';
InputMap.displayName = 'InputMap';
export default InputMap;