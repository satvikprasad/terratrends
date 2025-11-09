import { createContext, useContext, useState } from "react";

const MapContext = createContext<{
    county: string | null;
    setCounty: React.Dispatch<React.SetStateAction<string | null>> | null;
}>({
    county: null,
    setCounty: null,
});

export function MapProvider({ children }: React.PropsWithChildren) {
    const [county, setCounty] = useState<string | null>(null);

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
