const saveFilters = async (filters) => {
    const response = await fetch("http://localhost:3000/save-filters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters)
    });
    const data = await response.json();
    return data.shortUrl;  // e.g., "https://app.trava.com/users?filter=abc123xyz"
};
