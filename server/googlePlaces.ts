import { getStateNameFromFips } from "../src/lib/stateFips";
import type { BusinessPlace, FetchBusinessesRequest } from "../src/types/businesses";

type LatLng = {
    lat: number;
    lng: number;
};

type GooglePlace = {
    place_id: string;
    name: string;
    rating?: number;
    user_ratings_total?: number;
    formatted_address?: string;
    vicinity?: string;
    price_level?: number;
    types?: string[];
};

type GeocodeResult = {
    formatted_address: string;
    location: LatLng;
};

const GOOGLE_MAPS_BASE_URL = "https://maps.googleapis.com/maps/api";
const FETCH_DELAY_MS = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGoogle<T>(endpoint: string, params: URLSearchParams): Promise<T> {
    const response = await fetch(`${GOOGLE_MAPS_BASE_URL}/${endpoint}?${params.toString()}`);

    if (!response.ok) {
        throw new Error(`Google Maps request failed (${response.status})`);
    }

    return response.json() as Promise<T>;
}

async function geocodeCounty(
    apiKey: string,
    countyName: string,
    stateName: string
): Promise<GeocodeResult> {
    const formattedCounty = countyName.toLowerCase().includes("county")
        ? countyName
        : `${countyName} County`;

    const params = new URLSearchParams({
        key: apiKey,
        address: `${formattedCounty}, ${stateName}, USA`,
    });

    type GeocodeResponse = {
        status: string;
        results: Array<{
            formatted_address: string;
            geometry: { location: LatLng };
        }>;
        error_message?: string;
    };

    const data = await callGoogle<GeocodeResponse>("geocode/json", params);

    if (data.status !== "OK" || data.results.length === 0) {
        throw new Error(data.error_message ?? `Unable to find ${formattedCounty}, ${stateName}`);
    }

    const result = data.results[0];
    return {
        formatted_address: result.formatted_address,
        location: result.geometry.location,
    };
}

async function fetchPagedPlaces(
    apiKey: string,
    endpoint: string,
    params: Record<string, string>
): Promise<GooglePlace[]> {
    type PlacesResponse = {
        status: string;
        results: GooglePlace[];
        next_page_token?: string;
        error_message?: string;
    };

    const collected: GooglePlace[] = [];
    let pageToken: string | undefined;
    let pageCount = 0;

    do {
        const searchParams = pageToken
            ? new URLSearchParams({
                  key: apiKey,
                  pagetoken: pageToken,
              })
            : new URLSearchParams({
                  key: apiKey,
                  ...params,
              });

        const data = await callGoogle<PlacesResponse>(endpoint, searchParams);

        if (data.status === "OK") {
            collected.push(...data.results);
            pageToken = data.next_page_token;
            pageCount += 1;

            if (pageToken) {
                await sleep(FETCH_DELAY_MS);
            }
        } else if (data.status === "ZERO_RESULTS") {
            break;
        } else if (data.status === "INVALID_REQUEST" && pageToken) {
            await sleep(FETCH_DELAY_MS);
        } else {
            throw new Error(data.error_message ?? `Google Places error: ${data.status}`);
        }
    } while (pageToken && pageCount < 3);

    return collected;
}

async function searchTextPlaces(
    apiKey: string,
    query: string,
    location: LatLng,
    radiusMeters: number
) {
    return fetchPagedPlaces(apiKey, "place/textsearch/json", {
        query,
        location: `${location.lat},${location.lng}`,
        radius: radiusMeters.toString(),
    });
}

async function searchNearbyPlaces(
    apiKey: string,
    keyword: string,
    location: LatLng,
    radiusMeters: number
) {
    return fetchPagedPlaces(apiKey, "place/nearbysearch/json", {
        keyword,
        location: `${location.lat},${location.lng}`,
        radius: radiusMeters.toString(),
    });
}

function normalizePlaces(places: GooglePlace[]): BusinessPlace[] {
    return places.map((place) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address ?? place.vicinity ?? "Address unavailable",
        rating: typeof place.rating === "number" ? place.rating : null,
        totalRatings: place.user_ratings_total ?? 0,
        priceLevel: typeof place.price_level === "number" ? place.price_level : null,
        types: place.types ?? [],
    }));
}

export async function fetchCountyBusinessesServer({
    countyName,
    stateId,
    businessType,
    radiusMeters = 30000,
}: FetchBusinessesRequest): Promise<BusinessPlace[]> {
    const apiKey =
        process.env.GOOGLE_MAPS_API_KEY ??
        process.env.VITE_GOOGLE_MAPS_API_KEY ??
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ??
        "";

    if (!apiKey) {
        throw new Error(
            "Missing Google Maps API key. Set GOOGLE_MAPS_API_KEY in your environment."
        );
    }

    const stateName = getStateNameFromFips(stateId);

    if (!stateName) {
        throw new Error("Unable to determine state name for the selected county.");
    }

    const geocodeResult = await geocodeCounty(apiKey, countyName, stateName);

    const textQuery = `${businessType} in ${countyName} County, ${stateName}`;
    const textResults = await searchTextPlaces(apiKey, textQuery, geocodeResult.location, radiusMeters);

    let places = [...textResults];

    if (places.length < 5) {
        const nearbyResults = await searchNearbyPlaces(
            apiKey,
            businessType,
            geocodeResult.location,
            radiusMeters
        );
        const seen = new Set(places.map((place) => place.place_id));
        for (const place of nearbyResults) {
            if (!seen.has(place.place_id)) {
                places.push(place);
            }
        }
    }

    const normalized = normalizePlaces(places);

    return normalized.sort((a, b) => {
        const ratingDiff = (b.rating ?? 0) - (a.rating ?? 0);
        if (ratingDiff !== 0) {
            return ratingDiff;
        }

        return b.totalRatings - a.totalRatings;
    });
}

