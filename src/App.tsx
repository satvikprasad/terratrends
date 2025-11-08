import "./App.css";

import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import type { GeoJsonObject, Feature } from "geojson";

import countyData from "./data/us_counties.json";

import * as L from "leaflet";
import { useCallback } from "react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "./components/ui/sidebar";

function RenderCounties(): React.JSX.Element {
    const map = useMap();

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
        <>
            <SidebarProvider>
                <div className="flex flex-row">
                    <Sidebar>
                        <SidebarContent>
                            <SidebarGroup>
                                <SidebarGroupLabel>
                                    TerraTrends
                                </SidebarGroupLabel>
                                <SidebarGroupContent>
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton>
                                                Demo Button
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>
                    </Sidebar>
                    <div className="min-h-screen">
                        <MapContainer
                            center={[33.275, -84.441]}
                            zoom={8}
                            scrollWheelZoom={false}
                            style={{
                                height: "100vh",
                                width: "100vw",
                            }}
                        >
                            <RenderCounties />
                        </MapContainer>
                    </div>
                </div>
            </SidebarProvider>
        </>
    );
}

export default App;
