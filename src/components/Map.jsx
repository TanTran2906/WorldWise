import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { useContext, useEffect, useState } from "react";
import { CitiesContext } from "../App";

function convertCountryCodeToFlagEmoji(flag) {
    var countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
        .map((char) => String.fromCharCode(char - 127397).toLowerCase())
        .join("");
    return (
        <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
    );
}

function Map() {
    const { cities } = useContext(CitiesContext);
    const [mapPosition, setMapPosition] = useState([50, 0]);

    const [searchParams] = useSearchParams();
    const mapLat = searchParams.get("lat");
    const mapLng = searchParams.get("lng");

    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker
                        position={[city.position.lat, city.position.lng]}
                        key={city.id}
                    >
                        <Popup>
                            {convertCountryCodeToFlagEmoji(city.emoji)}{" "}
                            {city.cityName}
                        </Popup>
                    </Marker>
                ))}
                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({ position }) {
    const map = useMap();
    if (!position[0] || !position[1]) return null;
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => console.log(e),
    });
}

export default Map;
