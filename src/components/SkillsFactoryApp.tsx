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
import type { ICreateSkillRequest } from '../services/TenantSharePointDataService';

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
  onRequestFullscreen: () => Promise<void>;
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
  const [activeTab, setActiveTab] = React.useState<DashboardTab>(
    'all-skills'
  );
  const [searchText, setSearchText] = React.useState<string>('');
  const [siteSearchText, setSiteSearchText] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [discoveredSiteCount, setDiscoveredSiteCount] = React.useState<number>(0);
  const [loadingMessage, setLoadingMessage] = React.useState<string>('Loading skills factory…');

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

  const visibleSkills: Skill[] = filteredAllSkills;

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
            skills={topMySkills}
            onSelectSkill={setSelectedSkillId}
            onExpand={async (): Promise<void> => {
              setActiveTab('all-skills');
              await props.onRequestFullscreen();
            }}
          />
        ) : (
          <SkillsFactoryDashboard
            hostContext={props.hostContext}
            targetDocument={props.targetDocument}
            currentUserName={props.currentUserName}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            siteSearchText={siteSearchText}
            onSiteSearchTextChange={setSiteSearchText}
            allSkills={skills}
            usageSkills={skills}
            siteCollections={siteCollections}
            sites={sites}
            selectedSkill={selectedSkill}
            onSelectSkill={setSelectedSkillId}
            onSelectSite={(_: string) => undefined}
            onCreateSkill={async (request: ICreateSkillRequest) => {
              const result = await skillService.createSkill(request);
              await refreshSkills();
              return result;
            }}
            onRequestFullscreen={props.onRequestFullscreen}
          />
        )}
      </FluentProvider>
    </IdPrefixProvider>
  );
}
