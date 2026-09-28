import * as React from 'react';

import {
  FluentProvider,
  IdPrefixProvider,
  Spinner,
  webDarkTheme,
  webLightTheme,
  makeStyles,
  tokens
} from '@fluentui/react-components';

import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';
import type { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';

import type { SharePointSite, SiteCollection, Skill } from '../models';
import { SkillService } from '../services/SkillService';
import { SiteService } from '../services/SiteService';
import InlineSkillsView, { type InlineViewMode } from './inline/InlineSkillsView';
import SkillsFactoryDashboard, { type DashboardTab } from './fullscreen/SkillsFactoryDashboard';
import type { ICreateSkillRequest, ICreateSkillResult } from '../services/TenantSharePointDataService';
import type { ISharePointSkillsFactoryCopilotComponentProperties } from '../SharePointSkillsFactoryCopilotComponentProperties';

const useStyles = makeStyles({
  root: {
    minHeight: '100%',
    color: tokens.colorNeutralForeground1
  },
  loading: {
    minHeight: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export interface ISkillsFactoryAppProps {
  hostContext: ICopilotComponentHostContext;
  spHttpClient: SPHttpClient;
  msGraphClientFactory?: MSGraphClientFactory;
  siteUrl: string;
  currentUserName: string;
  currentUserEmail: string;
  targetDocument?: Document;
  initialIntent?: ISharePointSkillsFactoryCopilotComponentProperties['intent'];
  initialSkillCount?: ISharePointSkillsFactoryCopilotComponentProperties['skillCount'];
  initialShowAllSkills?: ISharePointSkillsFactoryCopilotComponentProperties['showAllSkills'];
  onRequestFullscreen: () => Promise<void>;
}

const DEFAULT_INLINE_SKILL_LIMIT: number = 5;

export default function SkillsFactoryApp(props: ISkillsFactoryAppProps): React.ReactElement {
  const styles = useStyles();
  const skillService: SkillService = React.useMemo(
    () =>
      new SkillService(
        props.spHttpClient,
        props.siteUrl,
        props.msGraphClientFactory,
        props.currentUserName,
        props.currentUserEmail
      ),
    [props.currentUserEmail, props.currentUserName, props.msGraphClientFactory, props.siteUrl, props.spHttpClient]
  );
  const siteService: SiteService = React.useMemo(
    () => new SiteService(props.msGraphClientFactory),
    [props.msGraphClientFactory]
  );
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [sites, setSites] = React.useState<SharePointSite[]>([]);
  const [siteCollections, setSiteCollections] = React.useState<SiteCollection[]>([]);
  const [selectedSkillId, setSelectedSkillId] = React.useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(
    'all-skills'
  );
  const [searchText, setSearchText] = React.useState<string>('');
  const [siteSearchText, setSiteSearchText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [discoveredSiteCount, setDiscoveredSiteCount] = React.useState<number>(0);
  const [loadingMessage, setLoadingMessage] = React.useState<string>('Loading skills factory…');
  const [inlineMode, setInlineMode] = React.useState<InlineViewMode>(props.initialIntent === 'createSkill' ? 'create' : 'list');
  const [inlineSkillLimit, setInlineSkillLimit] = React.useState<number | 'all'>(
    props.initialShowAllSkills ? 'all' : props.initialSkillCount || DEFAULT_INLINE_SKILL_LIMIT
  );

  React.useEffect(() => {
    let isCancelled: boolean = false;

    async function loadAsync(): Promise<void> {
      setIsLoading(true);
      setLoadingMessage('Discovering SharePoint sites…');
      setDiscoveredSiteCount(0);
      const [allSkills, allSites]: [Skill[], SharePointSite[]] = await Promise.all([
        skillService.getSkills({ ownedOnly: false }),
        siteService.getSites({
          onProgress: (progress) => {
            if (isCancelled) {
              return;
            }

            setDiscoveredSiteCount(progress.discoveredCount);
            setLoadingMessage(`Discovering SharePoint sites…`);
          }
        })
      ]);

      if (isCancelled) {
        return;
      }

      setSkills(allSkills);
      setSites(allSites);
      setSiteCollections(
        allSites.reduce((collections: SiteCollection[], site: SharePointSite) => {
          if (collections.some((collection: SiteCollection) => collection.id === site.siteCollectionId)) {
            return collections;
          }
          collections.push({
            id: site.siteCollectionId,
            name: site.siteCollectionName || site.name,
            url: site.url,
            owner: site.owner,
            description: site.description
          });
          return collections;
        }, [])
      );
      setIsLoading(false);
    }

    void loadAsync();

    return () => {
      isCancelled = true;
    };
  }, [siteService, skillService]);

  const refreshSkills = React.useCallback(async (): Promise<void> => {
    const allSkills: Skill[] = await skillService.getSkills({ ownedOnly: false });
    setSkills(allSkills);
  }, [skillService]);

  const handleCreateSkill = React.useCallback(
    async (request: ICreateSkillRequest): Promise<ICreateSkillResult> => {
      const result: ICreateSkillResult = await skillService.createSkill(request);
      await refreshSkills();
      return result;
    },
    [refreshSkills, skillService]
  );

  const handleDeleteSkillSite = React.useCallback(
    async (site: SharePointSite, skillFolderUrl: string): Promise<void> => {
      await skillService.deleteSkill({ siteUrl: site.url, skillFolderUrl });
      await refreshSkills();
    },
    [refreshSkills, skillService]
  );

  const mySkills: Skill[] = React.useMemo(
    () => skills.filter((skill: Skill) => skill.isOwnedByCurrentUser),
    [skills]
  );

  const sortedMySkills: Skill[] = React.useMemo(
    () => mySkills.slice().sort((left: Skill, right: Skill) => right.usageCount - left.usageCount || right.modifiedDate.localeCompare(left.modifiedDate)),
    [mySkills]
  );

  const visibleMySkills: Skill[] = React.useMemo(
    () => (inlineSkillLimit === 'all' ? sortedMySkills : sortedMySkills.slice(0, inlineSkillLimit)),
    [sortedMySkills, inlineSkillLimit]
  );

  const selectedSkill: Skill | undefined = React.useMemo(
    () => skills.find((skill: Skill) => skill.id === selectedSkillId),
    [selectedSkillId, skills]
  );

  const handleToggleSelectSkill = React.useCallback((skillId: string): void => {
    setSelectedSkillId((current: string | undefined) => (current === skillId ? undefined : skillId));
  }, []);

  const handleTabChange = React.useCallback((tab: DashboardTab): void => {
    setActiveTab(tab);
    setSelectedSkillId(undefined);
  }, []);

  React.useEffect(() => {
    if (props.hostContext.displayMode === 'inline') {
      setSelectedSkillId(undefined);
    }
  }, [props.hostContext.displayMode]);

  const handleSelectInlineSkill = React.useCallback(
    async (skillId: string): Promise<void> => {
      setSelectedSkillId(skillId);
      setActiveTab('all-skills');
      await props.onRequestFullscreen();
    },
    [props.onRequestFullscreen]
  );

  const handleShowTopSkills = React.useCallback((count: number): void => {
    setInlineMode('list');
    setInlineSkillLimit(count);
  }, []);

  const handleShowAllSkills = React.useCallback((): void => {
    setInlineMode('list');
    setInlineSkillLimit('all');
  }, []);

  const handleStartCreateSkill = React.useCallback((): void => {
    setInlineMode('create');
  }, []);

  const handleCancelCreateSkill = React.useCallback((): void => {
    setInlineMode('list');
  }, []);

  const theme = props.hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <IdPrefixProvider value="sharepoint-skills-factory-">
      <FluentProvider theme={theme} targetDocument={props.targetDocument} className={styles.root}>
        {isLoading ? (
          <div className={styles.loading}>
            <Spinner label={discoveredSiteCount > 0 ? `${loadingMessage} ${discoveredSiteCount} sites discovered` : loadingMessage} />
          </div>
        ) : props.hostContext.displayMode === 'inline' ? (
          <InlineSkillsView
            mode={inlineMode}
            skills={visibleMySkills}
            totalMySkillsCount={mySkills.length}
            skillLimit={inlineSkillLimit}
            currentUserName={props.currentUserName}
            sites={sites}
            onSelectSkill={(skillId: string) => { void handleSelectInlineSkill(skillId); }}
            onShowTopSkills={handleShowTopSkills}
            onShowAllSkills={handleShowAllSkills}
            onStartCreateSkill={handleStartCreateSkill}
            onCancelCreateSkill={handleCancelCreateSkill}
            onCreateSkill={handleCreateSkill}
            onSkillCreated={handleCancelCreateSkill}
          />
        ) : (
          <SkillsFactoryDashboard
            hostContext={props.hostContext}
            targetDocument={props.targetDocument}
            currentUserName={props.currentUserName}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            siteSearchText={siteSearchText}
            onSiteSearchTextChange={setSiteSearchText}
            allSkills={skills}
            usageSkills={skills}
            siteCollections={siteCollections}
            sites={sites}
            selectedSkill={selectedSkill}
            onSelectSkill={handleToggleSelectSkill}
            onSelectSite={(_: string) => undefined}
            onCreateSkill={handleCreateSkill}
            onDeleteSkillSite={handleDeleteSkillSite}
            onRequestFullscreen={props.onRequestFullscreen}
          />
        )}
      </FluentProvider>
    </IdPrefixProvider>
  );
}
