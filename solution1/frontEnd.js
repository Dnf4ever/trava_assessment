const saveFilters = async (filters) => {
    const response = await fetch("http://localhost:3000/save-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });
    const data = await response.json();
    const shortUrl = data.shortUrl;  // e.g., "https://app.trava.com/users?filter=abc123xyz"

    // Update the URL in the browser's address bar (without reloading the page)
    window.history.pushState({}, "", shortUrl);

    return shortUrl;
};

const loadFiltersFromUrl = async () => {
    const params = new URLSearchParams(window.location.search);
    const filterHash = params.get("filter");

    if (filterHash) {
        const response = await fetch(`http://localhost:3000/filters/${filterHash}`);
        if (response.ok) {
            const data = await response.json();
            applyFiltersToUI(data.filters); // This is the function to update the table
        }
    }
};

// Apply the filters dynamically when loading the page
const applyFiltersToUI = (filters) => {
    console.log("Applying Filters:", filters);
    // Other logic to update the UI would go here
};

window.onload = loadFiltersFromUrl;
