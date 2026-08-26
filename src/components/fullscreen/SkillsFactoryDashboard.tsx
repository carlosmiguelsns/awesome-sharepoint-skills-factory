import * as React from 'react';

import { Body1, Button, Card, CardHeader, Field, Input, Tab, TabList, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ArrowCollapseAll24Regular } from '@fluentui/react-icons';

import type { SharePointSite, SiteCollection, Skill } from '../../models';
import SkillCards from '../SkillCards';
import SkillDetailsPanel from './SkillDetailsPanel';
import SitesTable from './SitesTable';
import SkillsTable from './SkillsTable';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  toolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    alignItems: 'end',
    justifyContent: 'space-between'
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    alignItems: 'end'
  },
  filterField: {
    flex: '1 1 260px',
    minWidth: '260px'
  },
  body: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'start'
  },
  fullWidthBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  usageSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(160px, 180px))',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'start'
  },
  summaryCard: {
    minHeight: '100%',
    padding: tokens.spacingVerticalS
  },
  summaryCardCompact: {
    width: '180px',
    alignSelf: 'flex-start',
    minHeight: '72px',
    padding: tokens.spacingVerticalS
  },
  summaryLabel: {
    color: tokens.colorNeutralForeground3
  },
  summaryValue: {
    color: tokens.colorBrandForeground1
  },
  skillDetailsBody: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
    gap: tokens.spacingHorizontalM,
    alignItems: 'start'
  }
});

export type DashboardTab = 'my-skills' | 'all-skills' | 'usage';

export interface ISkillsFactoryDashboardProps {
  currentUserName: string;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  siteSearchText: string;
  onSiteSearchTextChange: (value: string) => void;
  mySkills: Skill[];
  allSkills: Skill[];
  usageSkills: Skill[];
  siteCollections: SiteCollection[];
  sites: SharePointSite[];
  selectedSkill?: Skill;
  selectedSite?: SharePointSite;
  onSelectSkill: (skillId: string) => void;
  onSelectSite: (siteId: string) => void;
  onCollapseToInline: () => void;
}

