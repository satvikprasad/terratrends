import type {
    BusinessPlace,
    FetchBusinessesRequest,
    FetchBusinessesError,
    FetchBusinessesSuccess,
} from "@/types/businesses";

const API_ENDPOINT = "/api/businesses";

export async function fetchCountyBusinesses({
    countyName,
    stateId,
    businessType,
    radiusMeters,
}: FetchBusinessesRequest): Promise<BusinessPlace[]> {
    const params = new URLSearchParams({
        countyName,
        stateId,
        businessType,
    });

    if (radiusMeters) {
        params.set("radiusMeters", radiusMeters.toString());
    }

    let response: Response;

    try {
        response = await fetch(`${API_ENDPOINT}?${params.toString()}`, {
            headers: {
                Accept: "application/json",
            },
        });
    } catch (error) {
        throw new Error("Unable to contact TerraTrends business API. Please try again.");
    }

    let payload: FetchBusinessesSuccess | FetchBusinessesError;
    try {
        payload = await response.json();
    } catch {
        throw new Error("Received an invalid response from the TerraTrends business API.");
    }

    if (!response.ok) {
        throw new Error(
            "error" in payload
                ? payload.error
                : "Failed to fetch businesses for the selected county."
        );
    }

    if ("error" in payload) {
        throw new Error(payload.error);
    }

    return payload.businesses;
}
