/**
 * Public origin of the request, honouring reverse-proxy headers. `request.url`
 * alone can report an internal host/protocol behind a proxy, which would
 * produce broken absolute URLs in social meta tags.
 */
export function getOrigin(request: Request): string {
  const url = new URL(request.url);
  const host =
    request.headers.get('x-forwarded-host')?.split(',')[0].trim() || url.host;
  const proto =
    request.headers.get('x-forwarded-proto')?.split(',')[0].trim() ||
    url.protocol.replace(':', '');
  return `${proto}://${host}`;
}
