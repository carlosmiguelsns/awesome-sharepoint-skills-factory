export function buildIdFromUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

export function getSiteCollectionUrl(siteUrl: string): string {
  const parsed: URL = new URL(siteUrl);
  const pathSegments: string[] = parsed.pathname.split('/').filter(Boolean);

  if (pathSegments.length <= 1) {
    return `${parsed.protocol}//${parsed.host}`;
  }

  return `${parsed.protocol}//${parsed.host}/${pathSegments[0]}/${pathSegments[1]}`;
}

export function getSiteCollectionNameFromUrl(siteUrl: string): string {
  const parsed: URL = new URL(siteUrl);
  const pathSegments: string[] = parsed.pathname.split('/').filter(Boolean);

  if (pathSegments.length <= 1) {
    return parsed.host;
  }

  return decodeURIComponent(pathSegments[1]);
}

const CREATABLE_SITE_WEB_TEMPLATES: ReadonlySet<string> = new Set(['GROUP', 'STS', 'SITEPAGEPUBLISHING']);

export function isTeamOrCommunicationSiteTemplate(webTemplate: string | undefined): boolean {
  const normalized: string = (webTemplate || '').split('#')[0].trim().toUpperCase();
  return CREATABLE_SITE_WEB_TEMPLATES.has(normalized);
}
