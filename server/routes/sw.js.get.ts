export default defineEventHandler(async (event) => {
  // Return empty service worker to prevent errors
  setHeader(event, 'Content-Type', 'application/javascript')
  return '// No service worker needed'
})