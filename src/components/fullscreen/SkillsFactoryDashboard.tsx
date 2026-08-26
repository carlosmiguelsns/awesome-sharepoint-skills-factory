import * as React from 'react';

import {
  Badge,
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Field,
  FluentProvider,
  IdPrefixProvider,
  Input,
  Tab,
  TabList,
  Title3,
  Text,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronRight24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';

import type { SharePointSite, SiteCollection, Skill } from '../../models';
import SkillCards from '../SkillCards';
import SkillDetailsPanel from './SkillDetailsPanel';
import SitesTable from './SitesTable';
import SkillsTable from './SkillsTable';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, padding: tokens.spacingHorizontalM },
  header: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
  toolbar: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center', justifyContent: 'space-between' },
  toolbarActions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center' },
  searchBar: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'end' },
  searchField: { flex: '1 1 320px', minWidth: '260px' },
  body: { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: tokens.spacingHorizontalM, alignItems: 'start' },
  fullWidthBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  usageLayout: { display: 'grid', gap: tokens.spacingVerticalS },
  usageShell: { position: 'relative', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  usageBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  usageTopBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, alignItems: 'start' },
  usageFilterChips: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, alignItems: 'center' },
  usagePanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 'min(420px, 92vw)',
    maxWidth: '100%',
    zIndex: 5,
    boxShadow: tokens.shadow16,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderBottomLeftRadius: tokens.borderRadiusLarge
  },
  usagePanelBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
  usagePanelSpacer: { minHeight: '1px' },
  searchPanel: { position: 'absolute', right: 0, top: 0, width: 'min(420px, 92vw)', zIndex: 5, boxShadow: tokens.shadow16, borderLeft: `1px solid ${tokens.colorNeutralStroke2}`, borderTopLeftRadius: tokens.borderRadiusLarge, borderBottomLeftRadius: tokens.borderRadiusLarge },
  searchPanelBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: tokens.spacingHorizontalS, alignItems: 'end' },
  filterField: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  filterPanel: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  filterPanelHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: tokens.spacingHorizontalS },
  filterPanelTitle: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  filterPanelClose: { alignSelf: 'flex-end' },
  select: { minHeight: '32px', borderRadius: tokens.borderRadiusMedium, border: `1px solid ${tokens.colorNeutralStroke2}`, backgroundColor: tokens.colorNeutralBackground1, color: tokens.colorNeutralForeground1, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, font: 'inherit' },
  filterSummary: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, alignItems: 'center' },
  usageCard: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  compactStatCard: { display: 'inline-flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS, minHeight: '92px', width: 'fit-content', minWidth: '180px', padding: tokens.spacingVerticalM },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: tokens.spacingHorizontalM },
  kpiCard: { minHeight: '104px' },
  chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: tokens.spacingHorizontalS },
  chartCard: { minHeight: '100%', maxHeight: '460px', overflowY: 'auto' },
  chartWide: { gridColumn: '1 / -1' },
  chartList: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  chartItem: { border: 'none', background: 'transparent', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
  chartItemHeader: { display: 'flex', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, alignItems: 'baseline' },
  chartTrack: { height: '10px', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorNeutralBackground3, overflow: 'hidden' },
  chartFill: { height: '100%', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorBrandBackground },
  chartNote: { color: tokens.colorNeutralForeground3 },
  donutLayout: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, alignItems: 'center' },
  donutSvg: { width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' },
  donutCaption: { textAlign: 'center', color: tokens.colorNeutralForeground3 },
  donutLegend: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  donutButton: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, width: '100%', border: `1px solid ${tokens.colorNeutralStroke2}`, borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground1, padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`, cursor: 'pointer' },
  legendLeft: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  legendSwatch: { width: '12px', height: '12px', borderRadius: tokens.borderRadiusCircular, flexShrink: 0 },
  legendGreen: { backgroundColor: tokens.colorPaletteGreenForeground1 },
  legendGray: { backgroundColor: tokens.colorNeutralStroke1 },
  siteTiles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: tokens.spacingHorizontalS },
  siteTile: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalM,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    minHeight: '100%'
  },
  siteTileHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: tokens.spacingHorizontalS },
  siteTileMeta: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS, minWidth: 0, flex: '1 1 auto' },
  siteTileUrl: { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  siteSkillRow: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, minWidth: 0 },
  siteSkillCount: { flexShrink: 0, alignSelf: 'flex-start' },
  siteSkillMore: { color: tokens.colorNeutralForeground3 },
  usageViewport: { paddingRight: tokens.spacingHorizontalXXS },
  heatmapScroll: { overflow: 'auto' },
  heatmapTable: { borderCollapse: 'collapse', minWidth: 'max-content', width: '100%' },
  heatmapCorner: { position: 'sticky', top: 0, left: 0, zIndex: 3, backgroundColor: tokens.colorNeutralBackground1, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, textAlign: 'left', whiteSpace: 'nowrap' },
  heatmapHeader: { position: 'sticky', top: 0, zIndex: 2, backgroundColor: tokens.colorNeutralBackground1, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, textAlign: 'center', whiteSpace: 'nowrap' },
  heatmapRowHeader: { position: 'sticky', left: 0, zIndex: 1, backgroundColor: tokens.colorNeutralBackground1, borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, textAlign: 'left', whiteSpace: 'nowrap' },
  heatmapCell: { width: '40px', height: '40px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}`, borderRight: `1px solid ${tokens.colorNeutralStroke2}`, padding: 0, textAlign: 'center' },
  heatmapPresent: { backgroundColor: tokens.colorPaletteGreenBackground2 },
  heatmapEmpty: { backgroundColor: tokens.colorNeutralBackground2 },
  heatmapButton: { width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer' },
  heatmapMark: { fontWeight: 700, color: tokens.colorNeutralForeground1 },
  tableCard: { overflow: 'hidden' },
  paginationBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, alignItems: 'center', marginTop: tokens.spacingVerticalM }
});

