##Explanation

When a user applies filters to the table, like searching for users named John or filtering by age, the frontend captures that filter state as a structured object. 
Normally, these filters would be added directly to the URL, but instead of creating a long query string, the frontend sends the filter data to the backend.

Once the backend receives the filter state, it generates a unique, URL-safe hash. It does this by first converting the filter object into a JSON string and then creating a SHA-256 hash from it.
That hash is then encoded in a way that makes it short and safe to use in a URL. The backend stores this hash along with the full filter data in a redis cache, so it can be retrieved later.

After storing the filters, the backend responds with a shortened URL that includes only the hash—something like `https://app.trava.com/users?filter=abc123xyz`.
The frontend updates the browser’s URL with this new format, making it much cleaner and easier to share.

Now, when someone else clicks that shared link, the frontend reads the `filter` parameter from the URL and makes a request to the backend, asking for the filters associated with that hash.
The backend looks up the hash in the redis cache, retrieves the stored filter state, and sends it back as a JSON response. The frontend then applies those filters automatically, ensuring the table looks exactly as it did when the original user saved it.

To keep things efficient, the filters are saved to the redis cache with a time to live, which will expire and delete the filter after a period of time has passed.
This prevents unnecessary clutter while still allowing users to share and revisit their filtered views for a reasonable amount of time.

This approach makes URLs shorter and more user-friendly, keeps filter states persistent without exposing sensitive details in the URL, and ensures users can easily share the exact table view they intended.

##Next Steps

After the URL shortening feature is live, there are some possible UX enhancements that I would consider. Since today's world is connected via messaging apps, our phones, and the like, I think these 3 features would go a long way to enhance ease of sharing.

1) "Copy Link" Button – A simple button next to the filters that, when clicked, copies the shortened URL to the clipboard. This eliminates the need for users to manually highlight and copy the URL from the address bar. A small tooltip or toast notification could confirm that the link was copied successfully.

2) "Share via..." Options – A dropdown or modal with quick-sharing options for email, Slack, or other collaboration tools. Users could click a "Share" button and choose how they want to send the link, making it easier to distribute within teams.

3) QR Code Generation – A small QR code icon next to the filters that, when clicked, generates a QR code for the shortened URL. This would be useful for in-person collaboration, allowing someone to scan the code with their phone instead of copying and pasting a link.

##Ongoing Maintenance and other considerations

This isn't the full scope of ongoing maintenance, these are just some of the things that popped into my head as possible pain points and other possible considerations, security being a big one.

1) Redis Cache Cleanup & Expiration Handling – Since filter hashes are stored in Redis, it's important to manage expiration policies properly. Redis's built-in time-to-live settings should take care of this, but a background job should periodically clean up stale keys to ensure efficient memory usage and prevent unnecessary cache growth.

2) Monitoring for Hash Collisions – If the hash-generation method ever results in a duplicate (two different filter states producing the same hash), it could cause incorrect filters to be applied. Although this is highly unlikely due to the collision proof steps taken in the code, implementing logging or collision detection could help catch and resolve any issues that might pop up.

3) URL Format Compatibility – If the way filters are encoded ever changes (e.g., switching to a more compressed format), older links could break. A versioning system may be needed to ensure backward compatibility with previously generated filter links. Backwards compatibility could eventually be rolled off once the last filter hash of the old version expires in redis.

4) Performance Optimization with Redis – Since filter hashes are stored in Redis, lookups should be fast, but it's still important to optimize performance. Implementing proper key expiration policies, using efficient data structures, and monitoring Redis memory usage can help prevent slowdowns. If needed, a caching strategy like LRU (Least Recently Used) eviction can be implemented to remove the least accessed filters and keep the system running smoothly.

5) Security Audits – Since this system allows users to store and retrieve filter states, it's important to ensure that filters aren’t exposing sensitive data in an unintended way. Regular security reviews can help confirm that shared links are only revealing what they should.

##Timeline and testing

I think this feature could, in theory, be completed in a 2 week sprint, barring any major blockers or unexpected emergencies. Here I break down how it could be done.

In the first few days, planning and setup would be the priority. This includes defining how filters will be serialized, hashed, and stored in Redis, along with setting up the API endpoints for saving and retrieving filter states. If Redis isn’t already available, it needs to be provisioned. Once the foundation is set, development can begin immediately.  

By the middle of the first week, the core functionality should be in place. The backend needs to handle serialization, hashing, and Redis storage efficiently, while the frontend should be updated to generate and use the shortened URLs. By the end of the week, the core logic should be working, with early manual testing ensuring everything is functioning as expected.  

The second week would focus on testing, debugging, and deployment readiness. Unit and integration tests should validate that filters serialize and deserialize correctly, hashes remain unique, and Redis properly stores and expires keys. End-to-end testing should confirm that users can apply filters, generate a short URL, and reload the page with the same filters intact. Any performance concerns should be addressed, ensuring Redis can handle high traffic efficiently.  

By the end of the sprint, the feature should be deployed and monitored for any issues. Logging and monitoring tools should be in place to track API usage and Redis performance, while user feedback will help guide any necessary refinements.

Documentation should also be written so the team can maintain and troubleshoot the feature going forward, but this can be put in the backlog as a user story and done at a later date. I'm of the belief that proper documentation is really important, but for the sake of getting this feature out quickly, the documentation can be put off until later.
I'm also making the assumption that Redis would be the way to do this, but it isn't the only approach. Hashes could be stored in a database as well, which would replace the need for redis, but would add additional steps, like connecting to the database, the SQL query to store and retrieve the hashes, and so on.
