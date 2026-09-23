export interface Skill {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdByEmail?: string;
  createdDate: string;
  modifiedDate: string;
  instructions: string[];
  knowledgeSources: string[];
  suggestedPrompts: string[];
  usageCount: number;
  siteIds: string[];
  siteCollectionIds: string[];
  isOwnedByCurrentUser: boolean;
  source?: 'seed' | 'created' | 'tenant';
  originSiteUrl?: string;
  originLibraryTitle?: string;
  sourceDocumentUrl?: string;
  skillFolderName?: string;
  skillFolderUrl?: string;
  skillFolderCreatedDate?: string;
  skillFolderModifiedDate?: string;
  skillMarkdownFileName?: string;
  skillMarkdownUrl?: string;
  skillMarkdownCreatedDate?: string;
  skillMarkdownModifiedDate?: string;
  skillMarkdownSize?: number;
  rawContent?: string;
  siteRevisions?: SkillSiteRevision[];
}

export interface SkillSiteRevision {
  siteId: string;
  rawContent: string;
  modifiedDate?: string;
  skillFolderName?: string;
  skillFolderUrl?: string;
  skillFolderCreatedDate?: string;
  skillFolderModifiedDate?: string;
  skillMarkdownFileName?: string;
  skillMarkdownUrl?: string;
  skillMarkdownCreatedDate?: string;
  skillMarkdownModifiedDate?: string;
  skillMarkdownSize?: number;
}

export interface SharePointSite {
  id: string;
  name: string;
  url: string;
  webUrl?: string;
  hostname?: string;
  siteCollectionId: string;
  siteCollectionName?: string;
  owner: string;
  description: string;
  template: string;
  hasAgentAssetsLibrary?: boolean;
  agentAssetsItemCount?: number;
  agentAssetsRootFolderUrl?: string;
}

export interface SiteCollection {
  id: string;
  name: string;
  url: string;
  owner: string;
  description: string;
}
