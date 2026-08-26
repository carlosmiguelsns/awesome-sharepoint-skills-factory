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
import InlineSkillsView from './inline/InlineSkillsView';
import SkillsFactoryDashboard, { type DashboardTab } from './fullscreen/SkillsFactoryDashboard';

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
  inputQuery?: string;
  onRequestFullscreen: () => Promise<void>;
  onRequestInline: () => Promise<void>;
}

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
  const [inlineMode, setInlineMode] = React.useState<'my-skills' | 'skill-usage'>('my-skills');
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(
    props.hostContext.displayMode === 'fullscreen' ? 'all-skills' : 'my-skills'
  );
  const [searchText, setSearchText] = React.useState<string>('');
  const [siteSearchText, setSiteSearchText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [discoveredSiteCount, setDiscoveredSiteCount] = React.useState<number>(0);
  const [loadingMessage, setLoadingMessage] = React.useState<string>('Loading skills factory…');

  const requestedSkillName: string = React.useMemo(() => {
    const query: string = (props.inputQuery || '').trim();
    const match: RegExpMatchArray | null =
      query.match(/^where is\s+(.+?)\s+skill\s+used\??$/i) ||
      query.match(/^where is\s+(.+?)\s+used\??$/i) ||
      query.match(/where is\s+(.+?)\s+skill used/i) ||
      query.match(/where is\s+(.+?)\s+used/i);
    return match ? match[1].trim().replace(/^the\s+/i, '') : '';
  }, [props.inputQuery]);

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

  React.useEffect(() => {
    if (props.hostContext.displayMode === 'inline') {
      const query: string = (props.inputQuery || '').trim().toLowerCase();
      const isUsageQuery: boolean = query.startsWith('where is ') || query.includes(' where is ') || query.includes(' used?');
      setInlineMode(isUsageQuery ? 'skill-usage' : 'my-skills');
      setActiveTab('my-skills');
    }
  }, [props.hostContext.displayMode, props.inputQuery]);

  const mySkills: Skill[] = React.useMemo(
    () => skills.filter((skill: Skill) => skill.isOwnedByCurrentUser),
    [skills]
  );

  const topMySkills: Skill[] = React.useMemo(
    () =>
      mySkills
        .slice()
        .sort((left: Skill, right: Skill) => right.usageCount - left.usageCount || right.modifiedDate.localeCompare(left.modifiedDate))
        .slice(0, 5),
    [mySkills]
  );

  const filteredMySkills: Skill[] = React.useMemo(() => {
    const source: Skill[] = mySkills;
    const needle: string = searchText.trim().toLowerCase();

    return source.filter((skill: Skill) => {
      const matchesSearch: boolean = !needle
        ? true
        : [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')]
            .join(' ')
            .toLowerCase()
            .indexOf(needle) !== -1;
      return matchesSearch;
    });
  }, [mySkills, searchText]);

  const filteredAllSkills: Skill[] = React.useMemo(() => {
    const needle: string = searchText.trim().toLowerCase();

    return skills.filter((skill: Skill) => {
      const matchesSearch: boolean = !needle
        ? true
        : [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')]
            .join(' ')
            .toLowerCase()
            .indexOf(needle) !== -1;
      return matchesSearch;
    });
  }, [searchText, skills]);

  const visibleSkills: Skill[] = activeTab === 'my-skills' ? filteredMySkills : filteredAllSkills;

  React.useEffect(() => {
    if (visibleSkills.length === 0) {
      return;
    }

    if (!selectedSkillId || !visibleSkills.some((skill: Skill) => skill.id === selectedSkillId)) {
      setSelectedSkillId(visibleSkills[0].id);
    }
  }, [visibleSkills, selectedSkillId]);

  const selectedSkill: Skill | undefined = React.useMemo(
    () => skills.find((skill: Skill) => skill.id === selectedSkillId),
    [selectedSkillId, skills]
  );

  const requestedUsageSkill: Skill | undefined = React.useMemo(() => {
    if (!requestedSkillName) {
      return undefined;
    }

    const normalized: string = requestedSkillName.toLowerCase();
    const normalizedCompact: string = normalized.replace(/\s+/g, '');
    return (
      skills.find((skill: Skill) => skill.name.toLowerCase() === normalized) ||
      skills.find((skill: Skill) => skill.name.toLowerCase().includes(normalized)) ||
      skills.find((skill: Skill) => skill.name.toLowerCase().replace(/\s+/g, '') === normalizedCompact)
    );
  }, [requestedSkillName, skills]);

  const requestedUsageSites: SharePointSite[] = React.useMemo(() => {
    if (!requestedUsageSkill) {
      return [];
    }

    return sites.filter((site: SharePointSite) => requestedUsageSkill.siteIds.indexOf(site.id) !== -1);
  }, [requestedUsageSkill, sites]);

  const handleCollapse = React.useCallback(async (): Promise<void> => {
    setActiveTab('my-skills');
    await props.onRequestInline();
  }, [props.onRequestInline]);

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
            skills={inlineMode === 'skill-usage' ? filteredAllSkills : topMySkills}
            selectedSkill={selectedSkill}
            usageSkillName={requestedUsageSkill?.name}
            sites={inlineMode === 'skill-usage' ? requestedUsageSites : sites}
            usageSiteCount={inlineMode === 'skill-usage' ? requestedUsageSites.length : undefined}
            siteCollections={siteCollections}
            onSelectSkill={setSelectedSkillId}
            onExpand={async (): Promise<void> => {
              setActiveTab(inlineMode === 'skill-usage' ? 'all-skills' : 'my-skills');
              await props.onRequestFullscreen();
            }}
          />
        ) : (
          <SkillsFactoryDashboard
            currentUserName={props.currentUserName}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            siteSearchText={siteSearchText}
            onSiteSearchTextChange={setSiteSearchText}
            mySkills={filteredMySkills}
            allSkills={filteredAllSkills}
            usageSkills={skills}
            siteCollections={siteCollections}
            sites={sites}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkillId}
            onSelectSite={(_: string) => undefined}
            onCollapseToInline={handleCollapse}
          />
        )}
      </FluentProvider>
    </IdPrefixProvider>
  );
}
