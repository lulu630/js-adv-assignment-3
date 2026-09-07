// Deploy this file as a Cloudflare Worker.
// Set CAT_API_KEY as a Secret in the Worker's settings.
export default {
  async fetch(request, env, ctx) {
    const headers = { "Access-Control-Allow-Origin": "*" };
    const reply = (message, status) => Response.json({ message }, { status, headers });

    if (request.method !== "GET") return reply("Method not allowed", 405);
    const url = new URL(request.url);
    const upstream = new URL("https://api.thecatapi.com");
    upstream.pathname = url.pathname;

    if (url.pathname === "/v1/images/search") {
      const breed = url.searchParams.get("breed_ids") || "";
      if (!/^[a-z]{4}$/.test(breed)) return reply("Invalid breed", 400);
      upstream.searchParams.set("breed_ids", breed);
      upstream.searchParams.set("limit", "1");
    } else if (url.pathname !== "/v1/breeds") {
      return reply("Not found", 404);
    }

    if (!env.CAT_API_KEY) return reply("Cat service is not configured", 503);

    // Cache successful responses to reduce use of the API quota.
    const cacheUrl = new URL(request.url);
    cacheUrl.search = upstream.search;
    const cacheKey = new Request(cacheUrl.toString());
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const result = await fetch(upstream, {
        headers: { "x-api-key": env.CAT_API_KEY },
        signal: AbortSignal.timeout(15000),
      });
      if (!result.ok) return reply("Could not load cats from the provider", 502);
      const data = await result.json();
      if (!Array.isArray(data)) return reply("Invalid provider response", 502);
      const response = Response.json(data, {
        headers: { ...headers, "Cache-Control": "public, max-age=3600" },
      });
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch {
      return reply("Cat service is temporarily unavailable", 502);
    }
  },
};
