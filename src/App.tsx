import "./App.css";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";

import countyData from "./data/us_counties.json";

import * as L from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import { MapProvider, useMapState, type MapCounty } from "./Map";

function RenderCounties(): React.JSX.Element {
    const map = useMap();
    const geoJsonRef = useRef<L.GeoJSON>(null);

    const { county, setCounty } = useMapState();

    const [hoveredCounty, setHoveredCounty] = useState<MapCounty | null>(null);

    // Triggered when the selected county is updated
    useEffect(() => {
        if (!geoJsonRef.current) {
            return;
        }
    }, [county]);

    const mouseOverCounty = useCallback((e: L.LeafletMouseEvent) => {
        const feature = e.target.feature as Feature;

        setHoveredCounty({
            countyId: feature.properties?.COUNTY,
            stateId: feature.properties?.STATE,
            name: feature.properties?.NAME
        });
    }, []);

    const mouseLeaveCounty = useCallback(() => {
        setHoveredCounty(null);
    }, []);

    const onEachCounty: (feature: Feature, layer: L.Layer) => void = (
        feature,
        layer
    ) => {
        const name = feature.properties?.NAME;
        const countyId = feature.properties?.COUNTY;
        const stateId = feature.properties?.STATE;

        if (!name) {
            return;
        }

        const center = L.geoJSON(feature).getBounds().getCenter();

        layer.on("mouseover", mouseOverCounty);
        layer.on("mouseout", mouseLeaveCounty);

        layer.on("mousedown", () => {
            setCounty?.({
                stateId: stateId,
                countyId: countyId,
                name: name
            });
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

    const getCountyStyle = (feature: Feature<Geometry, any> | undefined) => {
        const stateId = feature?.properties?.STATE;
        const countyId = feature?.properties?.COUNTY;

        const isSelected =
            stateId == county?.stateId && countyId == county?.countyId;

        const isHovering =
            stateId == hoveredCounty?.stateId &&
            countyId == hoveredCounty?.countyId;

        if (isHovering) {
            return {
                fillColor: "#7391ba",
                weight: 2,
                opacity: 0.8,
                color: "#757575",
            };
        }

        if (isSelected) {
            return {
                fillColor: "#006cff",
                weight: 2,
                opacity: 1.0,
                color: "#757575",
            };
        }

        return {
            fillColor: "#d6e7ff",
            weight: 2,
            opacity: 0.8,
            color: "#757575",
        };
    };

    return (
        <GeoJSON
            ref={geoJsonRef}
            data={countyData as GeoJsonObject}
            style={getCountyStyle}
            onEachFeature={onEachCounty}
        />
    );
}

function App() {
    return (
        <MapProvider>
            <div className="flex flex-row w-screen h-screen">
                <Sidebar />
                <div className="w-full flex flex-col">
                    <MapContainer
                        center={[33.275, -84.441]}
                        minZoom={7.5}
                        zoom={8}
                        maxZoom={9}
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
            <div className="absolute top-3 right-3 z-1000 bg-white p-3 rounded-xl flex flex-col gap-2 shadow-md">
                <h1 className="font-bold text-xl text-center">Forecasted Growth</h1>
                <div className="w-60 h-10 bg-linear-to-r from-red-500 via-white to-blue-600 rounded-xl"></div>
                <div className="grid grid-cols-2 text-sm text-slate-700 mx-1">
                    <p>Negative</p>
                    <p className="text-right">Positive</p>
                </div>
            </div>
        </MapProvider>
    );
}

export default App;
