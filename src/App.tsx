import "./App.css";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";

import countyData from "./data/us_counties.json";

import * as L from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import { MapProvider, useMapState, type MapCounty } from "./Map";

import { stringToHash } from "./util/hash";

function CountySearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCounties, setFilteredCounties] = useState<MapCounty[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const { setCounty } = useMapState();

    const allCounties: MapCounty[] = useMemo(() =>
        countyData.features.map((feature) => ({
            name: feature.properties.NAME,
            stateId: parseInt(feature.properties.STATE),
            countyId: parseInt(feature.properties.COUNTY)
        })),
        []
    );

    useEffect(() => {
        const filtered = allCounties.filter(county =>
            county.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

        setFilteredCounties(filtered);
        setShowDropdown(filtered.length > 0);
    }, [searchTerm]);

    const handleCountySelect = (county: MapCounty) => {
        setCounty?.({
            name: county.name,
            stateId: county.stateId,
            countyId: county.countyId
        });
    };

    return (
        <div className="bg-white p-3 rounded-xl shadow-md relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search counties..."
                className="w-60 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-md max-h-60 overflow-y-auto z-10">
                    {filteredCounties.map((county) => (
                        <div
                            key={`${county.stateId}-${county.countyId}`}
                            onClick={() => handleCountySelect(county)}
                            className="p-3 hover:bg-blue-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        >
                            <p className="text-sm font-medium">{county.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function RenderCounties(): React.JSX.Element {
    const geoJsonRef = useRef<L.GeoJSON>(null);

    const { county, setCounty, businessType  } = useMapState();

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

        layer.on("mouseover", mouseOverCounty);
        layer.on("mouseout", mouseLeaveCounty);

        layer.on("mousedown", () => {
            setCounty?.({
                stateId: stateId,
                countyId: countyId,
                name: name
            });
        });
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

        if (businessType) {
            const name = feature?.properties?.NAME;

            // Generate a random float in [0, 1] by hashing the county's name (deterministic
            // pseudorandom).
            const t = stringToHash(name);

            let color;

            // Interpolate between blue and red (with white in the middle)
            // using naive math.
            if (t > 0.5) {
                const norm = 2*t - 1;
                color = `rgb(${255 - 255*norm}, ${255 - 255*norm}, 255)`;
            } else {
                const norm = 2*t;
                color = `rgb(255, ${255*norm}, ${255*norm})`;
            }

            return {
                fillColor: color,
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
            <div className="absolute top-3 right-3 z-1000 flex flex-col gap-2">
                <div className="bg-white p-3 rounded-xl flex flex-col gap-2 shadow-md">
                    <h1 className="font-bold text-xl text-center">Forecasted Growth</h1>
                    <div className="w-60 h-10 bg-linear-to-r from-red-500 via-white to-blue-600 rounded-xl"></div>
                    <div className="grid grid-cols-2 text-sm text-slate-700 mx-1">
                        <p>Negative</p>
                        <p className="text-right">Positive</p>
                    </div>
                </div>
                <CountySearch />
            </div>
        </MapProvider>
    );
}

export default App;
