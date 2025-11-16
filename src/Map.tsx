import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type MapCounty = {
    stateId: number;
    countyId: number;
    name: string;
};

const MapContext = createContext<{
    // Represented by tuple of state id, and county id
    county: MapCounty | null;
    setCounty: (county: MapCounty) => void;

    businessType: string | null;
    setBusinessType: (businessType: string) => void;
}>({
    county: null,
    setCounty: () => {},

    businessType: null,
    setBusinessType: () => {}
});

type MapState = {
    county: MapCounty | null;
    businessType: string | null;
};

export function MapProvider({ children }: React.PropsWithChildren) {
    const [mapState, setMapState] = useState<MapState>({
        county: null,
        businessType: null,
    });

    const setCountyWithBusinessTypeCheck = useCallback((county: MapCounty) => {
        setMapState((s) => {
            if (s.businessType == null) return s; // Don't allow changes to selected county if 
                                                  // business type hasn't been specified.

            return {
                businessType: s.businessType,
                county
            };
        });
    }, [setMapState]);

    return (
        <MapContext.Provider
            value={{
                county: mapState.county,
                setCounty: setCountyWithBusinessTypeCheck,

                businessType: mapState.businessType,
                setBusinessType: (b) => {
                    setMapState((s) => {
                        return {
                            businessType: b,
                            county: s.county
                        };
                    })
                }
            }}
        >
            {children}
        </MapContext.Provider>
    );
}

export function useMapState() {
    return useContext(MapContext);
}
