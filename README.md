# [cache.cfwjs.workers.dev](https://cache.cfwjs.workers.dev)

Docs: https://developers.cloudflare.com/workers/runtime-apis/cache/

## Usage

`http -pbhBH "https://cache.cfwjs.workers.dev/foo" bar=baz`

Should return the json payload and the headers:
```
Age: 0
CF-Cache-Status: HIT
```

The following get requests should return the stored data with the above headers:
`http "https://cache.cfwjs.workers.dev/foo"`

## Local Development

`bun x wrangler dev`
