// When (and only when) the request host is beta.brewdadlabs.com, serve
// the tester page at the subdomain root. Does nothing on brewdadlabs.com
// or on Pages preview hostnames. Do not attach the custom domain until
// Randy approves the DNS change.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();
  if (host === 'beta.brewdadlabs.com' && (url.pathname === '/' || url.pathname === '')) {
    url.pathname = '/beta/';
    return context.env.ASSETS.fetch(new Request(url.toString(), context.request));
  }
  return context.next();
}
