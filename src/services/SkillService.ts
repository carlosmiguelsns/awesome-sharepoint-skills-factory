import type { Skill } from '../models';
import type { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';
import { TenantSharePointDataService, type ICreateSkillRequest, type ICreateSkillResult } from './TenantSharePointDataService';

export interface ISkillQuery {
  searchText?: string;
  ownedOnly?: boolean;
}

export class SkillService {
  constructor(
    private readonly spHttpClient?: SPHttpClient,
    private readonly siteUrl?: string,
    private readonly msGraphClientFactory?: MSGraphClientFactory,
    private readonly currentUserName: string = 'User',
    private readonly currentUserEmail: string = ''
  ) {}

  private async getAllSkillsAsync(): Promise<Skill[]> {
    if (this.spHttpClient && this.siteUrl) {
      try {
        const tenantService: TenantSharePointDataService = new TenantSharePointDataService(
          this.spHttpClient,
          this.siteUrl,
          this.msGraphClientFactory,
          this.currentUserName,
          this.currentUserEmail
        );
        return tenantService.getTenantSkillsAsync();
      } catch {
        // Surface an empty tenant result when discovery is unavailable.
      }
    }

    return [];
  }

  public async getSkills(query: ISkillQuery = {}): Promise<Skill[]> {
    const skills: Skill[] = await this.getAllSkillsAsync();
    const needle: string = (query.searchText || '').trim().toLowerCase();

    return skills
      .filter((skill: Skill) => (query.ownedOnly ? skill.isOwnedByCurrentUser : true))
      .filter((skill: Skill) => {
        if (!needle) {
          return true;
        }

        const haystack: string = [
          skill.name,
          skill.description,
          skill.owner,
          skill.knowledgeSources.join(' '),
          skill.suggestedPrompts.join(' ')
        ]
          .join(' ')
          .toLowerCase();

        return haystack.indexOf(needle) !== -1;
      });
  }

  public async getMySkills(searchText: string = ''): Promise<Skill[]> {
    return this.getSkills({ searchText, ownedOnly: true });
  }

  public async getSkillById(skillId: string): Promise<Skill | undefined> {
    const allSkills: Skill[] = await this.getAllSkillsAsync();
    return allSkills.find((skill: Skill) => skill.id === skillId);
  }

  public async createSkill(request: ICreateSkillRequest): Promise<ICreateSkillResult> {
    if (!this.spHttpClient || !this.siteUrl) {
      throw new Error('SharePoint create support is not available.');
    }

    const tenantService: TenantSharePointDataService = new TenantSharePointDataService(
      this.spHttpClient,
      this.siteUrl,
      this.msGraphClientFactory,
      this.currentUserName,
      this.currentUserEmail
    );

    return tenantService.createSkillAsync(request);
  }
}
