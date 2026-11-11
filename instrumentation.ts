// Runs once, as the server starts: the kit checks the admin's settings, so a
// problem with one is in the log from the first moment, not only after the
// first visit to /admin. Until it is fixed every admin page and route answers
// 404, and the rest of the site runs as usual.
export { register } from '@/platform/admin/instrumentation'
