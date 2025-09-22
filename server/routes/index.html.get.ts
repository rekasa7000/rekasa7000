export default defineEventHandler(async (event) => {
  // Redirect /index.html to /
  return sendRedirect(event, '/', 301)
})