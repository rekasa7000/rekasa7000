export default defineEventHandler(async (event) => {
  // Return empty response for workbox files
  setHeader(event, 'Content-Type', 'application/javascript')
  return '// No workbox needed'
})