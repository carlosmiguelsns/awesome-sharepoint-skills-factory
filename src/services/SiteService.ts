import { type MSGraphClientFactory } from '@microsoft/sp-http';

import type { SharePointSite, SiteCollection } from '../models';
import { GraphSiteService, type ISiteDiscoveryOptions } from './GraphSiteService';

export class SiteService {
  constructor(private readonly msGraphClientFactory?: MSGraphClientFactory) {}

  public async getSites(options: ISiteDiscoveryOptions = {}): Promise<SharePointSite[]> {
    const graphSiteService: GraphSiteService = new GraphSiteService(this.msGraphClientFactory);
    return graphSiteService.getAllSites(options);
  }

  public async getSiteCollections(options: ISiteDiscoveryOptions = {}): Promise<SiteCollection[]> {
    const sites: SharePointSite[] = await this.getSites(options);
    const collectionsById: Map<string, SiteCollection> = new Map();

    for (const site of sites) {
      if (collectionsById.has(site.siteCollectionId)) {
        continue;
      }

      collectionsById.set(site.siteCollectionId, {
        id: site.siteCollectionId,
        name: site.siteCollectionName || site.name,
        url: site.webUrl || site.url,
        owner: site.owner,
        description: `Discovered from Microsoft Graph${site.hostname ? ` on ${site.hostname}` : ''}.`
      });
    }

    return Array.from(collectionsById.values());
  }
}
