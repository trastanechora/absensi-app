"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import Leaflet from 'leaflet';
import type { LatLngExpression } from 'leaflet';

// const officeCoordinates: LatLngExpression = [-6.342705163707955, 106.57729809989186];
const greenOptions = { color: 'green', fillColor: 'green' };

interface Props {
	setCurrentPayload: (coords: number[], distance: number) => void;
}

const InputMap = ({ setCurrentPayload }: Props) => {
	const [map, setMap] = useState(false);
  const [coord, setCoord] = useState<LatLngExpression>([-6.175195012186339, 106.8272447777918]);
	
	return (
		<MapContainer
			// @ts-ignore
			ref={setMap}
			
			preferCanvas={true}
			center={coord}
			zoom={17}
			style={{ height: "300px", maxWidth: "430px" }}
		>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
			<Marker position={coord}>
				<Popup>
					Posisi anda saat ini, muat ulang halaman ini untuk memperbarui.
				</Popup>
			</Marker>
		</MapContainer>
  );
}

export default InputMap;