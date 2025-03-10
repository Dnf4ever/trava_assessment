# trava_assessment
Trava Assessment for Employment

Hi ClEO,

Thanks for reaching out! I’m glad you like the filtering and sorting features, we put a lot of thought into making them as flexible as possible. I do agree with you that the URLs are pretty lengthy, and will only get longer if we add more filtering options. With that in mind, I came up with a couple of idea for making them shorter:

Encoding filters more efficiently – We could use a compact format to represent the filter state instead of listing each parameter explicitly. This would shorten the URL while still preserving the ability to share it.

Persistent filter state in the backend – We could generate a short unique identifier (e.g., ?filter_id=abc123) that maps to the full filter state stored on our servers. This would make URLs cleaner, but would require a bit of infrastructure for storing and expiring old filters.
I’d love to get your thoughts on these approaches! If this is a high priority, I can put together a more detailed plan with trade-offs and estimates on effort. Let me know how you’d like to proceed.

Regards,
Gabriel Diaz
