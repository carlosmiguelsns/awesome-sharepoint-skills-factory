import { type MSGraphClientFactory, type MSGraphClientV3, SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';

import type { SharePointSite, SiteCollection, Skill, SkillSiteRevision } from '../models';
import { normalizeSearch, normalizeSkillFolderName } from '../utils/textHelpers';

interface ISharePointFolder {
  Name?: string;
  ServerRelativeUrl?: string;
  TimeCreated?: string;
  TimeLastModified?: string;
  ItemCount?: number;
  Files?: { results?: ISharePointFile[] };
  Folders?: { results?: ISharePointFolder[] };
}

interface ISharePointFile {
  Name?: string;
  ServerRelativeUrl?: string;
  TimeCreated?: string;
  TimeLastModified?: string;
  Length?: number;
}

interface ISharePointSkillFile extends ISharePointFile {
  folderName?: string;
  folderServerRelativeUrl?: string;
  folderCreatedDate?: string;
  folderModifiedDate?: string;
}

export interface ICreateSkillRequest {
  siteUrl: string;
  skillName: string;
  skillContent: string;
  onProgress?: (message: string) => void;
}

export interface ICreateSkillResult {
  normalizedSkillName: string;
  skillFolderUrl: string;
  skillMarkdownUrl: string;
}

export interface IDeleteSkillRequest {
  siteUrl: string;
  skillFolderUrl: string;
  onProgress?: (message: string) => void;
}

interface IGraphMeResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
}

export interface ITenantUserIdentity {
  displayName: string;
  email: string;
}

function buildIdFromUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

function getCollectionUrlFromSiteUrl(url: string): string {
  const withoutTrailingSlash: string = url.replace(/\/$/, '');
  const parsed: URL = new URL(withoutTrailingSlash);
  const segments: string[] = parsed.pathname.split('/').filter(Boolean);
  return segments.length <= 1 ? `${parsed.protocol}//${parsed.host}` : `${parsed.protocol}//${parsed.host}/${segments[0]}/${segments[1]}`;
}

function getCollectionNameFromUrl(url: string): string {
  const parsed: URL = new URL(url.replace(/\/$/, ''));
  const segments: string[] = parsed.pathname.split('/').filter(Boolean);
  return decodeURIComponent(segments[1] || parsed.host);
}

function getFileNameWithoutExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, '');
}

