import type { BusinessPlace, RankedCounty } from "@/types/businesses";

const DEMO_BUSINESSES: BusinessPlace[] = [
    {
        placeId: "demo-1",
        name: "Downtown Café & Roasters",
        address: "123 Main St, Downtown",
        rating: 4.8,
        totalRatings: 342,
        priceLevel: 2,
        types: ["cafe", "restaurant", "food"],
    },
    {
        placeId: "demo-2",
        name: "The Local Bistro",
        address: "456 Oak Ave",
        rating: 4.6,
        totalRatings: 189,
        priceLevel: 3,
        types: ["restaurant", "meal_delivery", "meal_takeaway"],
    },
    {
        placeId: "demo-3",
        name: "Sunrise Coffee House",
        address: "789 Elm Blvd",
        rating: 4.5,
        totalRatings: 521,
        priceLevel: 1,
        types: ["cafe", "bakery", "store"],
    },
    {
        placeId: "demo-4",
        name: "Village Grill",
        address: "321 County Rd",
        rating: 4.4,
        totalRatings: 276,
        priceLevel: 2,
        types: ["restaurant", "bar", "food"],
    },
    {
        placeId: "demo-5",
        name: "Corner Cup Coffee",
        address: "555 Center St",
        rating: 4.3,
        totalRatings: 98,
        priceLevel: 1,
        types: ["cafe", "point_of_interest"],
    },
];

/**
 * Returns demo business listings for the Businesses tab.
 * Use this instead of the API when running without Google Maps / server.
 */
export function getDemoBusinesses(_countyName: string, _businessType: string): BusinessPlace[] {
    return [...DEMO_BUSINESSES];
}

export const DEMO_RANKED_COUNTIES: RankedCounty[] = [
    { rank: 1, id: 1, county: "Fulton, GA", population: 1066710, score: 92.4, tier: "Tier 1", survival_prob: 0.87, revenue_score: 91.2, projected_revenue: 520000, sector_growth_pct: 5.8, annual_growth_rate: 4.1, economic_adjustment: 1.05, p_shrinking: 0.05, p_flat: 0.1, p_moderate: 0.3, p_strong: 0.55, status: "ok", notes: "" },
    { rank: 2, id: 2, county: "Gwinnett, GA", population: 957062, score: 88.1, tier: "Tier 1", survival_prob: 0.84, revenue_score: 87.5, projected_revenue: 480000, sector_growth_pct: 5.2, annual_growth_rate: 3.8, economic_adjustment: 1.02, p_shrinking: 0.06, p_flat: 0.12, p_moderate: 0.32, p_strong: 0.5, status: "ok", notes: "" },
    { rank: 3, id: 3, county: "Cobb, GA", population: 766149, score: 85.3, tier: "Tier 1", survival_prob: 0.82, revenue_score: 84.0, projected_revenue: 450000, sector_growth_pct: 4.9, annual_growth_rate: 3.5, economic_adjustment: 1.01, p_shrinking: 0.07, p_flat: 0.13, p_moderate: 0.33, p_strong: 0.47, status: "ok", notes: "" },
    { rank: 4, id: 4, county: "DeKalb, GA", population: 762598, score: 82.7, tier: "Tier 2", survival_prob: 0.79, revenue_score: 81.3, projected_revenue: 420000, sector_growth_pct: 4.5, annual_growth_rate: 3.2, economic_adjustment: 0.99, p_shrinking: 0.08, p_flat: 0.14, p_moderate: 0.35, p_strong: 0.43, status: "ok", notes: "" },
    { rank: 5, id: 5, county: "Cherokee, GA", population: 272198, score: 79.5, tier: "Tier 2", survival_prob: 0.76, revenue_score: 78.8, projected_revenue: 390000, sector_growth_pct: 4.1, annual_growth_rate: 3.0, economic_adjustment: 0.98, p_shrinking: 0.09, p_flat: 0.16, p_moderate: 0.36, p_strong: 0.39, status: "ok", notes: "" },
    { rank: 6, id: 6, county: "Forsyth, GA", population: 251283, score: 77.2, tier: "Tier 2", survival_prob: 0.74, revenue_score: 76.1, projected_revenue: 370000, sector_growth_pct: 3.8, annual_growth_rate: 2.8, economic_adjustment: 0.97, p_shrinking: 0.1, p_flat: 0.17, p_moderate: 0.37, p_strong: 0.36, status: "ok", notes: "" },
    { rank: 7, id: 7, county: "Hall, GA", population: 207031, score: 74.0, tier: "Tier 2", survival_prob: 0.71, revenue_score: 73.5, projected_revenue: 345000, sector_growth_pct: 3.5, annual_growth_rate: 2.5, economic_adjustment: 0.96, p_shrinking: 0.11, p_flat: 0.18, p_moderate: 0.38, p_strong: 0.33, status: "ok", notes: "" },
    { rank: 8, id: 8, county: "Richmond, GA", population: 202518, score: 70.8, tier: "Tier 3", survival_prob: 0.67, revenue_score: 69.9, projected_revenue: 310000, sector_growth_pct: 3.1, annual_growth_rate: 2.1, economic_adjustment: 0.94, p_shrinking: 0.13, p_flat: 0.2, p_moderate: 0.39, p_strong: 0.28, status: "ok", notes: "" },
    { rank: 9, id: 9, county: "Muscogee, GA", population: 195769, score: 67.5, tier: "Tier 3", survival_prob: 0.64, revenue_score: 66.8, projected_revenue: 285000, sector_growth_pct: 2.8, annual_growth_rate: 1.9, economic_adjustment: 0.93, p_shrinking: 0.14, p_flat: 0.22, p_moderate: 0.4, p_strong: 0.24, status: "ok", notes: "" },
    { rank: 10, id: 10, county: "Bibb, GA", population: 153159, score: 63.2, tier: "Tier 3", survival_prob: 0.60, revenue_score: 62.5, projected_revenue: 255000, sector_growth_pct: 2.4, annual_growth_rate: 1.6, economic_adjustment: 0.91, p_shrinking: 0.16, p_flat: 0.24, p_moderate: 0.41, p_strong: 0.19, status: "ok", notes: "" },
];
