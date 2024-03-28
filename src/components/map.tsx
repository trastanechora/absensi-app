"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, Marker, Popup, TileLayer, Circle } from "react-leaflet";
import Leaflet from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { useNotificationContext } from '@/context/notification';

const greenOptions = { color: 'green', fillColor: 'green' };

interface Props {
	officeCoordinates: number[];
	radius: number;
	setCurrentPayload: (coords: number[], distance: number) => void;
}

const Map = ({ officeCoordinates, radius, setCurrentPayload }: Props) => {
  const [_, dispatch] = useNotificationContext();
	const [map, setMap] = useState(false);
  const [coord, setCoord] = useState<LatLngExpression>([-6.175195012186339, 106.8272447777918]); // Monas

	const errorFunction = useCallback(() => {
		dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Gagal memuat lokasi, pastikan Anda terhubung ke internet kemudian muat ulang halaman`, severity: 'error' } });
	}, [])

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
				dispatch({ type: 'OPEN_NOTIFICATION', payload: { message: `Akses lokasi tidak didukung pada perangkat Anda, mohon hubungi admin`, severity: 'error' } });
			}
		}
	}, [map, officeCoordinates, setCurrentPayload, errorFunction, dispatch]);
	
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