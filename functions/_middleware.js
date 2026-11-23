// When (and only when) the request host is beta.brewdadlabs.com, send
// the tester page at /beta/. A 302 redirect (not a rewrite) keeps
// relative assets like tester.js and art/* resolving under /beta/.
// Does nothing on brewdadlabs.com or on Pages preview hostnames.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  if (host === 'beta.brewdadlabs.com' && (url.pathname === '/' || url.pathname === '')) {
    const dest = new URL('/beta/', url.origin);
    dest.search = url.search;
    return Response.redirect(dest.toString(), 302);
  }
  return context.next();
}
