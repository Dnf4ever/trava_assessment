// Encode the filters using SHA-256 and Base64
const encodeFilters = async (filters) => {
    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(JSON.stringify(filters))
    );
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

// Decode from Base64 to retrieve filter object
const decodeBase64 = (base64) => {
    try {
        return JSON.parse(new TextDecoder().decode(
            new Uint8Array([...atob(base64.replace(/-/g, "+").replace(/_/g, "/"))].map(c => c.charCodeAt(0)))
        ));
    } catch {
        return null;
    }
};

// Save the filters to the URL
const saveFilters = async (filters) => {
    window.history.pushState({}, "", `?filter=${await encodeFilters(filters)}`);
};

// Load and apply the filters from the URL
const loadFiltersFromUrl = () => {
    const filters = decodeBase64(new URLSearchParams(window.location.search).get("filter"));
    if (filters) applyFiltersToUI(filters);
};

// Mock function to apply the filters
const applyFiltersToUI = (filters) => console.log("Applying Filters:", filters);

window.onload = loadFiltersFromUrl;

// Example usage
saveFilters({ first_name: "John", age: 30, sort: "age" });

