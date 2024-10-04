export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    try {
      const cache = caches.default
      const cacheKey = request.url

      async function getCachedResponse(status) {
        const start = Date.now()
        let response = await cache.match(cacheKey) ?? new Response(null, { status: 404 })
        const elapsed = Date.now() - start
        response = new Response(response.body, {
          status: status ?? response.status,
          headers: response.headers
        })
        response.headers.set("X-Elapsed", elapsed.toString())

        return response
      }

      switch (request.method) {
        case "GET": return await getCachedResponse()

        case "POST":
          const response = new Response(request.body, request)
          await cache.put(cacheKey, response)
          return await getCachedResponse(201)

        case "DELETE":
          if (await cache.delete(cacheKey)) {
            return new Response(null, { status: 204 })
          } else {
            return new Response(null, { status: 404 })
          }
      }

      return new Response(null, { status: 405 })
    } catch (e) {
      console.error(e)
      return new Response(e.message, { status: 500 })
    }
  }
}
