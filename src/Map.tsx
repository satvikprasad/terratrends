import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchCountyBusinesses } from "./lib/googlePlaces";
import type { BusinessPlace } from "./types/businesses";

export type MapCounty = {
    stateId: string;
    countyId: string;
    name: string;
};

const MapContext = createContext<{
    // Represented by tuple of state id, and county id
    county: MapCounty | null;
    setCounty: (county: MapCounty) => void;

    businessType: string | null;
    setBusinessType: (businessType: string) => void;

    businesses: BusinessPlace[];
    isFetchingBusinesses: boolean;
    businessError: string | null;
}>({
    county: null,
    setCounty: () => {},

    businessType: null,
    setBusinessType: () => {},

    businesses: [],
    isFetchingBusinesses: false,
    businessError: null,
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
    const [businesses, setBusinesses] = useState<BusinessPlace[]>([]);
    const [isFetchingBusinesses, setIsFetchingBusinesses] = useState(false);
    const [businessError, setBusinessError] = useState<string | null>(null);

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

    useEffect(() => {
        if (!mapState.county || !mapState.businessType) {
            setBusinesses([]);
            setIsFetchingBusinesses(false);
            setBusinessError(null);
            return;
        }

        let cancelled = false;

        async function loadBusinesses() {
            if (!mapState.county || !mapState.businessType) return;

            setIsFetchingBusinesses(true);
            setBusinessError(null);

            try {
                const results = await fetchCountyBusinesses({
                    countyName: mapState.county.name,
                    stateId: mapState.county.stateId,
                    businessType: mapState.businessType,
                });

                if (!cancelled) {
                    setBusinesses(results);
                }
            } catch (error) {
                if (!cancelled) {
                    setBusinessError(
                        error instanceof Error
                            ? error.message
                            : "Unable to fetch businesses for this county."
                    );
                    setBusinesses([]);
                }
            } finally {
                if (!cancelled) {
                    setIsFetchingBusinesses(false);
                }
            }
        }

        void loadBusinesses();

        return () => {
            cancelled = true;
        };
    }, [mapState.county, mapState.businessType]);

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
                    });
                },

                businesses,
                isFetchingBusinesses,
                businessError,
            }}
        >
            {children}
        </MapContext.Provider>
    );
}

export function useMapState() {
    return useContext(MapContext);
}
