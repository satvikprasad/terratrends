import "./App.css";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJsonObject, Feature } from "geojson";

import countyData from "./data/us_counties.json";

import * as L from "leaflet";
import { useCallback } from "react";
import Sidebar from "./components/Sidebar";
import { MapProvider, useMapState } from "./Map";

function RenderCounties(): React.JSX.Element {
    const map = useMap();

    const { setCounty } = useMapState();

    const mouseOverCounty = useCallback((e: L.LeafletMouseEvent) => {
        e.target.setStyle({
            fillColor: "#ff6b6b",
        });
    }, []);

    const mouseLeaveCounty = useCallback((e: L.LeafletMouseEvent) => {
        e.target.setStyle(countyStyle);
    }, []);

    const onEachCounty: (feature: Feature, layer: L.Layer) => void = (
        feature,
        layer
    ) => {
        const name = feature.properties?.NAME;

        if (!name) {
            return;
        }

        const center = L.geoJSON(feature).getBounds().getCenter();

        layer.on("mouseover", mouseOverCounty);
        layer.on("mouseout", mouseLeaveCounty);
        layer.on("mousedown", () => {
            setCounty?.(name);
        });

        const marker = L.marker(center, {
            icon: L.divIcon({
                className: "county-label",
                html: `<div class="county-label-inner">${name}</div>`,
                iconSize: undefined,
            }),
        });

        marker.addTo(map);
    };

    const countyStyle = {
        fillColor: "#e6f3ff",
        weight: 2,
        opacity: 0.8,
        color: "#ff3385",
    };

    return (
        <GeoJSON
            data={countyData as GeoJsonObject}
            style={countyStyle}
            onEachFeature={onEachCounty}
        />
    );
}

function App() {
    return (
        <MapProvider>
            <div className="flex flex-row w-screen h-screen">
                <Sidebar/>
                <div className="w-full flex flex-col">
                    <MapContainer
                        center={[33.275, -84.441]}
                        zoom={8}
                        scrollWheelZoom={false}
                        style={{
                            height: "100vh",
                            width: "100%"
                        }}
                    >
                        <RenderCounties />
                    </MapContainer>
                </div>
            </div>
        </MapProvider>
    );
}

export default App;
