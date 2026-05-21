import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import apdaPreviewHandler from './api/apda-preview.js'

function localApiPlugin() {
  return {
    name: 'budsite-local-api',
    configureServer(server) {
      server.middlewares.use('/api/apda-preview', async (request, response) => {
        const jsonResponse = {
          statusCode: 200,
          headers: {},
          setHeader(name, value) {
            this.headers[name] = value
            response.setHeader(name, value)
          },
          status(code) {
            this.statusCode = code
            response.statusCode = code
            return this
          },
          json(value) {
            response.setHeader('Content-Type', 'application/json')
            response.end(JSON.stringify(value))
          },
        }

        try {
          await apdaPreviewHandler(request, jsonResponse)
        } catch (error) {
          response.statusCode = 500
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({
            error: 'Local APDA preview failed.',
            detail: error instanceof Error ? error.message : 'Unknown local API error',
          }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [localApiPlugin(), react(), tailwindcss()],
})