function normalizeKey(value: string): string {
  return normalizeSearch(value).replace(/\s+/g, ' ');
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

function toAbsoluteUrl(siteUrl: string, serverRelativeUrl: string): string {
  if (/^https?:\/\//i.test(serverRelativeUrl)) {
    return serverRelativeUrl;
  }

  return `${new URL(siteUrl).origin}${serverRelativeUrl.startsWith('/') ? '' : '/'}${serverRelativeUrl}`;
}

function readSection(markdown: string, sectionTitle: string): string[] {
  const pattern: RegExp = new RegExp(`^${sectionTitle}:\\s*$([\\s\\S]*?)(?=^\\w[^:\\n]*:\\s*$|$)`, 'im');
  const match: RegExpExecArray | null = pattern.exec(markdown);
  if (!match || !match[1]) {
    return [];
  }

  return match[1]
    .split(/\r?\n/)
    .map((line: string) => line.replace(/^[-*]\s*/, '').trim())
    .filter((line: string) => Boolean(line));
}

function getTitle(markdown: string, fallback: string): string {
  const headingMatch: RegExpExecArray | null = /^title:\s*(.+)$/im.exec(markdown) || /^#\s+(.+)$/m.exec(markdown);
  return headingMatch && headingMatch[1] ? headingMatch[1].replace(/^["']|["']$/g, '').trim() : fallback;
}

export class TenantSharePointDataService {
  private _currentUserPromise?: Promise<ITenantUserIdentity>;

  constructor(
    private readonly spHttpClient: SPHttpClient,
    private readonly siteUrl: string,
    private readonly msGraphClientFactory?: MSGraphClientFactory,
    private readonly fallbackUserName: string = 'User',
    private readonly fallbackUserEmail: string = ''
  ) {}

  public async getCurrentUserAsync(): Promise<ITenantUserIdentity> {
    if (this._currentUserPromise) {
      return this._currentUserPromise;
    }

    this._currentUserPromise = (async (): Promise<ITenantUserIdentity> => {
      if (this.msGraphClientFactory) {
        try {
          const graphClient: MSGraphClientV3 = await this.msGraphClientFactory.getClient('3');
          const me: IGraphMeResponse = await graphClient.api('me').select('displayName,mail,userPrincipalName').get();
          return {
            displayName: me.displayName || this.fallbackUserName,
            email: me.mail || me.userPrincipalName || this.fallbackUserEmail
          };
        } catch {
          // Fallback below.
        }
      }

      return {
        displayName: this.fallbackUserName,
        email: this.fallbackUserEmail
      };
    })();

    return this._currentUserPromise;
  }

  public async getTenantSiteCollectionsAsync(): Promise<SiteCollection[]> {
    const sites: SharePointSite[] = await this.getTenantSitesAsync();
    const collectionsById: Map<string, SiteCollection> = new Map();

    for (const site of sites) {
      if (!collectionsById.has(site.siteCollectionId)) {
        collectionsById.set(site.siteCollectionId, {
          id: site.siteCollectionId,
          name: site.siteCollectionName || getCollectionNameFromUrl(site.url),
          url: getCollectionUrlFromSiteUrl(site.url),
          owner: 'Tenant data',
          description: 'Discovered from Microsoft Graph.'
        });
      }
    }

    return Array.from(collectionsById.values());
  }

  public async getTenantSkillsAsync(): Promise<Skill[]> {
    const currentUser: ITenantUserIdentity = await this.getCurrentUserAsync();
    const sites: SharePointSite[] = await this.getValidatedTenantSitesAsync();
    const skillsByKey: Map<string, Skill> = new Map();

    for (const site of sites) {
      if (!site.hasAgentAssetsLibrary || !site.agentAssetsRootFolderUrl) {
        continue;
      }

      const skillsRootServerRelativeUrl: string = `${site.agentAssetsRootFolderUrl.replace(/\/$/, '')}/skills`;
      const skillFiles: ISharePointSkillFile[] = await this.getSkillMarkdownFilesAsync(site.url, skillsRootServerRelativeUrl);
      for (const skillFile of skillFiles) {
        const markdown: string = await this.getMarkdownFileContentAsync(site.url, skillFile.ServerRelativeUrl || '');
        const skillName: string = getTitle(markdown, getFileNameWithoutExtension(skillFile.Name || 'Skill'));
        const skillKey: string = normalizeKey(skillName);
        const siteIds: Set<string> = skillsByKey.has(skillKey) ? new Set<string>(skillsByKey.get(skillKey)?.siteIds || []) : new Set<string>();
        const collectionIds: Set<string> = skillsByKey.has(skillKey)
          ? new Set<string>(skillsByKey.get(skillKey)?.siteCollectionIds || [])
          : new Set<string>();

        siteIds.add(site.id);
        collectionIds.add(site.siteCollectionId);

        const existing: Skill | undefined = skillsByKey.get(skillKey);
        const siteRevisions: SkillSiteRevision[] = (existing?.siteRevisions || []).filter(
          (revision: SkillSiteRevision) => revision.siteId !== site.id
        );
        siteRevisions.push({
          siteId: site.id,
          rawContent: markdown,
          modifiedDate: skillFile.TimeLastModified,
          skillFolderName: skillFile.folderName,
          skillFolderUrl: skillFile.folderServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.folderServerRelativeUrl) : undefined,
          skillFolderCreatedDate: skillFile.folderCreatedDate,
          skillFolderModifiedDate: skillFile.folderModifiedDate,
          skillMarkdownFileName: skillFile.Name,
          skillMarkdownUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
          skillMarkdownCreatedDate: skillFile.TimeCreated,
          skillMarkdownModifiedDate: skillFile.TimeLastModified,
          skillMarkdownSize: typeof skillFile.Length === 'number' ? skillFile.Length : undefined
        });

        const nextSkill: Skill = {
          id: existing?.id || skillKey || buildIdFromUrl(skillFile.ServerRelativeUrl || `${site.url}/${skillName}`),
          name: skillName,
          description: readSection(markdown, 'description').join(' ') || `Skill discovered from ${site.name}.`,
          owner: readSection(markdown, 'owner').join(' ') || currentUser.displayName,
          createdByEmail: currentUser.email,
          createdDate: existing?.createdDate || new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          instructions: readSection(markdown, 'instructions'),
          knowledgeSources: readSection(markdown, 'knowledge'),
          suggestedPrompts: readSection(markdown, 'suggested prompts'),
          usageCount: siteIds.size,
          siteIds: Array.from(siteIds.values()),
          siteCollectionIds: Array.from(collectionIds.values()),
          isOwnedByCurrentUser: true,
          source: 'tenant',
          originSiteUrl: site.url,
          originLibraryTitle: skillFile.folderName ? `AgentAssets/Skills/${skillFile.folderName}` : 'AgentAssets/Skills',
          sourceDocumentUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
          skillFolderName: skillFile.folderName,
          skillFolderUrl: skillFile.folderServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.folderServerRelativeUrl) : undefined,
          skillFolderCreatedDate: skillFile.folderCreatedDate,
          skillFolderModifiedDate: skillFile.folderModifiedDate,
          skillMarkdownFileName: skillFile.Name,
          skillMarkdownUrl: skillFile.ServerRelativeUrl ? toAbsoluteUrl(site.url, skillFile.ServerRelativeUrl) : undefined,
          skillMarkdownCreatedDate: skillFile.TimeCreated,
          skillMarkdownModifiedDate: skillFile.TimeLastModified,
          skillMarkdownSize: typeof skillFile.Length === 'number' ? skillFile.Length : undefined,
          rawContent: markdown,
          siteRevisions
        };

        skillsByKey.set(skillKey, nextSkill);
      }
    }

    return Array.from(skillsByKey.values()).sort((left: Skill, right: Skill) => right.usageCount - left.usageCount);
  }

  public async createSkillAsync(request: ICreateSkillRequest): Promise<ICreateSkillResult> {
    const reportProgress = (message: string): void => request.onProgress?.(message);

    const normalizedSkillName: string = normalizeSkillFolderName(request.skillName);
    if (!normalizedSkillName) {
      throw new Error('Skill name must contain at least one letter or number.');
    }

    reportProgress('Locating the Agent Assets library…');
    const libraryInfo: { rootFolderServerRelativeUrl: string } | undefined = await this.getAgentAssetsLibraryAsync(request.siteUrl);
    if (!libraryInfo) {
      throw new Error('Agent Assets library was not found on the selected site.');
    }

    const skillsRootServerRelativeUrl: string = `${libraryInfo.rootFolderServerRelativeUrl.replace(/\/$/, '')}/skills`;
    reportProgress('Preparing the skills folder…');
    await this.ensureFolderExistsAsync(request.siteUrl, libraryInfo.rootFolderServerRelativeUrl, 'skills');

    const existingFolderNames: string[] = await this.getChildFolderNamesAsync(request.siteUrl, skillsRootServerRelativeUrl);
    if (existingFolderNames.indexOf(normalizedSkillName) !== -1) {
      throw new Error(`A skill folder named "${normalizedSkillName}" already exists.`);
    }

    const skillFolderServerRelativeUrl: string = `${skillsRootServerRelativeUrl}/${normalizedSkillName}`;
    reportProgress(`Creating skill folder "${normalizedSkillName}"…`);
    await this.createFolderAsync(request.siteUrl, skillsRootServerRelativeUrl, normalizedSkillName);

    reportProgress('Uploading SKILL.md…');
    await this.createTextFileAsync(request.siteUrl, skillFolderServerRelativeUrl, 'SKILL.md', request.skillContent);

    reportProgress('Finalizing…');
    return {
      normalizedSkillName,
      skillFolderUrl: `${request.siteUrl.replace(/\/$/, '')}/${skillFolderServerRelativeUrl.replace(/^\//, '')}`,
      skillMarkdownUrl: `${request.siteUrl.replace(/\/$/, '')}/${skillFolderServerRelativeUrl.replace(/^\//, '')}/SKILL.md`
    };
  }

  public async isCurrentUserSiteCollectionAdminAsync(siteUrl: string): Promise<boolean> {
    const response: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/currentuser?$select=IsSiteAdmin`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      return false;
    }

    const data: { IsSiteAdmin?: boolean; d?: { IsSiteAdmin?: boolean } } = (await response.json()) as {
      IsSiteAdmin?: boolean;
      d?: { IsSiteAdmin?: boolean };
    };
    return Boolean(data.IsSiteAdmin ?? data.d?.IsSiteAdmin);
  }

  public async deleteSkillAsync(request: IDeleteSkillRequest): Promise<void> {
    const reportProgress = (message: string): void => request.onProgress?.(message);

    reportProgress('Checking permissions…');
    const isAuthorized: boolean = await this.isCurrentUserSiteCollectionAdminAsync(request.siteUrl);
    if (!isAuthorized) {
      throw new Error('Only Site Collection Administrators or SharePoint Admins can delete a skill.');
    }

    const folderServerRelativeUrl: string = new URL(request.skillFolderUrl).pathname;

    reportProgress('Deleting skill folder…');
    const deleteResponse: SPHttpClientResponse = await this.spHttpClient.post(
      `${request.siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(folderServerRelativeUrl)}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'X-HTTP-Method': 'DELETE',
          'IF-MATCH': '*'
        }
      }
    );

    if (!deleteResponse.ok) {
      throw new Error('Failed to delete the skill folder.');
    }

    reportProgress('Finalizing…');
  }

  private async getTenantSitesAsync(): Promise<SharePointSite[]> {
    if (!this.msGraphClientFactory) {
      return [];
    }

    const graphClient: MSGraphClientV3 = await this.msGraphClientFactory.getClient('3');
    const discovered: SharePointSite[] = [];
    let nextPath: string | undefined = 'sites?search=*';

    while (nextPath) {
      const response: { value?: Array<{ id?: string; name?: string; webUrl?: string; siteCollection?: { id?: string; hostName?: string } }>; '@odata.nextLink'?: string } =
        await graphClient.api(nextPath).get();

      for (const site of response.value || []) {
        if (!site.webUrl) {
          continue;
        }

        const collectionUrl: string = getCollectionUrlFromSiteUrl(site.webUrl);
        discovered.push({
          id: site.id || buildIdFromUrl(site.webUrl),
          name: site.name || decodeURIComponent(site.webUrl.split('/').pop() || 'Site'),
          url: site.webUrl,
          webUrl: site.webUrl,
          hostname: site.siteCollection?.hostName || new URL(site.webUrl).host,
          siteCollectionId: site.siteCollection?.id || buildIdFromUrl(collectionUrl),
          siteCollectionName: getCollectionNameFromUrl(site.webUrl),
          owner: 'Tenant data',
          description: 'Discovered from Microsoft Graph.',
          template: 'SharePoint'
        });
      }

      nextPath = response['@odata.nextLink'] ? response['@odata.nextLink'].replace(/^\//, '') : undefined;
    }

    return discovered;
  }

  private async getValidatedTenantSitesAsync(): Promise<SharePointSite[]> {
    const sites: SharePointSite[] = await this.getTenantSitesAsync();
    const validated: SharePointSite[] = [];

    for (const site of sites) {
      const libraryInfo: { itemCount: number; rootFolderServerRelativeUrl: string } | undefined = await this.getAgentAssetsLibraryAsync(site.url);
      validated.push({
        ...site,
        hasAgentAssetsLibrary: Boolean(libraryInfo),
        agentAssetsItemCount: libraryInfo ? libraryInfo.itemCount : 0,
        agentAssetsRootFolderUrl: libraryInfo?.rootFolderServerRelativeUrl
      });
    }

    return validated;
  }

  private async getAgentAssetsLibraryAsync(siteUrl: string): Promise<{ itemCount: number; rootFolderServerRelativeUrl: string } | undefined> {
    const response: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/lists/GetByTitle('Agent Assets')?$select=Id,Title,ItemCount,RootFolder/ServerRelativeUrl&$expand=RootFolder`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      return undefined;
    }

    const data: { ItemCount?: number; RootFolder?: { ServerRelativeUrl?: string } } = (await response.json()) as { ItemCount?: number; RootFolder?: { ServerRelativeUrl?: string } };
    const rootFolderServerRelativeUrl: string | undefined = data.RootFolder?.ServerRelativeUrl;
    if (!rootFolderServerRelativeUrl) {
      return undefined;
    }

    return {
      itemCount: data.ItemCount || 0,
      rootFolderServerRelativeUrl
    };
  }

  private async ensureFolderExistsAsync(siteUrl: string, parentFolderServerRelativeUrl: string, folderName: string): Promise<void> {
    const folderResponse: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(`${parentFolderServerRelativeUrl}/${folderName}`)}')?$select=ServerRelativeUrl`,
      SPHttpClient.configurations.v1
    );

    if (folderResponse.ok) {
      return;
    }

    const createResponse: SPHttpClientResponse = await this.spHttpClient.post(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(parentFolderServerRelativeUrl)}')/Folders/add('${escapeODataString(folderName)}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata'
        }
      }
    );

    if (!createResponse.ok) {
      throw new Error(`Failed to create the "${folderName}" folder in the Agent Assets library.`);
    }
  }

  private async createFolderAsync(siteUrl: string, parentFolderServerRelativeUrl: string, folderName: string): Promise<void> {
    const createResponse: SPHttpClientResponse = await this.spHttpClient.post(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(parentFolderServerRelativeUrl)}')/Folders/add('${escapeODataString(folderName)}')`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'application/json;odata=nometadata'
        }
      }
    );

    if (!createResponse.ok) {
      throw new Error(`Failed to create the skill folder "${folderName}".`);
    }
  }

  private async createTextFileAsync(siteUrl: string, folderServerRelativeUrl: string, fileName: string, content: string): Promise<void> {
    const createResponse: SPHttpClientResponse = await this.spHttpClient.post(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(folderServerRelativeUrl)}')/Files/add(url='${escapeODataString(fileName)}',overwrite=true)`,
      SPHttpClient.configurations.v1,
      {
        body: content,
        headers: {
          Accept: 'application/json;odata=nometadata',
          'Content-Type': 'text/plain;charset=utf-8'
        }
      }
    );

    if (!createResponse.ok) {
      throw new Error('Failed to create SKILL.md.');
    }
  }

  private async getChildFolderNamesAsync(siteUrl: string, folderServerRelativeUrl: string): Promise<string[]> {
    const response: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(folderServerRelativeUrl)}')/Folders?$select=Name,ServerRelativeUrl`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      return [];
    }

    const data: { value?: ISharePointFolder[]; d?: { results?: ISharePointFolder[] } } = (await response.json()) as {
      value?: ISharePointFolder[];
      d?: { results?: ISharePointFolder[] };
    };
    return (data.value || data.d?.results || [])
      .map((folder: ISharePointFolder) => (folder.Name || '').trim())
      .filter((name: string) => Boolean(name));
  }

  private async getSkillMarkdownFilesAsync(siteUrl: string, skillsRootServerRelativeUrl: string): Promise<ISharePointSkillFile[]> {
    const response: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(skillsRootServerRelativeUrl)}')/Folders?$select=Name,ServerRelativeUrl,TimeCreated,TimeLastModified,ItemCount`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      return [];
    }

    const data: { value?: ISharePointFolder[]; d?: { results?: ISharePointFolder[] } } = (await response.json()) as {
      value?: ISharePointFolder[];
      d?: { results?: ISharePointFolder[] };
    };
    const folders: ISharePointFolder[] = data.value || data.d?.results || [];
    const skillFiles: ISharePointSkillFile[] = [];

    for (const folder of folders) {
      const folderName: string = (folder.Name || '').trim();
      if (!folderName) {
        continue;
      }

      const folderServerRelativeUrl: string = folder.ServerRelativeUrl || `${skillsRootServerRelativeUrl}/${folderName}`;
      const fileResponse: SPHttpClientResponse = await this.spHttpClient.get(
        `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${escapeODataString(folderServerRelativeUrl)}')/Files?$select=Name,ServerRelativeUrl,TimeCreated,TimeLastModified,Length`,
        SPHttpClient.configurations.v1
      );

      if (!fileResponse.ok) {
        continue;
      }

      const fileData: { value?: ISharePointFile[]; d?: { results?: ISharePointFile[] } } = (await fileResponse.json()) as {
        value?: ISharePointFile[];
        d?: { results?: ISharePointFile[] };
      };
      const files: ISharePointFile[] = fileData.value || fileData.d?.results || [];
      const skillFile: ISharePointFile | undefined = files.find((file: ISharePointFile) => (file.Name || '').toLowerCase() === 'skill.md');
      if (skillFile) {
        skillFiles.push({
          ...skillFile,
          ServerRelativeUrl: skillFile.ServerRelativeUrl || `${folderServerRelativeUrl}/Skill.md`,
          folderName,
          folderServerRelativeUrl,
          folderCreatedDate: folder.TimeCreated,
          folderModifiedDate: folder.TimeLastModified
        });
      }
    }

    return skillFiles;
  }

  private async getMarkdownFileContentAsync(siteUrl: string, serverRelativeUrl: string): Promise<string> {
    const response: SPHttpClientResponse = await this.spHttpClient.get(
      `${siteUrl}/_api/web/GetFileByServerRelativeUrl('${serverRelativeUrl}')/$value`,
      SPHttpClient.configurations.v1
    );

    if (!response.ok) {
      return '';
    }

    return response.text();
  }
}
