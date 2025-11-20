
import os
import sys
import requests
import json
from typing import List, Dict, Optional

class PlacesSearcher:
    """Search for places using Google Places API."""

    def __init__(self, api_key: str):
        """Initialize with Google API key."""
        self.api_key = api_key
        self.base_url = "https://maps.googleapis.com/maps/api/place"

    def geocode_county(self, county_name: str, state: str = "Georgia") -> Optional[Dict]:
        """
        Geocode a county to get its location and bounds.

        Args:
            county_name: Name of the county (e.g., "Fulton")
            state: State name (default: "Georgia")

        Returns:
            Dictionary with location data or None if not found
        """
        geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"

        # Format the address to include "County" if not already present
        if "county" not in county_name.lower():
            county_name = f"{county_name} County"

        address = f"{county_name}, {state}, USA"

        params = {
            "address": address,
            "key": self.api_key
        }

        try:
            response = requests.get(geocode_url, params=params)
            response.raise_for_status()
            data = response.json()

            if data["status"] == "OK" and len(data["results"]) > 0:
                result = data["results"][0]
                return {
                    "formatted_address": result["formatted_address"],
                    "location": result["geometry"]["location"],
                    "bounds": result["geometry"].get("bounds"),
                    "viewport": result["geometry"].get("viewport")
                }
            else:
                print(f"Geocoding error: {data.get('status', 'Unknown error')}")
                return None

        except requests.exceptions.RequestException as e:
            print(f"Error geocoding county: {e}")
            return None

    def search_places_text(self, query: str, location: Dict, radius: int = 20000) -> List[Dict]:
        """
        Search for places using Text Search API.

        Args:
            query: Search query (e.g., "gyms in Fulton County, Georgia")
            location: Dictionary with 'lat' and 'lng' keys
            radius: Search radius in meters (default: 20km)

        Returns:
            List of place dictionaries
        """
        search_url = f"{self.base_url}/textsearch/json"

        params = {
            "query": query,
            "location": f"{location['lat']},{location['lng']}",
            "radius": radius,
            "key": self.api_key
        }

        all_results = []

        try:
            while True:
                response = requests.get(search_url, params=params)
                response.raise_for_status()
                data = response.json()

                if data["status"] == "OK":
                    all_results.extend(data["results"])

                    # Check if there are more results
                    if "next_page_token" in data:
                        # Wait a bit before requesting the next page (required by Google API)
                        import time
                        time.sleep(2)
                        params = {
                            "pagetoken": data["next_page_token"],
                            "key": self.api_key
                        }
                    else:
                        break
                elif data["status"] == "ZERO_RESULTS":
                    print("No results found.")
                    break
                else:
                    print(f"Search error: {data.get('status', 'Unknown error')}")
                    if "error_message" in data:
                        print(f"Error message: {data['error_message']}")
                    break

        except requests.exceptions.RequestException as e:
            print(f"Error searching places: {e}")

        return all_results

    def search_places_nearby(self, category: str, location: Dict, radius: int = 20000) -> List[Dict]:
        """
        Search for places using Nearby Search API.

        Args:
            category: Business category/type (e.g., "gym", "restaurant")
            location: Dictionary with 'lat' and 'lng' keys
            radius: Search radius in meters (default: 20km)

        Returns:
            List of place dictionaries
        """
        search_url = f"{self.base_url}/nearbysearch/json"

        params = {
            "location": f"{location['lat']},{location['lng']}",
            "radius": radius,
            "keyword": category,
            "key": self.api_key
        }

        all_results = []

        try:
            while True:
                response = requests.get(search_url, params=params)
                response.raise_for_status()
                data = response.json()

                if data["status"] == "OK":
                    all_results.extend(data["results"])

                    # Check if there are more results
                    if "next_page_token" in data:
                        import time
                        time.sleep(2)
                        params = {
                            "pagetoken": data["next_page_token"],
                            "key": self.api_key
                        }
                    else:
                        break
                elif data["status"] == "ZERO_RESULTS":
                    print("No results found.")
                    break
                else:
                    print(f"Search error: {data.get('status', 'Unknown error')}")
                    if "error_message" in data:
                        print(f"Error message: {data['error_message']}")
                    break

        except requests.exceptions.RequestException as e:
            print(f"Error searching places: {e}")

        return all_results

    def format_place(self, place: Dict) -> str:
        """Format a place dictionary into a readable string."""
        name = place.get("name", "N/A")
        address = place.get("formatted_address", place.get("vicinity", "N/A"))
        rating = place.get("rating", "N/A")
        total_ratings = place.get("user_ratings_total", 0)
        types = ", ".join(place.get("types", [])[:3])  # First 3 types

        return (f"\n📍 {name}\n"
                f"   Address: {address}\n"
                f"   Rating: {rating} ⭐ ({total_ratings} reviews)\n"
                f"   Types: {types}\n"
                f"   Place ID: {place.get('place_id', 'N/A')}")


def main():
    """Main function to run the places search."""

    # Get API key from environment variable
    api_key = os.environ.get("GOOGLE_MAPS_API_KEY")

    if not api_key:
        print("Error: GOOGLE_MAPS_API_KEY environment variable not set.")
        print("\nTo set it, run:")
        print("  export GOOGLE_MAPS_API_KEY='your-api-key-here'")
        sys.exit(1)

    # Get user input
    if len(sys.argv) >= 3:
        county_name = sys.argv[1]
        category = sys.argv[2]
    else:
        print("🔍 Google Places Search for Georgia Counties\n")
        county_name = input("Enter county name (e.g., Fulton): ").strip()
        category = input("Enter business category (e.g., gym, restaurant, coffee shop): ").strip()

    if not county_name or not category:
        print("Error: County name and category are required.")
        sys.exit(1)

    # Initialize searcher
    searcher = PlacesSearcher(api_key)

    # Step 1: Geocode the county
    print(f"\n🌍 Finding location for {county_name} County, Georgia...")
    county_data = searcher.geocode_county(county_name, "Georgia")

    if not county_data:
        print(f"Could not find {county_name} County, Georgia.")
        sys.exit(1)

    print(f"✅ Found: {county_data['formatted_address']}")
    print(f"   Coordinates: {county_data['location']['lat']}, {county_data['location']['lng']}")

    # Step 2: Search for places
    print(f"\n🔎 Searching for '{category}' in {county_name} County...")

    # Use text search which tends to work better for county-wide searches
    query = f"{category} in {county_name} County, Georgia"
    results = searcher.search_places_text(query, county_data['location'], radius=30000)

    # If text search doesn't return many results, try nearby search
    if len(results) < 5:
        print(f"   Trying nearby search...")
        nearby_results = searcher.search_places_nearby(category, county_data['location'], radius=30000)
        # Merge results, avoiding duplicates
        existing_ids = {place['place_id'] for place in results}
        for place in nearby_results:
            if place['place_id'] not in existing_ids:
                results.append(place)

    # Step 3: Display results
    print(f"\n✨ Found {len(results)} results for '{category}' in {county_name} County:\n")
    print("=" * 80)

    for i, place in enumerate(results, 1):
        print(f"\n{i}. {searcher.format_place(place)}")

    print("\n" + "=" * 80)
    print(f"\nTotal: {len(results)} places found")

    # Automatically save results to JSON file
    filename = f"{county_name.lower()}_{category.replace(' ', '_')}_results.json"
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"\n💾 Results saved to {filename}")


if __name__ == "__main__":
    main()
