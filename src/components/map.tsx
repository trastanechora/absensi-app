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
	officeCoordinates: number[];
	radius: number;
	setCurrentPayload: (coords: number[], distance: number) => void;
}

const Map = ({ officeCoordinates, radius, setCurrentPayload }: Props) => {
	const [map, setMap] = useState(false);
  const [coord, setCoord] = useState<LatLngExpression>([-6.175195012186339, 106.8272447777918]);

	function errorFunction() {
		console.log("Unable to retrieve your location.");
	}

  useEffect(() => {
		if (map) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position: any) => {
					setCoord([position.coords.latitude, position.coords.longitude]);
					
					const officeLatLong = Leaflet.latLng(officeCoordinates as LatLngExpression);
					const distance = officeLatLong.distanceTo([position.coords.latitude, position.coords.longitude]);
					
					setCurrentPayload([position.coords.latitude, position.coords.longitude], distance)
					console.warn('[DEBUG] try find distance', officeLatLong.distanceTo([position.coords.latitude, position.coords.longitude]));
					
					// @ts-ignore
					map.setView([position.coords.latitude, position.coords.longitude], 17);
				}, errorFunction);
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}
	}, [map, officeCoordinates, setCurrentPayload]);
	
	return (
		<MapContainer
			// @ts-ignore
			ref={setMap}
			
			preferCanvas={true}
			center={coord}
			zoom={17}
			style={{ height: "400px", maxWidth: "430px" }}
		>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<Circle
			center={officeCoordinates as LatLngExpression}
			pathOptions={greenOptions}
			radius={radius}
		/>
			<Marker position={coord}>
				<Popup>
					Posisi anda saat ini, muat ulang halaman ini untuk memperbarui.
				</Popup>
			</Marker>
		</MapContainer>
  );
}

export default Map;