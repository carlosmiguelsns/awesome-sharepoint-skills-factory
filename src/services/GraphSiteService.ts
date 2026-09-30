import { SPHttpClient, type MSGraphClientFactory, type MSGraphClientV3, type SPHttpClientResponse } from '@microsoft/sp-http';

import type { SharePointSite } from '../models';
import { buildIdFromUrl, getSiteCollectionNameFromUrl, getSiteCollectionUrl, isVisibleSite } from '../utils/siteHelpers';

interface IGraphSiteCollection {
  id?: string;
  hostName?: string;
}

interface IGraphSiteResponse {
  id?: string;
  name?: string;
  displayName?: string;
  webUrl?: string;
  siteCollection?: IGraphSiteCollection;
}

interface IGraphSiteListResponse {
  value?: IGraphSiteResponse[];
  '@odata.nextLink'?: string;
}

export interface ISiteDiscoveryProgress {
  discoveredCount: number;
  pageNumber: number;
}

export interface ISiteDiscoveryOptions {
  onProgress?: (progress: ISiteDiscoveryProgress) => void;
}

function toGraphApiPath(nextLink: string): string {
  try {
    const parsed: URL = new URL(nextLink);
    return `${parsed.pathname.replace(/^\//, '')}${parsed.search}`;
  } catch {
    return nextLink.replace(/^\//, '');
  }
}

function normalizeSite(site: IGraphSiteResponse): SharePointSite | undefined {
  const webUrl: string = site.webUrl || '';

  if (!webUrl) {
    return undefined;
  }

  const siteCollectionUrl: string = getSiteCollectionUrl(webUrl);
  const siteCollectionName: string = getSiteCollectionNameFromUrl(webUrl);
  const hostname: string = site.siteCollection?.hostName || new URL(webUrl).host;

  return {
    id: site.id || buildIdFromUrl(webUrl),
    name: site.displayName || site.name || siteCollectionName,
    url: webUrl,
    webUrl,
    hostname,
    siteCollectionId: site.siteCollection?.id || buildIdFromUrl(siteCollectionUrl),
    siteCollectionName,
    owner: 'Tenant data',
    description: 'Discovered from Microsoft Graph.',
    template: ''
  };
}

export class GraphSiteService {
  constructor(
    private readonly msGraphClientFactory?: MSGraphClientFactory,
    private readonly spHttpClient?: SPHttpClient
  ) {}

  private async getWebTemplateAsync(webUrl: string): Promise<string> {
    if (!this.spHttpClient) {
      return '';
    }

    try {
      const response: SPHttpClientResponse = await this.spHttpClient.get(
        `${webUrl}/_api/web?$select=WebTemplate`,
        SPHttpClient.configurations.v1
      );

      if (!response.ok) {
        return '';
      }

      const data: { WebTemplate?: string } = (await response.json()) as { WebTemplate?: string };
      return data.WebTemplate || '';
    } catch {
      return '';
    }
  }

  public async getAllSites(options: ISiteDiscoveryOptions = {}): Promise<SharePointSite[]> {
    if (!this.msGraphClientFactory) {
      return [];
    }

    const graphClient: MSGraphClientV3 = await this.msGraphClientFactory.getClient('3');
    const discoveredSites: SharePointSite[] = [];
    const seenIds: Set<string> = new Set();
    let nextPath: string | undefined = 'sites?search=*';
    let pageNumber: number = 0;

    while (nextPath) {
      pageNumber += 1;
      const response: IGraphSiteListResponse = await graphClient.api(nextPath).get();
      const pageSites: SharePointSite[] = (response.value || [])
        .filter((site: IGraphSiteResponse) => isVisibleSite(site))
        .map((site: IGraphSiteResponse) => normalizeSite(site))
        .filter((site: SharePointSite | undefined): site is SharePointSite => Boolean(site))
        .filter((site: SharePointSite) => !seenIds.has(site.id));

      await Promise.all(
        pageSites.map(async (site: SharePointSite) => {
          site.template = await this.getWebTemplateAsync(site.url);
        })
      );

      for (const site of pageSites) {
        seenIds.add(site.id);
        discoveredSites.push(site);
      }

      options.onProgress?.({
        discoveredCount: discoveredSites.length,
        pageNumber
      });

      nextPath = response['@odata.nextLink'] ? toGraphApiPath(response['@odata.nextLink']) : undefined;
    }

    return discoveredSites;
  }
}
