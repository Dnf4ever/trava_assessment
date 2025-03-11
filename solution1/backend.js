const express = require("express");
const crypto = require("crypto");
const redis = require("redis");

const app = express();
const PORT = 3000;

// Redis client setup for caching filters
const client = redis.createClient({
    socket: { host: "localhost", port: 6379 }
});
client.connect();

app.use(express.json());

// Function to generate a SHA-256 hash (URL-safe)
function generateHash(filterObject) {
    const jsonString = JSON.stringify(filterObject);
    const hash = crypto.createHash("sha256").update(jsonString).digest("base64url"); // URL-safe base64
    return hash.substring(0, 10); // Shorten to first 10 characters which should be collision-resistant enough
}

// Save the filter state and return the short URL hash
app.post("/save-filters", async (req, res) => {
    const filters = req.body;
    const hash = generateHash(filters);

    // Store in Redis with a time to live
    await client.setEx(`filter:${hash}`, 604800, JSON.stringify(filters));

    res.json({ shortUrl: `https://app.trava.com/users?filter=${hash}` });
});

// Retrieve the filter state from hash
app.get("/filters/:hash", async (req, res) => {
    const hash = req.params.hash;
    const filterData = await client.get(`filter:${hash}`);

    if (!filterData) {
        return res.status(404).json({ error: "Filter state not found" });
    }

    res.json({ filters: JSON.parse(filterData) });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