export default function SkillsFactoryDashboard(props: ISkillsFactoryDashboardProps): React.ReactElement {
  const styles = useStyles();
  const itemsPerPage: number = 10;
  const [usagePage, setUsagePage] = React.useState<number>(1);
  const [usageSortField, setUsageSortField] = React.useState<'site' | 'url' | 'collection' | 'skills'>('site');
  const [usageSortDirection, setUsageSortDirection] = React.useState<'ascending' | 'descending'>('ascending');

  const usageSites: SharePointSite[] = props.selectedSkill
    ? props.sites.filter((site: SharePointSite) => props.selectedSkill?.siteIds.indexOf(site.id) !== -1)
    : props.sites.slice(0, 5);

  const usageCollections: SiteCollection[] = props.selectedSkill
    ? props.siteCollections.filter((collection: SiteCollection) => props.selectedSkill?.siteCollectionIds.indexOf(collection.id) !== -1)
    : props.siteCollections;

  const filteredSites: SharePointSite[] = React.useMemo(() => {
    const needle: string = props.siteSearchText.trim().toLowerCase();
    if (!needle) {
      return props.sites;
    }
    return props.sites.filter((site: SharePointSite) =>
      [site.name, site.url, site.webUrl, site.siteCollectionName, site.hostname].filter(Boolean).join(' ').toLowerCase().indexOf(needle) !== -1
    );
  }, [props.siteSearchText, props.sites]);

  React.useEffect(() => {
    setUsagePage(1);
  }, [props.siteSearchText]);

  React.useEffect(() => {
    setUsagePage(1);
  }, [usageSortField, usageSortDirection]);

  const sortedFilteredSites: SharePointSite[] = React.useMemo(() => {
    const compareText = (left: string, right: string): number => left.localeCompare(right, undefined, { sensitivity: 'base' });
    const items: SharePointSite[] = filteredSites.slice();

    items.sort((left: SharePointSite, right: SharePointSite) => {
      let comparison: number = 0;
      if (usageSortField === 'site') {
        comparison = compareText(left.name, right.name);
      } else if (usageSortField === 'url') {
        comparison = compareText(left.webUrl || left.url, right.webUrl || right.url);
      } else if (usageSortField === 'collection') {
        comparison = compareText(left.siteCollectionName || '', right.siteCollectionName || '');
      } else {
        const leftCount: number = props.allSkills.filter((skill: Skill) => skill.siteIds.indexOf(left.id) !== -1).length;
        const rightCount: number = props.allSkills.filter((skill: Skill) => skill.siteIds.indexOf(right.id) !== -1).length;
        comparison = leftCount - rightCount;
      }

      return usageSortDirection === 'ascending' ? comparison : -comparison;
    });

    return items;
  }, [filteredSites, props.allSkills, usageSortDirection, usageSortField]);

  const usagePageCount: number = Math.max(1, Math.ceil(filteredSites.length / itemsPerPage));
  const safeUsagePage: number = Math.min(usagePage, usagePageCount);
  const usagePageSites: SharePointSite[] = sortedFilteredSites.slice((safeUsagePage - 1) * itemsPerPage, safeUsagePage * itemsPerPage);
  const selectedSite: SharePointSite | undefined = usagePageSites.find((site: SharePointSite) => site.id === props.selectedSite?.id) || usagePageSites[0];
  const handleUsageSortChange = React.useCallback((field: 'site' | 'url' | 'collection' | 'skills'): void => {
    if (usageSortField === field) {
      setUsageSortDirection((current) => (current === 'ascending' ? 'descending' : 'ascending'));
      return;
    }

    setUsageSortField(field);
    setUsageSortDirection(field === 'skills' ? 'descending' : 'ascending');
  }, [usageSortField]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Text size={600} weight="semibold">
          Awesome SharePoint Skills Factory
        </Text>
        <Body1>Create. Discover. Understand.</Body1>
      </div>

      <div className={styles.toolbar}>
        <TabList selectedValue={props.activeTab} onTabSelect={(_, data) => props.onTabChange(data.value as DashboardTab)}>
          <Tab value="my-skills">My Skills</Tab>
          <Tab value="all-skills">All Skills</Tab>
          <Tab value="usage">Usage</Tab>
        </TabList>

        <div className={styles.filters}>
          <Field className={styles.filterField} label="Search" orientation="horizontal">
            <Input value={props.searchText} onChange={(_, data) => props.onSearchTextChange(data.value)} placeholder="Search skills" />
          </Field>
          <Field className={styles.filterField} label="Search sites" orientation="horizontal">
            <Input value={props.siteSearchText} onChange={(_, data) => props.onSiteSearchTextChange(data.value)} placeholder="Search sites..." />
          </Field>
          <Button appearance="secondary" icon={<ArrowCollapseAll24Regular />} onClick={props.onCollapseToInline}>
            Collapse
          </Button>
        </div>
      </div>

      {props.activeTab === 'my-skills' ? (
        <div className={styles.fullWidthBody}>
          <Card className={styles.summaryCardCompact}>
            <CardHeader header={<Text weight="semibold">My skills</Text>} />
            <Text size={700} weight="semibold" className={styles.summaryValue}>
              {props.mySkills.length}
            </Text>
          </Card>
          <div className={styles.skillDetailsBody}>
            <div className={styles.fullWidthBody}>
              <SkillCards
                skills={props.mySkills}
                currentUserName={props.currentUserName}
                selectedSkillId={props.selectedSkill?.id}
                onSelectSkill={props.onSelectSkill}
              />
            </div>
            <SkillDetailsPanel
              skill={props.selectedSkill}
              sites={usageSites}
              siteCollections={usageCollections}
              currentUserName={props.currentUserName}
            />
          </div>
        </div>
      ) : null}

      {props.activeTab === 'all-skills' ? (
        <div className={styles.fullWidthBody}>
          <Card className={styles.summaryCardCompact}>
            <CardHeader header={<Text weight="semibold">All skills</Text>} />
            <Text size={700} weight="semibold" className={styles.summaryValue}>
              {props.allSkills.length}
            </Text>
          </Card>
          <div className={styles.body}>
            <div className={styles.fullWidthBody}>
              <SkillsTable
                skills={props.allSkills}
                siteCollections={props.siteCollections}
                selectedSkillId={props.selectedSkill?.id}
                onSelectSkill={props.onSelectSkill}
              />
            </div>
            <SkillDetailsPanel
              skill={props.selectedSkill}
              sites={usageSites}
              siteCollections={usageCollections}
              currentUserName={props.currentUserName}
            />
          </div>
        </div>
      ) : null}

      {props.activeTab === 'usage' ? (
        <div className={styles.fullWidthBody}>
          <div className={styles.usageSummary}>
            <Card className={styles.summaryCardCompact}>
              <CardHeader header={<Text weight="semibold">SharePoint sites</Text>} />
              <Text size={700} weight="semibold" className={styles.summaryValue}>
                {filteredSites.length}
              </Text>
            </Card>
            <Card className={styles.summaryCardCompact}>
              <CardHeader header={<Text weight="semibold">Total skills</Text>} />
              <Text size={700} weight="semibold" className={styles.summaryValue}>
                {props.allSkills.length}
              </Text>
            </Card>
          </div>
          <Card>
            <SitesTable
              sites={usagePageSites}
              skills={props.allSkills}
              selectedSiteId={selectedSite?.id}
              onSelectSite={props.onSelectSite}
              sortField={usageSortField}
              sortDirection={usageSortDirection}
              onSortChange={handleUsageSortChange}
            />
            <div className={styles.toolbar} style={{ marginTop: tokens.spacingVerticalS }}>
              <Body1>
                Page {safeUsagePage} of {usagePageCount}
              </Body1>
              <div className={styles.filters}>
                <Button appearance="secondary" disabled={safeUsagePage <= 1} onClick={() => setUsagePage((page) => Math.max(1, page - 1))}>
                  Previous
                </Button>
                <Button
                  appearance="secondary"
                  disabled={safeUsagePage >= usagePageCount}
                  onClick={() => setUsagePage((page) => Math.min(usagePageCount, page + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
