import * as React from 'react';

import {
  Badge,
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Checkbox,
  Field,
  FluentProvider,
  IdPrefixProvider,
  Input,
  mergeClasses,
  Tab,
  TabList,
  Text,
  makeStyles,
  tokens,
  webDarkTheme,
  webLightTheme
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowTrending24Regular,
  CheckmarkCircle24Regular,
  ChevronDown16Regular,
  ChevronDown24Regular,
  ChevronRight24Regular,
  ChevronUp16Regular,
  Dismiss12Regular,
  Dismiss24Regular,
  Globe24Regular,
  Settings24Regular,
  Sparkle24Regular,
  Warning24Regular
} from '@fluentui/react-icons';
import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';

import type { SharePointSite, SiteCollection, Skill } from '../../models';
import CreateSkillForm from '../CreateSkillForm';
import SkillDetailsPanel from './SkillDetailsPanel';
import SitesTable from './SitesTable';
import SkillsTable from './SkillsTable';

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM, padding: tokens.spacingHorizontalM },
  header: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
  headerRow: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalM },
  headerIconTile: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0
  },
  headerText: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  headerSubtitle: { color: tokens.colorNeutralForeground3 },
  toolbar: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center', justifyContent: 'space-between' },
  toolbarActions: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'center' },
  searchBar: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalS, alignItems: 'end' },
  searchField: { flex: '1 1 320px', minWidth: '260px' },
  fullWidthBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM },
  slidePanelHidden: {
    transform: 'translateX(100%)',
    pointerEvents: 'none',
    visibility: 'hidden'
  },
  skillBlade: {
    // 'fixed' (not 'absolute') so the blade's height is always bound to the viewport rather
    // than to usageShell's content-driven height, which can be shorter than the viewport and
    // would otherwise let tall content (many sites) overflow the page without ever showing
    // a scrollbar.
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: 'clamp(760px, 56%, 100%)',
    maxWidth: '100%',
    maxHeight: '100vh',
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    boxShadow: tokens.shadow16,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    transform: 'translateX(0)',
    transition: 'transform 200ms ease'
  },
  usageShell: { position: 'relative', display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  usageBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  usageTopBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, alignItems: 'start' },
  usageFilterChips: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, alignItems: 'center' },
  filterChip: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXXS },
  filterChipDismiss: {
    display: 'inline-flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginLeft: tokens.spacingHorizontalXXS,
    // Badge renders a decorative absolutely-positioned ::after overlay for its border; without a
    // higher stacking order this icon would sit underneath it and never receive pointer clicks.
    position: 'relative',
    zIndex: 1
  },
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
    borderBottomLeftRadius: tokens.borderRadiusLarge,
    transform: 'translateX(0)',
    transition: 'transform 200ms ease'
  },
  usagePanelBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
  usagePanelBodyNoScroll: { maxHeight: 'none', overflowY: 'visible' },
  createPanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 'min(580px, 92vw)',
    zIndex: 5,
    boxShadow: tokens.shadow16,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    borderTopLeftRadius: tokens.borderRadiusLarge,
    borderBottomLeftRadius: tokens.borderRadiusLarge,
    transform: 'translateX(0)',
    transition: 'transform 200ms ease'
  },
  createPanelBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    paddingBottom: tokens.spacingVerticalS
  },
  searchPanel: { position: 'absolute', right: 0, top: 0, width: 'min(420px, 92vw)', zIndex: 5, boxShadow: tokens.shadow16, borderLeft: `1px solid ${tokens.colorNeutralStroke2}`, borderTopLeftRadius: tokens.borderRadiusLarge, borderBottomLeftRadius: tokens.borderRadiusLarge, transform: 'translateX(0)', transition: 'transform 200ms ease' },
  searchPanelBody: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
  filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: tokens.spacingHorizontalS, alignItems: 'end' },
  filterField: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  filterPanel: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  filterPanelHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: tokens.spacingHorizontalS },
  filterPanelTitle: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS },
  filterPanelClose: { alignSelf: 'flex-end' },
  cardOrderRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: tokens.spacingHorizontalS },
  cardOrderActions: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalXXS },
  select: { minHeight: '32px', borderRadius: tokens.borderRadiusMedium, border: `1px solid ${tokens.colorNeutralStroke2}`, backgroundColor: tokens.colorNeutralBackground1, color: tokens.colorNeutralForeground1, padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`, font: 'inherit' },
  filterSummary: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalXS, alignItems: 'center' },
  compactStatCard: { display: 'inline-flex', flexDirection: 'column', gap: tokens.spacingVerticalXXS, minHeight: '92px', width: 'fit-content', minWidth: '180px', padding: tokens.spacingVerticalM },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: tokens.spacingHorizontalM },
  kpiCard: { minHeight: '104px', boxShadow: tokens.shadow2 },
  kpiHeaderRow: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalXXS },
  kpiIconTile: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    borderRadius: tokens.borderRadiusCircular,
    flexShrink: 0
  },
  chartGrid: { display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: tokens.spacingHorizontalS, alignItems: 'stretch', overflowX: 'auto' },
  chartCard: { flex: '1 1 0', minWidth: '340px', minHeight: '100%', overflowY: 'visible' },
  chartList: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS },
  chartItem: {
    border: 'none',
    borderRadius: tokens.borderRadiusMedium,
    background: 'transparent',
    padding: tokens.spacingVerticalXS,
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
    ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover },
    ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '2px' }
  },
  chartItemHeader: { display: 'flex', justifyContent: 'space-between', gap: tokens.spacingHorizontalS, alignItems: 'baseline' },
  chartTrack: { height: '10px', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorNeutralBackground3, overflow: 'hidden' },
  chartFill: { height: '100%', borderRadius: tokens.borderRadiusCircular, backgroundColor: tokens.colorBrandBackground },
  chartNote: { color: tokens.colorNeutralForeground3 },
  donutLayout: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS, alignItems: 'center' },
  donutSvg: { width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' },
  donutCaption: { textAlign: 'center', color: tokens.colorNeutralForeground3 },
  donutLegend: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  donutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    width: '100%',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    cursor: 'pointer',
    ':hover': { backgroundColor: tokens.colorSubtleBackgroundHover },
    ':focus-visible': { outline: `2px solid ${tokens.colorStrokeFocus2}`, outlineOffset: '2px' }
  },
  legendLeft: { display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS },
  legendSwatch: { width: '12px', height: '12px', borderRadius: tokens.borderRadiusCircular, flexShrink: 0 },
  legendGreen: { backgroundColor: tokens.colorPaletteGreenForeground1 },
  legendGray: { backgroundColor: tokens.colorNeutralStroke1 },
  distributionList: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  distributionRow: { display: 'grid', gridTemplateColumns: 'minmax(76px, auto) 1fr minmax(96px, auto)', gap: tokens.spacingHorizontalS, alignItems: 'center' },
  distributionTrack: { position: 'relative', height: '14px', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorNeutralBackground3, overflow: 'hidden' },
  distributionFill: { height: '100%', borderRadius: tokens.borderRadiusMedium, backgroundColor: tokens.colorBrandBackground },
  distributionTrackLabel: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  distributionTrackLabelText: {
    // The track's fill can be either colorBrandBackground (saturated) or colorNeutralBackground3
    // (near-white) depending on the percentage, so the label needs its own solid backdrop rather
    // than a single fixed foreground color — colorNeutralForeground1 alone drops to ~2.9:1 against
    // colorBrandBackground in light theme.
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusSmall,
    padding: `0 ${tokens.spacingHorizontalXS}`,
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1
  },
  distributionMeta: { display: 'flex', justifyContent: 'flex-end', gap: tokens.spacingHorizontalXS, whiteSpace: 'nowrap' },
  usageViewport: { paddingRight: tokens.spacingHorizontalXXS, overflowX: 'auto', overflowY: 'hidden' },
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

export type DashboardTab = 'all-skills' | 'usage';
type UsageSortField = 'site' | 'url' | 'collection' | 'skills';
type UsageSortDirection = 'ascending' | 'descending';
type CoverageFilter = 'all' | 'with-skills' | 'without-skills';

export interface ISkillsFactoryDashboardProps {
  hostContext: ICopilotComponentHostContext;
  targetDocument?: Document;
  currentUserName: string;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  siteSearchText: string;
  onSiteSearchTextChange: (value: string) => void;
  allSkills: Skill[];
  usageSkills: Skill[];
  siteCollections: SiteCollection[];
  sites: SharePointSite[];
  selectedSkill?: Skill;
  selectedSite?: SharePointSite;
  onSelectSkill: (skillId: string) => void;
  onSelectSite: (siteId: string) => void;
  onCreateSkill: (request: { siteUrl: string; skillName: string; skillContent: string; onProgress?: (message: string) => void }) => Promise<{ normalizedSkillName: string; skillFolderUrl: string; skillMarkdownUrl: string }>;
  onDeleteSkillSite: (site: SharePointSite, skillFolderUrl: string) => Promise<void>;
  onActivateAgentAssetsFeature: (siteUrl: string) => Promise<void>;
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

type UsageCardKey = 'skills-adoption' | 'sites-with-vs-without' | 'skill-distribution' | 'sites';

interface IUsageCardDefinition {
  key: UsageCardKey;
  label: string;
}

const USAGE_CARD_DEFINITIONS: IUsageCardDefinition[] = [
  { key: 'skills-adoption', label: 'Skills ranked by site adoption' },
  { key: 'sites-with-vs-without', label: 'Sites with vs. without skills' },
  { key: 'skill-distribution', label: 'Skill distribution' },
  { key: 'sites', label: 'Sites' }
];

const DEFAULT_USAGE_CARD_ORDER: UsageCardKey[] = USAGE_CARD_DEFINITIONS.map((definition) => definition.key);

const DEFAULT_USAGE_CARD_VISIBILITY: Record<UsageCardKey, boolean> = {
  'skills-adoption': true,
  'sites-with-vs-without': true,
  'skill-distribution': true,
  sites: true
};

type KpiAccent = 'brand' | 'success' | 'warning';

const KPI_ACCENT_STYLES: Record<KpiAccent, { background: string; foreground: string; border: string }> = {
  brand: { background: tokens.colorBrandBackground2, foreground: tokens.colorBrandForeground1, border: tokens.colorBrandStroke1 },
  success: { background: tokens.colorStatusSuccessBackground1, foreground: tokens.colorStatusSuccessForeground1, border: tokens.colorStatusSuccessBorder1 },
  warning: { background: tokens.colorStatusWarningBackground1, foreground: tokens.colorStatusWarningForeground1, border: tokens.colorStatusWarningBorder1 }
};

export default function SkillsFactoryDashboard(props: ISkillsFactoryDashboardProps): React.ReactElement {
  const styles = useStyles();
  const [usagePage, setUsagePage] = React.useState<number>(1);
  const [usageSortField, setUsageSortField] = React.useState<UsageSortField>('site');
  const [usageSortDirection, setUsageSortDirection] = React.useState<UsageSortDirection>('ascending');
  const [usageSkillFilterId, setUsageSkillFilterId] = React.useState<string | undefined>();
  const [usageSiteFilterId, setUsageSiteFilterId] = React.useState<string | undefined>();
  const [usageCoverageFilter, setUsageCoverageFilter] = React.useState<CoverageFilter>('all');
  const [usageFiltersOpen, setUsageFiltersOpen] = React.useState<boolean>(false);
  const [usageSettingsOpen, setUsageSettingsOpen] = React.useState<boolean>(false);
  const [skillsSearchOpen, setSkillsSearchOpen] = React.useState<boolean>(false);
  const [createSkillOpen, setCreateSkillOpen] = React.useState<boolean>(false);
  const [createSkillSubmitting, setCreateSkillSubmitting] = React.useState<boolean>(false);
  const [mySkillsOnly, setMySkillsOnly] = React.useState<boolean>(false);
  const [usageCardOrder, setUsageCardOrder] = React.useState<UsageCardKey[]>(DEFAULT_USAGE_CARD_ORDER);
  const [usageCardVisibility, setUsageCardVisibility] = React.useState<Record<UsageCardKey, boolean>>(DEFAULT_USAGE_CARD_VISIBILITY);

  const moveUsageCard = React.useCallback((key: UsageCardKey, direction: -1 | 1): void => {
    setUsageCardOrder((current) => {
      const index = current.indexOf(key);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= current.length) {
        return current;
      }
      const next = current.slice();
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  const setUsageCardVisible = React.useCallback((key: UsageCardKey, visible: boolean): void => {
    setUsageCardVisibility((current) => ({ ...current, [key]: visible }));
  }, []);

  const theme = props.hostContext.theme === 'dark' ? webDarkTheme : webLightTheme;
  const siteSkillMap = React.useMemo(() => buildSiteSkillMap(props.sites, props.usageSkills), [props.sites, props.usageSkills]);

  const filteredAllSkills = React.useMemo(() => {
    const needle = props.searchText.trim().toLowerCase();
    return props.allSkills.filter((skill) => {
      const matchesSearch = !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1;
      const matchesOwner = !mySkillsOnly || skill.isOwnedByCurrentUser;
      return matchesSearch && matchesOwner;
    });
  }, [mySkillsOnly, props.allSkills, props.searchText]);

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

  const skillDistributionBuckets = React.useMemo(() => {
    const buckets = [
      { label: '0 skills', count: 0 },
      { label: '1 skill', count: 0 },
      { label: '2 skills', count: 0 },
      { label: '3+ skills', count: 0 }
    ];
    for (const site of visibleSites) {
      const skillCount = siteCountById.get(site.id) || 0;
      buckets[Math.min(skillCount, 3)].count += 1;
    }
    return buckets;
  }, [siteCountById, visibleSites]);

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

  const themeForHost = theme;

  return (
    <IdPrefixProvider value="sharepoint-skills-factory-">
      <FluentProvider theme={themeForHost} targetDocument={props.targetDocument} className={styles.root}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <span className={styles.headerIconTile} aria-hidden="true">
              <Sparkle24Regular />
            </span>
            <div className={styles.headerText}>
              <Text size={600} weight="semibold">Awesome SharePoint Skills Factory</Text>
              <Body1 className={styles.headerSubtitle}>Create. Discover. Understand.</Body1>
            </div>
          </div>
        </div>

        <div className={styles.toolbar}>
          <TabList selectedValue={props.activeTab} onTabSelect={(_, data) => props.onTabChange(data.value as DashboardTab)}>
            <Tab value="all-skills">All Skills</Tab>
            <Tab value="usage">Usage</Tab>
          </TabList>
        </div>

        {props.activeTab === 'all-skills' && (
          <div className={styles.usageShell}>
            <div className={styles.usageTopBar}>
              <div className={styles.usageFilterChips}>
                {mySkillsOnly ? (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Owner: You
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear owner filter"
                      role="button"
                      tabIndex={0}
                      onClick={() => setMySkillsOnly(false)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setMySkillsOnly(false); } }}
                    />
                  </Badge>
                ) : null}
                {props.searchText.trim() ? (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Search: {props.searchText.trim()}
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear search"
                      role="button"
                      tabIndex={0}
                      onClick={() => props.onSearchTextChange('')}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); props.onSearchTextChange(''); } }}
                    />
                  </Badge>
                ) : null}
              </div>
              <div className={styles.toolbarActions}>
                <Button appearance="secondary" icon={skillsSearchOpen ? <ChevronRight24Regular /> : <ChevronDown24Regular />} onClick={() => setSkillsSearchOpen((current) => !current)}>
                  {skillsSearchOpen ? 'Close search' : 'Open search'}
                </Button>
              </div>
            </div>
            <Card className={mergeClasses(styles.searchPanel, !skillsSearchOpen && styles.slidePanelHidden)}>
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
                <Field className={styles.filterField} label="Ownership">
                  <Checkbox
                    checked={mySkillsOnly}
                    onChange={(_, data) => setMySkillsOnly(Boolean(data.checked))}
                    label="Only my skills"
                  />
                  <Caption1>Show skills owned by the current user.</Caption1>
                </Field>
              </div>
            </Card>

            <div className={styles.fullWidthBody}>
              <SkillsTable skills={filteredAllSkills} selectedSkillId={props.selectedSkill?.id} onSelectSkill={props.onSelectSkill} currentUserName={props.currentUserName} />
            </div>

            <div className={mergeClasses(styles.skillBlade, !props.selectedSkill && styles.slidePanelHidden)}>
              <SkillDetailsPanel
                skill={props.selectedSkill}
                sites={props.sites}
                siteCollections={props.siteCollections}
                onClose={() => { if (props.selectedSkill) props.onSelectSkill(props.selectedSkill.id); }}
                onDeleteSkillSite={props.onDeleteSkillSite}
                onCreateSkill={props.onCreateSkill}
                onActivateAgentAssetsFeature={props.onActivateAgentAssetsFeature}
              />
            </div>
          </div>
        )}

        {props.activeTab === 'usage' && (
          <div className={styles.usageShell}>
            <div className={styles.usageTopBar}>
              <div className={styles.usageFilterChips}>
                {usageSkillFilterId && (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Skill: {props.usageSkills.find((skill) => skill.id === usageSkillFilterId)?.name}
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear skill filter"
                      role="button"
                      tabIndex={0}
                      onClick={() => setUsageSkillFilterId(undefined)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setUsageSkillFilterId(undefined); } }}
                    />
                  </Badge>
                )}
                {usageSiteFilterId && (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Site: {props.sites.find((site) => site.id === usageSiteFilterId)?.name}
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear site filter"
                      role="button"
                      tabIndex={0}
                      onClick={() => setUsageSiteFilterId(undefined)}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setUsageSiteFilterId(undefined); } }}
                    />
                  </Badge>
                )}
                {usageCoverageFilter !== 'all' && (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Coverage: {usageCoverageFilter === 'with-skills' ? 'with skills' : 'without skills'}
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear coverage filter"
                      role="button"
                      tabIndex={0}
                      onClick={() => setUsageCoverageFilter('all')}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setUsageCoverageFilter('all'); } }}
                    />
                  </Badge>
                )}
                {props.siteSearchText.trim() && (
                  <Badge appearance="outline" className={styles.filterChip}>
                    Search: {props.siteSearchText.trim()}
                    <Dismiss12Regular
                      className={styles.filterChipDismiss}
                      aria-label="Clear search"
                      role="button"
                      tabIndex={0}
                      onClick={() => props.onSiteSearchTextChange('')}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); props.onSiteSearchTextChange(''); } }}
                    />
                  </Badge>
                )}
              </div>
              <div className={styles.toolbarActions}>
                <Button
                  appearance="secondary"
                  icon={<Add24Regular />}
                  onClick={() => {
                    setUsageFiltersOpen(false);
                    setUsageSettingsOpen(false);
                    setCreateSkillOpen((current) => !current);
                  }}
                >
                  {createSkillOpen ? 'Close create skill' : 'Create Skill'}
                </Button>
                <Button
                  appearance="secondary"
                  icon={usageFiltersOpen ? <ChevronRight24Regular /> : <ChevronDown24Regular />}
                  onClick={() => {
                    setCreateSkillOpen(false);
                    setUsageSettingsOpen(false);
                    setUsageFiltersOpen((current) => !current);
                  }}
                >
                  {usageFiltersOpen ? 'Close filters' : 'Open filters'}
                </Button>
                <Button
                  appearance="secondary"
                  icon={<Settings24Regular />}
                  onClick={() => {
                    setCreateSkillOpen(false);
                    setUsageFiltersOpen(false);
                    setUsageSettingsOpen((current) => !current);
                  }}
                >
                  {usageSettingsOpen ? 'Close settings' : 'Settings'}
                </Button>
              </div>
            </div>

            <Card className={mergeClasses(styles.usagePanel, !usageFiltersOpen && styles.slidePanelHidden)}>
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

            <Card className={mergeClasses(styles.usagePanel, !usageSettingsOpen && styles.slidePanelHidden)}>
              <div className={mergeClasses(styles.usagePanelBody, styles.usagePanelBodyNoScroll)}>
                <div className={styles.filterPanelHeader}>
                  <div className={styles.filterPanelTitle}>
                    <Text weight="semibold">Full-width view settings</Text>
                    <Caption1>Toggle and reorder the cards shown in the Usage dashboard.</Caption1>
                  </div>
                  <Button className={styles.filterPanelClose} appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close settings" onClick={() => setUsageSettingsOpen(false)} />
                </div>
                <div className={styles.filterPanel}>
                  {usageCardOrder.map((key, index) => {
                    const definition = USAGE_CARD_DEFINITIONS.find((candidate) => candidate.key === key);
                    const label = definition ? definition.label : key;
                    return (
                      <div key={key} className={styles.cardOrderRow}>
                        <Checkbox checked={usageCardVisibility[key]} onChange={(_, data) => setUsageCardVisible(key, Boolean(data.checked))} label={label} />
                        <div className={styles.cardOrderActions}>
                          <Button
                            appearance="subtle"
                            size="small"
                            icon={<ChevronUp16Regular />}
                            aria-label={`Move ${label} up`}
                            disabled={index === 0}
                            onClick={() => moveUsageCard(key, -1)}
                          />
                          <Button
                            appearance="subtle"
                            size="small"
                            icon={<ChevronDown16Regular />}
                            aria-label={`Move ${label} down`}
                            disabled={index === usageCardOrder.length - 1}
                            onClick={() => moveUsageCard(key, 1)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card className={mergeClasses(styles.createPanel, !createSkillOpen && styles.slidePanelHidden)}>
                <div className={styles.createPanelBody}>
                  <div className={styles.filterPanelHeader}>
                    <div className={styles.filterPanelTitle}>
                      <Text weight="semibold">Create Skill</Text>
                      <Caption1>Create a new skill folder and SKILL.md in a selected site.</Caption1>
                    </div>
                    <Button className={styles.filterPanelClose} appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close create skill" disabled={createSkillSubmitting} onClick={() => setCreateSkillOpen(false)} />
                  </div>
                  <CreateSkillForm
                    sites={props.sites}
                    onCreateSkill={props.onCreateSkill}
                    onActivateAgentAssetsFeature={props.onActivateAgentAssetsFeature}
                    onCreated={() => setCreateSkillOpen(false)}
                    onSubmittingChange={setCreateSkillSubmitting}
                  />
                </div>
              </Card>

            <div className={styles.kpiGrid}>
              {[
                { key: 'total-sites', label: 'Total Sites', value: visibleSites.length, hint: 'Sites in the current view', accent: 'brand' as KpiAccent, icon: <Globe24Regular /> },
                { key: 'total-skills', label: 'Total Skills', value: visibleSkills.length, hint: 'Skills used by those sites', accent: 'brand' as KpiAccent, icon: <Sparkle24Regular /> },
                { key: 'sites-with-skills', label: 'Sites with Skills', value: visibleSitesWithSkills, hint: 'Sites showing at least one skill', accent: 'success' as KpiAccent, icon: <CheckmarkCircle24Regular /> },
                { key: 'sites-without-skills', label: 'Sites without Skills', value: visibleSitesWithoutSkills, hint: 'Coverage gaps in the current view', accent: 'warning' as KpiAccent, icon: <Warning24Regular /> },
                { key: 'average-skills', label: 'Average Skills / Site', value: visibleAverageSkillsPerSite.toFixed(1), hint: 'Mean skills per visible site', accent: 'brand' as KpiAccent, icon: <ArrowTrending24Regular /> }
              ].map((kpi) => {
                const accentStyle = KPI_ACCENT_STYLES[kpi.accent];
                return (
                  <Card key={kpi.key} className={styles.kpiCard} style={{ borderLeft: `3px solid ${accentStyle.border}` }}>
                    <div className={styles.kpiHeaderRow}>
                      <span className={styles.kpiIconTile} style={{ backgroundColor: accentStyle.background, color: accentStyle.foreground }} aria-hidden="true">
                        {kpi.icon}
                      </span>
                      <Text weight="semibold">{kpi.label}</Text>
                    </div>
                    <Text size={800} weight="semibold" style={{ color: accentStyle.foreground }}>{kpi.value}</Text>
                    <Caption1>{kpi.hint}</Caption1>
                  </Card>
                );
              })}
            </div>

            <div className={styles.chartGrid}>
              {usageCardOrder.map((cardKey) => {
                if (!usageCardVisibility[cardKey]) {
                  return null;
                }

                switch (cardKey) {
                  case 'skills-adoption':
                    return (
                      <Card key={cardKey} className={styles.chartCard}>
                        <CardHeader header={<Text weight="semibold">Skills ranked by site adoption</Text>} description={<Caption1>Horizontal bars show how many visible sites use each skill.</Caption1>} />
                        <div className={styles.chartList}>
                          {sortedUsageSkills.length ? sortedUsageSkills.map((skill) => {
                            const count = skillCountById.get(skill.id) || 0;
                            const maxCount = Math.max(...Array.from(skillCountById.values()), 1);
                            return <button key={skill.id} type="button" className={styles.chartItem} onClick={() => setUsageSkillFilterId(skill.id)}><div className={styles.chartItemHeader}><Text weight="semibold">{skill.name}</Text><Caption1>{count} site{count === 1 ? '' : 's'}</Caption1></div><div className={styles.chartTrack}><div className={styles.chartFill} style={{ width: `${Math.max(4, (count / maxCount) * 100)}%` }} /></div></button>;
                          }) : <Body1 className={styles.chartNote}>No skills match the current filters.</Body1>}
                        </div>
                      </Card>
                    );

                  case 'sites-with-vs-without':
                    return (
                      <Card key={cardKey} className={styles.chartCard}>
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
                            <button type="button" className={styles.donutButton} onClick={() => setUsageCoverageFilter((current) => (current === 'with-skills' ? 'all' : 'with-skills'))}><span className={styles.legendLeft}><span className={mergeClasses(styles.legendSwatch, styles.legendGreen)} /><span><Text weight="semibold">Sites with skills</Text></span></span><Caption1>{visibleSites.length ? `${Math.round((visibleSitesWithSkills / visibleSites.length) * 100)}%` : '0%'}</Caption1></button>
                            <button type="button" className={styles.donutButton} onClick={() => setUsageCoverageFilter((current) => (current === 'without-skills' ? 'all' : 'without-skills'))}><span className={styles.legendLeft}><span className={mergeClasses(styles.legendSwatch, styles.legendGray)} /><span><Text weight="semibold">Sites without skills</Text></span></span><Caption1>{visibleSites.length ? `${Math.round((visibleSitesWithoutSkills / visibleSites.length) * 100)}%` : '0%'}</Caption1></button>
                          </div>
                        </div>
                      </Card>
                    );

                  case 'skill-distribution':
                    return (
                      <Card key={cardKey} className={styles.chartCard}>
                        <CardHeader header={<Text weight="semibold">Skill distribution</Text>} description={<Caption1>How many skills each visible site has, grouped into bands.</Caption1>} />
                        <div className={styles.distributionList}>
                          {skillDistributionBuckets.map((bucket) => {
                            const percentage = visibleSites.length ? Math.round((bucket.count / visibleSites.length) * 100) : 0;
                            return (
                              <div key={bucket.label} className={styles.distributionRow}>
                                <Text weight="semibold">{bucket.label}</Text>
                                <div className={styles.distributionTrack}>
                                  <div className={styles.distributionFill} style={{ width: bucket.count > 0 ? `${Math.max(4, percentage)}%` : '0%' }} />
                                  <div className={styles.distributionTrackLabel}>
                                    <span className={styles.distributionTrackLabelText}>{percentage}%</span>
                                  </div>
                                </div>
                                <div className={styles.distributionMeta}>
                                  <Text weight="semibold">{bucket.count}</Text>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    );

                  case 'sites':
                    return (
                      <Card key={cardKey} className={mergeClasses(styles.chartCard, styles.tableCard)}>
                        <CardHeader header={<Text weight="semibold">Sites</Text>} description={<Caption1>Search, filter, and select a site to inspect its skills.</Caption1>} />
                        <div className={styles.usageViewport}>
                          <SitesTable sites={usagePageSites} skills={visibleSkills} selectedSiteId={usageSiteFilterId} onSelectSite={setUsageSiteFilterId} sortField={usageSortField} sortDirection={usageSortDirection} onSortChange={handleUsageSortChange} />
                        </div>
                        <div className={styles.paginationBar}><Body1>Page {safeUsagePage} of {usagePageCount}</Body1><div className={styles.toolbarActions}><Button appearance="secondary" disabled={safeUsagePage <= 1} onClick={() => setUsagePage((page) => Math.max(1, page - 1))}>Previous</Button><Button appearance="secondary" disabled={safeUsagePage >= usagePageCount} onClick={() => setUsagePage((page) => Math.min(usagePageCount, page + 1))}>Next</Button></div></div>
                      </Card>
                    );

                  default:
                    return null;
                }
              })}
            </div>
          </div>
        )}
      </FluentProvider>
    </IdPrefixProvider>
  );
}
