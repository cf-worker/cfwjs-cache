export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    const cache = caches.default
    const cacheKey = new Request(request.url)

    if (request.method === "POST") {
      const response = new Response(request.body)
      await cache.put(cacheKey, response)
      return await cache.match(cacheKey) ?? new Response(null, { status: 404 })
    }

    if (request.method === "GET") {
      return await cache.match(cacheKey) ?? new Response(null, { status: 404 })
    }

    if (request.method === "DELETE") {
      cache.delete(cacheKey)
      return new Response(null, { status: 204 })
    }

    return new Response(null, { status: 405 })
  }
}