export type DashboardTab = 'my-skills' | 'all-skills' | 'usage';
type UsageSortField = 'site' | 'url' | 'collection' | 'skills';
type UsageSortDirection = 'ascending' | 'descending';
type CoverageFilter = 'all' | 'with-skills' | 'without-skills';

export interface ISkillsFactoryDashboardProps {
  hostContext: ICopilotComponentHostContext;
  targetDocument?: Document;
  inputQuery?: string;
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
  onRequestFullscreen: () => Promise<void>;
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, undefined, { sensitivity: 'base' });
}

function buildSiteSkillMap(sites: SharePointSite[], skills: Skill[]): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const site of sites) map.set(site.id, new Set<string>());
  for (const skill of skills) {
    for (const siteId of skill.siteIds) {
      const siteSkills = map.get(siteId);
      if (siteSkills) siteSkills.add(skill.id);
    }
  }
  return map;
}

export default function SkillsFactoryDashboard(props: ISkillsFactoryDashboardProps): React.ReactElement {
  const styles = useStyles();
  const [usagePage, setUsagePage] = React.useState<number>(1);
  const [usageSortField, setUsageSortField] = React.useState<UsageSortField>('site');
  const [usageSortDirection, setUsageSortDirection] = React.useState<UsageSortDirection>('ascending');
  const [usageSkillFilterId, setUsageSkillFilterId] = React.useState<string | undefined>();
  const [usageSiteFilterId, setUsageSiteFilterId] = React.useState<string | undefined>();
  const [usageCoverageFilter, setUsageCoverageFilter] = React.useState<CoverageFilter>('all');
  const [usageFiltersOpen, setUsageFiltersOpen] = React.useState<boolean>(false);
  const [skillsSearchOpen, setSkillsSearchOpen] = React.useState<boolean>(false);

  const theme = props.hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const siteSkillMap = React.useMemo(() => buildSiteSkillMap(props.sites, props.usageSkills), [props.sites, props.usageSkills]);

  const filteredMySkills = React.useMemo(() => {
    const needle = props.searchText.trim().toLowerCase();
    return props.mySkills.filter((skill) => !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1);
  }, [props.mySkills, props.searchText]);

  const filteredAllSkills = React.useMemo(() => {
    const needle = props.searchText.trim().toLowerCase();
    return props.allSkills.filter((skill) => !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1);
  }, [props.allSkills, props.searchText]);

  const visibleSites = React.useMemo(() => {
    const needle = props.siteSearchText.trim().toLowerCase();
    return props.sites.filter((site) => {
      if (usageSiteFilterId && site.id !== usageSiteFilterId) return false;
      const hasSkills = (siteSkillMap.get(site.id)?.size || 0) > 0;
      if (usageCoverageFilter === 'with-skills' && !hasSkills) return false;
      if (usageCoverageFilter === 'without-skills' && hasSkills) return false;
      if (usageSkillFilterId && !(siteSkillMap.get(site.id)?.has(usageSkillFilterId) || false)) return false;
      const haystack = [site.name, site.url, site.webUrl, site.siteCollectionName, site.hostname, site.description].filter(Boolean).join(' ').toLowerCase();
      return !needle || haystack.indexOf(needle) !== -1;
    });
  }, [props.siteSearchText, props.sites, siteSkillMap, usageCoverageFilter, usageSkillFilterId, usageSiteFilterId]);

  const visibleSiteSet = React.useMemo(() => new Set(visibleSites.map((site) => site.id)), [visibleSites]);
  const visibleSkills = React.useMemo(() => props.usageSkills.filter((skill) => skill.siteIds.some((siteId) => visibleSiteSet.has(siteId))), [props.usageSkills, visibleSiteSet]);

  const skillCountById = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const skill of visibleSkills) counts.set(skill.id, skill.siteIds.filter((siteId) => visibleSiteSet.has(siteId)).length);
    return counts;
  }, [visibleSiteSet, visibleSkills]);

  const siteCountById = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const site of visibleSites) counts.set(site.id, visibleSkills.filter((skill) => skill.siteIds.indexOf(site.id) !== -1).length);
    return counts;
  }, [visibleSites, visibleSkills]);

  const sortedUsageSkills = React.useMemo(() => visibleSkills.slice().sort((left, right) => (skillCountById.get(right.id) || 0) - (skillCountById.get(left.id) || 0) || compareText(left.name, right.name)), [skillCountById, visibleSkills]);
  const sortedUsageSites = React.useMemo(() => visibleSites.slice().sort((left, right) => {
    if (usageSortField === 'site') return usageSortDirection === 'ascending' ? compareText(left.name, right.name) : compareText(right.name, left.name);
    if (usageSortField === 'url') return usageSortDirection === 'ascending' ? compareText(left.webUrl || left.url, right.webUrl || right.url) : compareText(right.webUrl || right.url, left.webUrl || left.url);
    if (usageSortField === 'collection') return usageSortDirection === 'ascending' ? compareText(left.siteCollectionName || '', right.siteCollectionName || '') : compareText(right.siteCollectionName || '', left.siteCollectionName || '');
    const diff = (siteCountById.get(left.id) || 0) - (siteCountById.get(right.id) || 0);
    return usageSortDirection === 'ascending' ? diff : -diff;
  }), [siteCountById, usageSortDirection, usageSortField, visibleSites]);

  const visibleSitesWithSkills = React.useMemo(() => visibleSites.filter((site) => (siteCountById.get(site.id) || 0) > 0).length, [siteCountById, visibleSites]);
  const visibleSitesWithoutSkills = Math.max(0, visibleSites.length - visibleSitesWithSkills);
  const visibleAverageSkillsPerSite = visibleSites.length ? visibleSkills.length / visibleSites.length : 0;

  const usagePageCount = Math.max(1, Math.ceil(sortedUsageSites.length / 10));
  const safeUsagePage = Math.min(usagePage, usagePageCount);
  const usagePageSites = sortedUsageSites.slice((safeUsagePage - 1) * 10, safeUsagePage * 10);

  React.useEffect(() => { setUsagePage(1); }, [props.siteSearchText, usageCoverageFilter, usageSkillFilterId, usageSiteFilterId, usageSortDirection, usageSortField]);

  const handleUsageSortChange = React.useCallback((field: UsageSortField) => {
    if (usageSortField === field) {
      setUsageSortDirection((current) => (current === 'ascending' ? 'descending' : 'ascending'));
      return;
    }
    setUsageSortField(field);
    setUsageSortDirection(field === 'skills' ? 'descending' : 'ascending');
  }, [usageSortField]);

  const clearUsageFilters = React.useCallback(() => {
    setUsageSkillFilterId(undefined);
    setUsageSiteFilterId(undefined);
    setUsageCoverageFilter('all');
    props.onSiteSearchTextChange('');
  }, [props.onSiteSearchTextChange]);

  const themeForHost = theme;

  return (
    <IdPrefixProvider value="sharepoint-skills-factory-">
      <FluentProvider theme={themeForHost} targetDocument={props.targetDocument} className={styles.root}>
        <div className={styles.header}>
          <Text size={600} weight="semibold">Awesome SharePoint Skills Factory</Text>
          <Body1>Create. Discover. Understand.</Body1>
        </div>

        <div className={styles.toolbar}>
          <TabList selectedValue={props.activeTab} onTabSelect={(_, data) => props.onTabChange(data.value as DashboardTab)}>
            <Tab value="my-skills">My Skills</Tab>
            <Tab value="all-skills">All Skills</Tab>
            <Tab value="usage">Usage</Tab>
          </TabList>
        </div>

        {(props.activeTab === 'my-skills' || props.activeTab === 'all-skills') && (
          <div className={styles.usageShell}>
            <div className={styles.usageTopBar}>
              <div className={styles.usageFilterChips}>
                {props.searchText.trim() ? <Badge appearance="outline">Search: {props.searchText.trim()}</Badge> : null}
              </div>
              <div className={styles.toolbarActions}>
                <Button appearance="secondary" icon={skillsSearchOpen ? <ChevronRight24Regular /> : <ChevronDown24Regular />} onClick={() => setSkillsSearchOpen((current) => !current)}>
                  {skillsSearchOpen ? 'Close search' : 'Open search'}
                </Button>
                <Button appearance="secondary" onClick={() => props.onSearchTextChange('')} disabled={!props.searchText.trim()}>
                  Clear search
                </Button>
              </div>
            </div>
            {skillsSearchOpen ? (
              <Card className={styles.searchPanel}>
                <div className={styles.searchPanelBody}>
                  <div className={styles.filterPanelHeader}>
                    <div className={styles.filterPanelTitle}>
                      <Text weight="semibold">Search</Text>
                      <Caption1>Filter skills in the current tab.</Caption1>
                    </div>
                    <Button className={styles.filterPanelClose} appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close search" onClick={() => setSkillsSearchOpen(false)} />
                  </div>
                  <Field className={styles.filterField} label="Search" orientation="horizontal">
                    <Input value={props.searchText} onChange={(_, data) => props.onSearchTextChange(data.value)} placeholder="Search skills" />
                  </Field>
                </div>
              </Card>
            ) : null}
          </div>
        )}

        {props.activeTab === 'my-skills' && (
          <div className={styles.usageLayout}>
            <Card className={styles.compactStatCard}><CardHeader header={<Text weight="semibold">My skills</Text>} /><Text size={700} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>{props.mySkills.length}</Text></Card>
            <div className={styles.body}>
              <div className={styles.fullWidthBody}><SkillCards skills={filteredMySkills} currentUserName={props.currentUserName} selectedSkillId={props.selectedSkill?.id} onSelectSkill={props.onSelectSkill} /></div>
              <SkillDetailsPanel skill={props.selectedSkill} sites={props.sites.filter((site) => (props.selectedSkill?.siteIds || []).indexOf(site.id) !== -1)} siteCollections={props.siteCollections} currentUserName={props.currentUserName} />
            </div>
          </div>
          )}

        {props.activeTab === 'all-skills' && (
          <div className={styles.usageLayout}>
            <Card className={styles.compactStatCard}><CardHeader header={<Text weight="semibold">All skills</Text>} /><Text size={700} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>{props.allSkills.length}</Text></Card>
            <div className={styles.body}>
                <div className={styles.fullWidthBody}><SkillsTable skills={filteredAllSkills} siteCollections={props.siteCollections} selectedSkillId={props.selectedSkill?.id} onSelectSkill={props.onSelectSkill} /></div>
                <SkillDetailsPanel skill={props.selectedSkill} sites={props.sites.filter((site) => (props.selectedSkill?.siteIds || []).indexOf(site.id) !== -1)} siteCollections={props.siteCollections} currentUserName={props.currentUserName} />
              </div>
            </div>
        )}

        {props.activeTab === 'usage' && (
          <div className={styles.usageShell}>
            <div className={styles.usageTopBar}>
              <div className={styles.usageFilterChips}>
                {usageSkillFilterId && <Badge appearance="outline">Skill: {props.usageSkills.find((skill) => skill.id === usageSkillFilterId)?.name}</Badge>}
                {usageSiteFilterId && <Badge appearance="outline">Site: {props.sites.find((site) => site.id === usageSiteFilterId)?.name}</Badge>}
                {usageCoverageFilter !== 'all' && <Badge appearance="outline">Coverage: {usageCoverageFilter === 'with-skills' ? 'with skills' : 'without skills'}</Badge>}
                {props.siteSearchText.trim() && <Badge appearance="outline">Search: {props.siteSearchText.trim()}</Badge>}
                {null}
              </div>
              <div className={styles.toolbarActions}>
                <Button appearance="secondary" icon={usageFiltersOpen ? <ChevronRight24Regular /> : <ChevronDown24Regular />} onClick={() => setUsageFiltersOpen((current) => !current)}>
                  {usageFiltersOpen ? 'Close filters' : 'Open filters'}
                </Button>
                <Button appearance="secondary" onClick={clearUsageFilters} disabled={!props.siteSearchText.trim() && !usageSkillFilterId && !usageSiteFilterId && usageCoverageFilter === 'all'}>
                  Clear filters
                </Button>
              </div>
            </div>

            {usageFiltersOpen ? (
              <Card className={styles.usagePanel}>
                <div className={styles.usagePanelBody}>
                  <div className={styles.filterPanelHeader}>
                    <div className={styles.filterPanelTitle}>
                      <Text weight="semibold">Usage filters</Text>
                      <Caption1>Slide-over panel for filtering the dashboard.</Caption1>
                    </div>
                    <Button className={styles.filterPanelClose} appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close usage filters" onClick={() => setUsageFiltersOpen(false)} />
                  </div>
                  <div className={styles.filterGrid}>
                    <label className={styles.filterField}><Text weight="semibold">Skill</Text><select className={styles.select} value={usageSkillFilterId || ''} onChange={(event) => setUsageSkillFilterId(event.target.value || undefined)}><option value="">All skills</option>{props.usageSkills.slice().sort((a, b) => compareText(a.name, b.name)).map((skill) => <option key={skill.id} value={skill.id}>{skill.name}</option>)}</select></label>
                    <label className={styles.filterField}><Text weight="semibold">Site</Text><select className={styles.select} value={usageSiteFilterId || ''} onChange={(event) => setUsageSiteFilterId(event.target.value || undefined)}><option value="">All sites</option>{props.sites.slice().sort((a, b) => compareText(a.name, b.name)).map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}</select></label>
                    <label className={styles.filterField}><Text weight="semibold">Sites with/without skills</Text><select className={styles.select} value={usageCoverageFilter} onChange={(event) => setUsageCoverageFilter(event.target.value as CoverageFilter)}><option value="all">All sites</option><option value="with-skills">With skills</option><option value="without-skills">Without skills</option></select></label>
                    <Field className={styles.filterField} label="Search sites"><Input value={props.siteSearchText} onChange={(_, data) => props.onSiteSearchTextChange(data.value)} placeholder="Search sites, URLs, or collections" /></Field>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className={styles.usagePanelSpacer} />
            <Card className={styles.usageCard}>
              <div className={styles.kpiGrid}>
                {[
                  ['Total Sites', visibleSites.length, 'Sites in the current view'],
                  ['Total Skills', visibleSkills.length, 'Skills used by those sites'],
                  ['Sites with Skills', visibleSitesWithSkills, 'Sites showing at least one skill'],
                  ['Sites without Skills', visibleSitesWithoutSkills, 'Coverage gaps in the current view'],
                  ['Average Skills / Site', visibleAverageSkillsPerSite.toFixed(1), 'Mean skills per visible site']
                ].map(([label, value, hint]) => (
                  <Card key={String(label)} className={styles.kpiCard}>
                    <CardHeader header={<Text weight="semibold">{label}</Text>} />
                    <Text size={800} weight="semibold" style={{ color: tokens.colorBrandForeground1 }}>{value}</Text>
                    <Caption1>{hint}</Caption1>
                  </Card>
                ))}
              </div>

              <div className={styles.chartGrid}>
                <Card className={styles.chartCard}>
                  <CardHeader header={<Text weight="semibold">Skills ranked by site adoption</Text>} description={<Caption1>Horizontal bars show how many visible sites use each skill.</Caption1>} />
                  <div className={styles.chartList}>
                    {sortedUsageSkills.length ? sortedUsageSkills.map((skill) => {
                      const count = skillCountById.get(skill.id) || 0;
                      const maxCount = Math.max(...Array.from(skillCountById.values()), 1);
                      return <button key={skill.id} type="button" className={styles.chartItem} onClick={() => setUsageSkillFilterId(skill.id)}><div className={styles.chartItemHeader}><Text weight="semibold">{skill.name}</Text><Caption1>{count} site{count === 1 ? '' : 's'}</Caption1></div><div className={styles.chartTrack}><div className={styles.chartFill} style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }} /></div></button>;
                    }) : <Body1 className={styles.chartNote}>No skills match the current filters.</Body1>}
                  </div>
                </Card>

                <Card className={styles.chartCard}>
                  <CardHeader header={<Text weight="semibold">Sites with vs. without skills</Text>} description={<Caption1>Coverage and gap view for the current scope.</Caption1>} />
                  <div className={styles.donutLayout}>
                    <svg viewBox="0 0 160 160" className={styles.donutSvg} role="img" aria-label="Sites with skills versus sites without skills">
                      <circle cx="80" cy="80" r="54" fill="none" stroke={tokens.colorNeutralBackground3} strokeWidth="20" />
                      {visibleSites.length ? (() => { const circumference = 2 * Math.PI * 54; const withLength = circumference * (visibleSitesWithSkills / visibleSites.length); const withoutLength = circumference - withLength; return (<>
                        <circle cx="80" cy="80" r="54" fill="none" stroke={tokens.colorPaletteGreenForeground1} strokeWidth="20" strokeDasharray={`${withLength} ${circumference}`} transform="rotate(-90 80 80)" onClick={() => setUsageCoverageFilter((current) => (current === 'with-skills' ? 'all' : 'with-skills'))} style={{ cursor: 'pointer' }} />
                        <circle cx="80" cy="80" r="54" fill="none" stroke={tokens.colorNeutralStroke1} strokeWidth="20" strokeDasharray={`${withoutLength} ${circumference}`} strokeDashoffset={-withLength} transform="rotate(-90 80 80)" onClick={() => setUsageCoverageFilter((current) => (current === 'without-skills' ? 'all' : 'without-skills'))} style={{ cursor: 'pointer' }} />
                      </>); })() : null}
                      <text x="80" y="75" textAnchor="middle" fontSize="20" fill={tokens.colorNeutralForeground1} fontWeight={600}>{visibleSites.length}</text>
                      <text x="80" y="96" textAnchor="middle" fontSize="11" fill={tokens.colorNeutralForeground3}>sites</text>
                    </svg>
                    <Caption1 className={styles.donutCaption}>Click a segment to filter sites with or without skills.</Caption1>
                    <div className={styles.donutLegend}>
                      <button type="button" className={styles.donutButton} onClick={() => setUsageCoverageFilter((current) => (current === 'with-skills' ? 'all' : 'with-skills'))}><span className={styles.legendLeft}><span className={`${styles.legendSwatch} ${styles.legendGreen}`} /><span><Text weight="semibold">Sites with skills</Text><Caption1>{visibleSitesWithSkills}</Caption1></span></span><Caption1>{visibleSites.length ? `${Math.round((visibleSitesWithSkills / visibleSites.length) * 100)}%` : '0%'}</Caption1></button>
                      <button type="button" className={styles.donutButton} onClick={() => setUsageCoverageFilter((current) => (current === 'without-skills' ? 'all' : 'without-skills'))}><span className={styles.legendLeft}><span className={`${styles.legendSwatch} ${styles.legendGray}`} /><span><Text weight="semibold">Sites without skills</Text><Caption1>{visibleSitesWithoutSkills}</Caption1></span></span><Caption1>{visibleSites.length ? `${Math.round((visibleSitesWithoutSkills / visibleSites.length) * 100)}%` : '0%'}</Caption1></button>
                    </div>
                  </div>
                </Card>

                <Card className={`${styles.chartCard} ${styles.chartWide}`}>
                  <CardHeader header={<Text weight="semibold">Skills per site</Text>} description={<Caption1>Sites are sorted by visible skill count, highest first.</Caption1>} />
                  <div className={styles.chartList}>
                    {sortedUsageSites.length ? sortedUsageSites.map((site) => {
                      const count = siteCountById.get(site.id) || 0;
                      const maxCount = Math.max(...Array.from(siteCountById.values()), 1);
                      return (
                        <button key={site.id} type="button" className={styles.chartItem} onClick={() => setUsageSiteFilterId(site.id)}>
                          <div className={styles.chartItemHeader}>
                            <Text weight="semibold">{site.name}</Text>
                            <Caption1>{count} skill{count === 1 ? '' : 's'}</Caption1>
                          </div>
                          {count > 0 ? (
                            <div className={styles.chartTrack}>
                              <div className={styles.chartFill} style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }} />
                            </div>
                          ) : (
                            <Caption1 className={styles.heatmapEmpty}>No skills</Caption1>
                          )}
                        </button>
                      );
                    }) : <Body1 className={styles.chartNote}>No sites match the current filters.</Body1>}
                  </div>
                </Card>

                <Card className={`${styles.chartCard} ${styles.chartWide}`}>
                  <CardHeader header={<Text weight="semibold">Site skill tiles</Text>} description={<Caption1>Responsive tiles replace the old matrix and stay compact as tenant size grows.</Caption1>} />
                  <div className={styles.siteTiles}>
                    {sortedUsageSites.length ? sortedUsageSites.map((site) => {
                      const siteSkills = visibleSkills.filter((skill) => skill.siteIds.indexOf(site.id) !== -1);
                      const badgeLimit = 6;
                      const overflowCount = Math.max(0, siteSkills.length - badgeLimit);
                      return (
                        <button key={site.id} type="button" className={styles.siteTile} onClick={() => setUsageSiteFilterId(site.id)}>
                          <div className={styles.siteTileHeader}>
                            <div className={styles.siteTileMeta}>
                              <Text weight="semibold">{site.name}</Text>
                              <Caption1>{site.siteCollectionName || 'Site collection unavailable'}</Caption1>
                              <Caption1 className={styles.siteTileUrl}>{(site.webUrl || site.url || '').replace(/^https?:\/\/[^/]*?\.sharepoint\.com/i, '') || (site.webUrl || site.url || '')}</Caption1>
                            </div>
                            <Badge appearance="outline" className={styles.siteSkillCount}>{siteSkills.length}</Badge>
                          </div>
                          <div className={styles.siteSkillRow}>
                            {siteSkills.slice(0, badgeLimit).map((skill) => (
                              <Badge key={skill.id} appearance="outline" onClick={(event: React.MouseEvent) => { event.stopPropagation(); setUsageSkillFilterId(skill.id); setUsageSiteFilterId(site.id); }}>
                                {skill.name}
                              </Badge>
                            ))}
                            {overflowCount > 0 ? <Caption1 className={styles.siteSkillMore}>+{overflowCount} more</Caption1> : null}
                          </div>
                        </button>
                      );
                    }) : <Body1 className={styles.chartNote}>No sites or skills match the current filters.</Body1>}
                  </div>
                </Card>

                <Card className={`${styles.chartCard} ${styles.chartWide} ${styles.tableCard}`}>
                  <CardHeader header={<Text weight="semibold">Sites</Text>} description={<Caption1>Search, sort, filter, and expand to inspect the skills on each site.</Caption1>} />
                  <SitesTable sites={usagePageSites} skills={visibleSkills} selectedSiteId={usageSiteFilterId} onSelectSite={setUsageSiteFilterId} sortField={usageSortField} sortDirection={usageSortDirection} onSortChange={handleUsageSortChange} />
                  <div className={styles.paginationBar}><Body1>Page {safeUsagePage} of {usagePageCount}</Body1><div className={styles.toolbarActions}><Button appearance="secondary" disabled={safeUsagePage <= 1} onClick={() => setUsagePage((page) => Math.max(1, page - 1))}>Previous</Button><Button appearance="secondary" disabled={safeUsagePage >= usagePageCount} onClick={() => setUsagePage((page) => Math.min(usagePageCount, page + 1))}>Next</Button></div></div>
                </Card>
              </div>
            </Card>
          </div>
        )}
      </FluentProvider>
    </IdPrefixProvider>
  );
}
