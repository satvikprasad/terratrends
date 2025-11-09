import { createContext, useContext, useState } from "react";

export type MapCounty = {
    stateId: number;
    countyId: number;
    name: string;
};

const MapContext = createContext<{
    // Represented by tuple of state id, and county id
    county: MapCounty | null;
    setCounty: React.Dispatch<React.SetStateAction<MapCounty | null>> | null;
}>({
    county: null,
    setCounty: null,
});

export function MapProvider({ children }: React.PropsWithChildren) {
    const [county, setCounty] = useState<MapCounty | null>(null);

    return (
        <MapContext.Provider
            value={{
                county,
                setCounty,
            }}
        >
            {children}
        </MapContext.Provider>
    );
}

export function useMapState() {
    return useContext(MapContext);
}
