export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    const cache = caches.default
    const cacheKey = request.url

    async function getCachedResponse() {
      const start = Date.now()
      const response = (await cache.match(cacheKey))?.clone() ?? new Response(null, { status: 404 })
      const elapsed = Date.now() - start
      response.headers.set("X-Elapsed", elapsed.toString())
      return response
    }

    if (request.method === "POST") {
      const response = new Response(request.body)
      await cache.put(cacheKey, response)
      return getCachedResponse()
    }

    if (request.method === "GET") {
      return getCachedResponse()
    }

    if (request.method === "DELETE") {
      cache.delete(cacheKey)
      return new Response(null, { status: 204 })
    }

    return new Response(null, { status: 405 })
  }
}
