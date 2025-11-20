export type BusinessPlace = {
    placeId: string;
    name: string;
    address: string;
    rating: number | null;
    totalRatings: number;
    priceLevel: number | null;
    types: string[];
};

export type FetchBusinessesRequest = {
    countyName: string;
    stateId: string;
    businessType: string;
    radiusMeters?: number;
};

export type FetchBusinessesSuccess = {
    businesses: BusinessPlace[];
};

export type FetchBusinessesError = {
    error: string;
};
