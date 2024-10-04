export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    const cache = caches.default
    const cacheKey = request.url

    async function getCachedResponse(status) {
      const start = Date.now()
      let response = await cache.match(cacheKey) ?? new Response(null, { status: 404 })
      const elapsed = Date.now() - start
      response = new Response(response.body, response)
      response.headers.set("X-Elapsed", elapsed.toString())
      if (status) response.status = status
      return response
    }

    switch (request.method) {
      case "GET": return getCachedResponse()

      case "POST":
        const response = new Response(request.body, request)
        await cache.put(cacheKey, response)
        return getCachedResponse(204)

      case "DELETE":
        if (await cache.delete(cacheKey)) {
          return new Response(null, { status: 204 })
        } else {
          return new Response(null, { status: 404 })
        }
    }

    return new Response(null, { status: 405 })
  }
}
