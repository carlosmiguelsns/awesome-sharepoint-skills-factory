"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillsFactoryDashboard;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var CreateSkillForm_1 = tslib_1.__importDefault(require("../CreateSkillForm"));
var SkillDetailsPanel_1 = tslib_1.__importDefault(require("./SkillDetailsPanel"));
var SitesTable_1 = tslib_1.__importDefault(require("./SitesTable"));
var SkillsTable_1 = tslib_1.__importDefault(require("./SkillsTable"));
var useStyles = (0, react_components_1.makeStyles)({
    root: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalM, padding: react_components_1.tokens.spacingHorizontalM },
    header: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalXS },
    toolbar: { display: 'flex', flexWrap: 'wrap', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'center', justifyContent: 'space-between' },
    toolbarActions: { display: 'flex', flexWrap: 'wrap', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'center' },
    searchBar: { display: 'flex', flexWrap: 'wrap', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'end' },
    searchField: { flex: '1 1 320px', minWidth: '260px' },
    fullWidthBody: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalM },
    slidePanelHidden: {
        transform: 'translateX(100%)',
        pointerEvents: 'none',
        visibility: 'hidden'
    },
    skillBlade: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'clamp(760px, 56%, 100%)',
        maxWidth: '100%',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxShadow: react_components_1.tokens.shadow16,
        borderLeft: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        transform: 'translateX(0)',
        transition: 'transform 200ms ease'
    },
    usageShell: { position: 'relative', display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    usageBody: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    usageTopBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'start' },
    usageFilterChips: { display: 'flex', flexWrap: 'wrap', gap: react_components_1.tokens.spacingHorizontalXS, alignItems: 'center' },
    filterChip: { display: 'inline-flex', alignItems: 'center', gap: react_components_1.tokens.spacingHorizontalXXS },
    filterChipDismiss: {
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        marginLeft: react_components_1.tokens.spacingHorizontalXXS,
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
        boxShadow: react_components_1.tokens.shadow16,
        borderLeft: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderTopLeftRadius: react_components_1.tokens.borderRadiusLarge,
        borderBottomLeftRadius: react_components_1.tokens.borderRadiusLarge,
        transform: 'translateX(0)',
        transition: 'transform 200ms ease'
    },
    usagePanelBody: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
    usagePanelBodyNoScroll: { maxHeight: 'none', overflowY: 'visible' },
    createPanel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 'min(580px, 92vw)',
        zIndex: 5,
        boxShadow: react_components_1.tokens.shadow16,
        borderLeft: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderTopLeftRadius: react_components_1.tokens.borderRadiusLarge,
        borderBottomLeftRadius: react_components_1.tokens.borderRadiusLarge,
        transform: 'translateX(0)',
        transition: 'transform 200ms ease'
    },
    createPanelBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS,
        paddingBottom: react_components_1.tokens.spacingVerticalS
    },
    searchPanel: { position: 'absolute', right: 0, top: 0, width: 'min(420px, 92vw)', zIndex: 5, boxShadow: react_components_1.tokens.shadow16, borderLeft: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), borderTopLeftRadius: react_components_1.tokens.borderRadiusLarge, borderBottomLeftRadius: react_components_1.tokens.borderRadiusLarge, transform: 'translateX(0)', transition: 'transform 200ms ease' },
    searchPanelBody: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
    filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'end' },
    filterField: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalXXS },
    filterPanel: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    filterPanelHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS },
    filterPanelTitle: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalXXS },
    filterPanelClose: { alignSelf: 'flex-end' },
    cardOrderRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS },
    cardOrderActions: { display: 'flex', alignItems: 'center', gap: react_components_1.tokens.spacingHorizontalXXS },
    select: { minHeight: '32px', borderRadius: react_components_1.tokens.borderRadiusMedium, border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), backgroundColor: react_components_1.tokens.colorNeutralBackground1, color: react_components_1.tokens.colorNeutralForeground1, padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS), font: 'inherit' },
    filterSummary: { display: 'flex', flexWrap: 'wrap', gap: react_components_1.tokens.spacingHorizontalXS, alignItems: 'center' },
    compactStatCard: { display: 'inline-flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalXXS, minHeight: '92px', width: 'fit-content', minWidth: '180px', padding: react_components_1.tokens.spacingVerticalM },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: react_components_1.tokens.spacingHorizontalM },
    kpiCard: { minHeight: '104px' },
    chartGrid: { display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'stretch', overflowX: 'auto' },
    chartCard: { flex: '1 1 0', minWidth: '340px', minHeight: '100%', overflowY: 'visible' },
    chartList: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    chartItem: { border: 'none', background: 'transparent', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalXS },
    chartItemHeader: { display: 'flex', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'baseline' },
    chartTrack: { height: '10px', borderRadius: react_components_1.tokens.borderRadiusCircular, backgroundColor: react_components_1.tokens.colorNeutralBackground3, overflow: 'hidden' },
    chartFill: { height: '100%', borderRadius: react_components_1.tokens.borderRadiusCircular, backgroundColor: react_components_1.tokens.colorBrandBackground },
    chartNote: { color: react_components_1.tokens.colorNeutralForeground3 },
    donutLayout: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS, alignItems: 'center' },
    donutSvg: { width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' },
    donutCaption: { textAlign: 'center', color: react_components_1.tokens.colorNeutralForeground3 },
    donutLegend: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    donutButton: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS, width: '100%', border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), borderRadius: react_components_1.tokens.borderRadiusMedium, backgroundColor: react_components_1.tokens.colorNeutralBackground1, padding: "".concat(react_components_1.tokens.spacingVerticalS, " ").concat(react_components_1.tokens.spacingHorizontalS), cursor: 'pointer' },
    legendLeft: { display: 'flex', alignItems: 'center', gap: react_components_1.tokens.spacingHorizontalS },
    legendSwatch: { width: '12px', height: '12px', borderRadius: react_components_1.tokens.borderRadiusCircular, flexShrink: 0 },
    legendGreen: { backgroundColor: react_components_1.tokens.colorPaletteGreenForeground1 },
    legendGray: { backgroundColor: react_components_1.tokens.colorNeutralStroke1 },
    distributionList: { display: 'flex', flexDirection: 'column', gap: react_components_1.tokens.spacingVerticalS },
    distributionRow: { display: 'grid', gridTemplateColumns: 'minmax(76px, auto) 1fr minmax(96px, auto)', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'center' },
    distributionTrack: { position: 'relative', height: '14px', borderRadius: react_components_1.tokens.borderRadiusMedium, backgroundColor: react_components_1.tokens.colorNeutralBackground3, overflow: 'hidden' },
    distributionFill: { height: '100%', borderRadius: react_components_1.tokens.borderRadiusMedium, backgroundColor: react_components_1.tokens.colorBrandBackground },
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
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        borderRadius: react_components_1.tokens.borderRadiusSmall,
        padding: "0 ".concat(react_components_1.tokens.spacingHorizontalXS),
        fontSize: react_components_1.tokens.fontSizeBase200,
        fontWeight: react_components_1.tokens.fontWeightSemibold,
        color: react_components_1.tokens.colorNeutralForeground1
    },
    distributionMeta: { display: 'flex', justifyContent: 'flex-end', gap: react_components_1.tokens.spacingHorizontalXS, whiteSpace: 'nowrap' },
    usageViewport: { paddingRight: react_components_1.tokens.spacingHorizontalXXS, overflowX: 'auto', overflowY: 'hidden' },
    heatmapScroll: { overflow: 'auto' },
    heatmapTable: { borderCollapse: 'collapse', minWidth: 'max-content', width: '100%' },
    heatmapCorner: { position: 'sticky', top: 0, left: 0, zIndex: 3, backgroundColor: react_components_1.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS), textAlign: 'left', whiteSpace: 'nowrap' },
    heatmapHeader: { position: 'sticky', top: 0, zIndex: 2, backgroundColor: react_components_1.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS), textAlign: 'center', whiteSpace: 'nowrap' },
    heatmapRowHeader: { position: 'sticky', left: 0, zIndex: 1, backgroundColor: react_components_1.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS), textAlign: 'left', whiteSpace: 'nowrap' },
    heatmapCell: { width: '40px', height: '40px', borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), borderRight: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2), padding: 0, textAlign: 'center' },
    heatmapPresent: { backgroundColor: react_components_1.tokens.colorPaletteGreenBackground2 },
    heatmapEmpty: { backgroundColor: react_components_1.tokens.colorNeutralBackground2 },
    heatmapButton: { width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer' },
    heatmapMark: { fontWeight: 700, color: react_components_1.tokens.colorNeutralForeground1 },
    tableCard: { overflow: 'hidden' },
    paginationBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: react_components_1.tokens.spacingHorizontalS, alignItems: 'center', marginTop: react_components_1.tokens.spacingVerticalM }
});
function compareText(left, right) {
    return left.localeCompare(right, undefined, { sensitivity: 'base' });
}
function buildSiteSkillMap(sites, skills) {
    var map = new Map();
    for (var _i = 0, sites_1 = sites; _i < sites_1.length; _i++) {
        var site = sites_1[_i];
        map.set(site.id, new Set());
    }
    for (var _a = 0, skills_1 = skills; _a < skills_1.length; _a++) {
        var skill = skills_1[_a];
        for (var _b = 0, _c = skill.siteIds; _b < _c.length; _b++) {
            var siteId = _c[_b];
            var siteSkills = map.get(siteId);
            if (siteSkills)
                siteSkills.add(skill.id);
        }
    }
    return map;
}
var USAGE_CARD_DEFINITIONS = [
    { key: 'skills-adoption', label: 'Skills ranked by site adoption' },
    { key: 'sites-with-vs-without', label: 'Sites with vs. without skills' },
    { key: 'skill-distribution', label: 'Skill distribution' },
    { key: 'sites', label: 'Sites' }
];
var DEFAULT_USAGE_CARD_ORDER = USAGE_CARD_DEFINITIONS.map(function (definition) { return definition.key; });
var DEFAULT_USAGE_CARD_VISIBILITY = {
    'skills-adoption': true,
    'sites-with-vs-without': true,
    'skill-distribution': true,
    sites: true
};
function SkillsFactoryDashboard(props) {
    var _a, _b, _c;
    var styles = useStyles();
    var _d = React.useState(1), usagePage = _d[0], setUsagePage = _d[1];
    var _e = React.useState('site'), usageSortField = _e[0], setUsageSortField = _e[1];
    var _f = React.useState('ascending'), usageSortDirection = _f[0], setUsageSortDirection = _f[1];
    var _g = React.useState(), usageSkillFilterId = _g[0], setUsageSkillFilterId = _g[1];
    var _h = React.useState(), usageSiteFilterId = _h[0], setUsageSiteFilterId = _h[1];
    var _j = React.useState('all'), usageCoverageFilter = _j[0], setUsageCoverageFilter = _j[1];
    var _k = React.useState(false), usageFiltersOpen = _k[0], setUsageFiltersOpen = _k[1];
    var _l = React.useState(false), usageSettingsOpen = _l[0], setUsageSettingsOpen = _l[1];
    var _m = React.useState(false), skillsSearchOpen = _m[0], setSkillsSearchOpen = _m[1];
    var _o = React.useState(false), createSkillOpen = _o[0], setCreateSkillOpen = _o[1];
    var _p = React.useState(false), createSkillSubmitting = _p[0], setCreateSkillSubmitting = _p[1];
    var _q = React.useState(false), mySkillsOnly = _q[0], setMySkillsOnly = _q[1];
    var _r = React.useState(DEFAULT_USAGE_CARD_ORDER), usageCardOrder = _r[0], setUsageCardOrder = _r[1];
    var _s = React.useState(DEFAULT_USAGE_CARD_VISIBILITY), usageCardVisibility = _s[0], setUsageCardVisibility = _s[1];
    var moveUsageCard = React.useCallback(function (key, direction) {
        setUsageCardOrder(function (current) {
            var _a;
            var index = current.indexOf(key);
            var targetIndex = index + direction;
            if (index === -1 || targetIndex < 0 || targetIndex >= current.length) {
                return current;
            }
            var next = current.slice();
            _a = [next[targetIndex], next[index]], next[index] = _a[0], next[targetIndex] = _a[1];
            return next;
        });
    }, []);
    var setUsageCardVisible = React.useCallback(function (key, visible) {
        setUsageCardVisibility(function (current) {
            var _a;
            return (tslib_1.__assign(tslib_1.__assign({}, current), (_a = {}, _a[key] = visible, _a)));
        });
    }, []);
    var theme = props.hostContext.theme === 'dark' ? react_components_1.webDarkTheme : react_components_1.webLightTheme;
    var siteSkillMap = React.useMemo(function () { return buildSiteSkillMap(props.sites, props.usageSkills); }, [props.sites, props.usageSkills]);
    var filteredAllSkills = React.useMemo(function () {
        var needle = props.searchText.trim().toLowerCase();
        return props.allSkills.filter(function (skill) {
            var matchesSearch = !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1;
            var matchesOwner = !mySkillsOnly || skill.isOwnedByCurrentUser;
            return matchesSearch && matchesOwner;
        });
    }, [mySkillsOnly, props.allSkills, props.searchText]);
    var visibleSites = React.useMemo(function () {
        var needle = props.siteSearchText.trim().toLowerCase();
        return props.sites.filter(function (site) {
            var _a, _b;
            if (usageSiteFilterId && site.id !== usageSiteFilterId)
                return false;
            var hasSkills = (((_a = siteSkillMap.get(site.id)) === null || _a === void 0 ? void 0 : _a.size) || 0) > 0;
            if (usageCoverageFilter === 'with-skills' && !hasSkills)
                return false;
            if (usageCoverageFilter === 'without-skills' && hasSkills)
                return false;
            if (usageSkillFilterId && !(((_b = siteSkillMap.get(site.id)) === null || _b === void 0 ? void 0 : _b.has(usageSkillFilterId)) || false))
                return false;
            var haystack = [site.name, site.url, site.webUrl, site.siteCollectionName, site.hostname, site.description].filter(Boolean).join(' ').toLowerCase();
            return !needle || haystack.indexOf(needle) !== -1;
        });
    }, [props.siteSearchText, props.sites, siteSkillMap, usageCoverageFilter, usageSkillFilterId, usageSiteFilterId]);
    var visibleSiteSet = React.useMemo(function () { return new Set(visibleSites.map(function (site) { return site.id; })); }, [visibleSites]);
    var visibleSkills = React.useMemo(function () { return props.usageSkills.filter(function (skill) { return skill.siteIds.some(function (siteId) { return visibleSiteSet.has(siteId); }); }); }, [props.usageSkills, visibleSiteSet]);
    var skillCountById = React.useMemo(function () {
        var counts = new Map();
        for (var _i = 0, visibleSkills_1 = visibleSkills; _i < visibleSkills_1.length; _i++) {
            var skill = visibleSkills_1[_i];
            counts.set(skill.id, skill.siteIds.filter(function (siteId) { return visibleSiteSet.has(siteId); }).length);
        }
        return counts;
    }, [visibleSiteSet, visibleSkills]);
    var siteCountById = React.useMemo(function () {
        var counts = new Map();
        var _loop_1 = function (site) {
            counts.set(site.id, visibleSkills.filter(function (skill) { return skill.siteIds.indexOf(site.id) !== -1; }).length);
        };
        for (var _i = 0, visibleSites_1 = visibleSites; _i < visibleSites_1.length; _i++) {
            var site = visibleSites_1[_i];
            _loop_1(site);
        }
        return counts;
    }, [visibleSites, visibleSkills]);
    var sortedUsageSkills = React.useMemo(function () { return visibleSkills.slice().sort(function (left, right) { return (skillCountById.get(right.id) || 0) - (skillCountById.get(left.id) || 0) || compareText(left.name, right.name); }); }, [skillCountById, visibleSkills]);
    var sortedUsageSites = React.useMemo(function () { return visibleSites.slice().sort(function (left, right) {
        if (usageSortField === 'site')
            return usageSortDirection === 'ascending' ? compareText(left.name, right.name) : compareText(right.name, left.name);
        if (usageSortField === 'url')
            return usageSortDirection === 'ascending' ? compareText(left.webUrl || left.url, right.webUrl || right.url) : compareText(right.webUrl || right.url, left.webUrl || left.url);
        if (usageSortField === 'collection')
            return usageSortDirection === 'ascending' ? compareText(left.siteCollectionName || '', right.siteCollectionName || '') : compareText(right.siteCollectionName || '', left.siteCollectionName || '');
        var diff = (siteCountById.get(left.id) || 0) - (siteCountById.get(right.id) || 0);
        return usageSortDirection === 'ascending' ? diff : -diff;
    }); }, [siteCountById, usageSortDirection, usageSortField, visibleSites]);
    var visibleSitesWithSkills = React.useMemo(function () { return visibleSites.filter(function (site) { return (siteCountById.get(site.id) || 0) > 0; }).length; }, [siteCountById, visibleSites]);
    var visibleSitesWithoutSkills = Math.max(0, visibleSites.length - visibleSitesWithSkills);
    var visibleAverageSkillsPerSite = visibleSites.length ? visibleSkills.length / visibleSites.length : 0;
    var skillDistributionBuckets = React.useMemo(function () {
        var buckets = [
            { label: '0 skills', count: 0 },
            { label: '1 skill', count: 0 },
            { label: '2 skills', count: 0 },
            { label: '3+ skills', count: 0 }
        ];
        for (var _i = 0, visibleSites_2 = visibleSites; _i < visibleSites_2.length; _i++) {
            var site = visibleSites_2[_i];
            var skillCount = siteCountById.get(site.id) || 0;
            buckets[Math.min(skillCount, 3)].count += 1;
        }
        return buckets;
    }, [siteCountById, visibleSites]);
    var usagePageCount = Math.max(1, Math.ceil(sortedUsageSites.length / 10));
    var safeUsagePage = Math.min(usagePage, usagePageCount);
    var usagePageSites = sortedUsageSites.slice((safeUsagePage - 1) * 10, safeUsagePage * 10);
    React.useEffect(function () { setUsagePage(1); }, [props.siteSearchText, usageCoverageFilter, usageSkillFilterId, usageSiteFilterId, usageSortDirection, usageSortField]);
    var handleUsageSortChange = React.useCallback(function (field) {
        if (usageSortField === field) {
            setUsageSortDirection(function (current) { return (current === 'ascending' ? 'descending' : 'ascending'); });
            return;
        }
        setUsageSortField(field);
        setUsageSortDirection(field === 'skills' ? 'descending' : 'ascending');
    }, [usageSortField]);
    var themeForHost = theme;
    return (React.createElement(react_components_1.IdPrefixProvider, { value: "sharepoint-skills-factory-" },
        React.createElement(react_components_1.FluentProvider, { theme: themeForHost, targetDocument: props.targetDocument, className: styles.root },
            React.createElement("div", { className: styles.header },
                React.createElement(react_components_1.Text, { size: 600, weight: "semibold" }, "Awesome SharePoint Skills Factory"),
                React.createElement(react_components_1.Body1, null, "Create. Discover. Understand.")),
            React.createElement("div", { className: styles.toolbar },
                React.createElement(react_components_1.TabList, { selectedValue: props.activeTab, onTabSelect: function (_, data) { return props.onTabChange(data.value); } },
                    React.createElement(react_components_1.Tab, { value: "all-skills" }, "All Skills"),
                    React.createElement(react_components_1.Tab, { value: "usage" }, "Usage"))),
            props.activeTab === 'all-skills' && (React.createElement("div", { className: styles.usageShell },
                React.createElement("div", { className: styles.usageTopBar },
                    React.createElement("div", { className: styles.usageFilterChips },
                        mySkillsOnly ? (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Owner: You",
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear owner filter", role: "button", tabIndex: 0, onClick: function () { return setMySkillsOnly(false); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setMySkillsOnly(false);
                                } } }))) : null,
                        props.searchText.trim() ? (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Search: ",
                            props.searchText.trim(),
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear search", role: "button", tabIndex: 0, onClick: function () { return props.onSearchTextChange(''); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    props.onSearchTextChange('');
                                } } }))) : null),
                    React.createElement("div", { className: styles.toolbarActions },
                        React.createElement(react_components_1.Button, { appearance: "secondary", icon: skillsSearchOpen ? React.createElement(react_icons_1.ChevronRight24Regular, null) : React.createElement(react_icons_1.ChevronDown24Regular, null), onClick: function () { return setSkillsSearchOpen(function (current) { return !current; }); } }, skillsSearchOpen ? 'Close search' : 'Open search'))),
                React.createElement(react_components_1.Card, { className: (0, react_components_1.mergeClasses)(styles.searchPanel, !skillsSearchOpen && styles.slidePanelHidden) },
                    React.createElement("div", { className: styles.searchPanelBody },
                        React.createElement("div", { className: styles.filterPanelHeader },
                            React.createElement("div", { className: styles.filterPanelTitle },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Search"),
                                React.createElement(react_components_1.Caption1, null, "Filter skills in the current tab.")),
                            React.createElement(react_components_1.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close search", onClick: function () { return setSkillsSearchOpen(false); } })),
                        React.createElement(react_components_1.Field, { className: styles.filterField, label: "Search", orientation: "horizontal" },
                            React.createElement(react_components_1.Input, { value: props.searchText, onChange: function (_, data) { return props.onSearchTextChange(data.value); }, placeholder: "Search skills" })),
                        React.createElement(react_components_1.Field, { className: styles.filterField, label: "Ownership" },
                            React.createElement(react_components_1.Checkbox, { checked: mySkillsOnly, onChange: function (_, data) { return setMySkillsOnly(Boolean(data.checked)); }, label: "Only my skills" }),
                            React.createElement(react_components_1.Caption1, null, "Show skills owned by the current user.")))),
                React.createElement("div", { className: styles.fullWidthBody },
                    React.createElement(SkillsTable_1.default, { skills: filteredAllSkills, selectedSkillId: (_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.id, onSelectSkill: props.onSelectSkill, currentUserName: props.currentUserName })),
                React.createElement("div", { className: (0, react_components_1.mergeClasses)(styles.skillBlade, !props.selectedSkill && styles.slidePanelHidden) },
                    React.createElement(SkillDetailsPanel_1.default, { skill: props.selectedSkill, sites: props.sites, siteCollections: props.siteCollections, onClose: function () { if (props.selectedSkill)
                            props.onSelectSkill(props.selectedSkill.id); }, onDeleteSkillSite: props.onDeleteSkillSite, onCreateSkill: props.onCreateSkill, onActivateAgentAssetsFeature: props.onActivateAgentAssetsFeature })))),
            props.activeTab === 'usage' && (React.createElement("div", { className: styles.usageShell },
                React.createElement("div", { className: styles.usageTopBar },
                    React.createElement("div", { className: styles.usageFilterChips },
                        usageSkillFilterId && (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Skill: ", (_b = props.usageSkills.find(function (skill) { return skill.id === usageSkillFilterId; })) === null || _b === void 0 ? void 0 :
                            _b.name,
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear skill filter", role: "button", tabIndex: 0, onClick: function () { return setUsageSkillFilterId(undefined); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setUsageSkillFilterId(undefined);
                                } } }))),
                        usageSiteFilterId && (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Site: ", (_c = props.sites.find(function (site) { return site.id === usageSiteFilterId; })) === null || _c === void 0 ? void 0 :
                            _c.name,
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear site filter", role: "button", tabIndex: 0, onClick: function () { return setUsageSiteFilterId(undefined); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setUsageSiteFilterId(undefined);
                                } } }))),
                        usageCoverageFilter !== 'all' && (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Coverage: ",
                            usageCoverageFilter === 'with-skills' ? 'with skills' : 'without skills',
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear coverage filter", role: "button", tabIndex: 0, onClick: function () { return setUsageCoverageFilter('all'); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    setUsageCoverageFilter('all');
                                } } }))),
                        props.siteSearchText.trim() && (React.createElement(react_components_1.Badge, { appearance: "outline", className: styles.filterChip },
                            "Search: ",
                            props.siteSearchText.trim(),
                            React.createElement(react_icons_1.Dismiss12Regular, { className: styles.filterChipDismiss, "aria-label": "Clear search", role: "button", tabIndex: 0, onClick: function () { return props.onSiteSearchTextChange(''); }, onKeyDown: function (event) { if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    props.onSiteSearchTextChange('');
                                } } })))),
                    React.createElement("div", { className: styles.toolbarActions },
                        React.createElement(react_components_1.Button, { appearance: "secondary", icon: React.createElement(react_icons_1.Add24Regular, null), onClick: function () {
                                setUsageFiltersOpen(false);
                                setUsageSettingsOpen(false);
                                setCreateSkillOpen(function (current) { return !current; });
                            } }, createSkillOpen ? 'Close create skill' : 'Create Skill'),
                        React.createElement(react_components_1.Button, { appearance: "secondary", icon: usageFiltersOpen ? React.createElement(react_icons_1.ChevronRight24Regular, null) : React.createElement(react_icons_1.ChevronDown24Regular, null), onClick: function () {
                                setCreateSkillOpen(false);
                                setUsageSettingsOpen(false);
                                setUsageFiltersOpen(function (current) { return !current; });
                            } }, usageFiltersOpen ? 'Close filters' : 'Open filters'),
                        React.createElement(react_components_1.Button, { appearance: "secondary", icon: React.createElement(react_icons_1.Settings24Regular, null), onClick: function () {
                                setCreateSkillOpen(false);
                                setUsageFiltersOpen(false);
                                setUsageSettingsOpen(function (current) { return !current; });
                            } }, usageSettingsOpen ? 'Close settings' : 'Settings'))),
                React.createElement(react_components_1.Card, { className: (0, react_components_1.mergeClasses)(styles.usagePanel, !usageFiltersOpen && styles.slidePanelHidden) },
                    React.createElement("div", { className: styles.usagePanelBody },
                        React.createElement("div", { className: styles.filterPanelHeader },
                            React.createElement("div", { className: styles.filterPanelTitle },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Usage filters"),
                                React.createElement(react_components_1.Caption1, null, "Slide-over panel for filtering the dashboard.")),
                            React.createElement(react_components_1.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close usage filters", onClick: function () { return setUsageFiltersOpen(false); } })),
                        React.createElement("div", { className: styles.filterGrid },
                            React.createElement("label", { className: styles.filterField },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill"),
                                React.createElement("select", { className: styles.select, value: usageSkillFilterId || '', onChange: function (event) { return setUsageSkillFilterId(event.target.value || undefined); } },
                                    React.createElement("option", { value: "" }, "All skills"),
                                    props.usageSkills.slice().sort(function (a, b) { return compareText(a.name, b.name); }).map(function (skill) { return React.createElement("option", { key: skill.id, value: skill.id }, skill.name); }))),
                            React.createElement("label", { className: styles.filterField },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Site"),
                                React.createElement("select", { className: styles.select, value: usageSiteFilterId || '', onChange: function (event) { return setUsageSiteFilterId(event.target.value || undefined); } },
                                    React.createElement("option", { value: "" }, "All sites"),
                                    props.sites.slice().sort(function (a, b) { return compareText(a.name, b.name); }).map(function (site) { return React.createElement("option", { key: site.id, value: site.id }, site.name); }))),
                            React.createElement("label", { className: styles.filterField },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Sites with/without skills"),
                                React.createElement("select", { className: styles.select, value: usageCoverageFilter, onChange: function (event) { return setUsageCoverageFilter(event.target.value); } },
                                    React.createElement("option", { value: "all" }, "All sites"),
                                    React.createElement("option", { value: "with-skills" }, "With skills"),
                                    React.createElement("option", { value: "without-skills" }, "Without skills"))),
                            React.createElement(react_components_1.Field, { className: styles.filterField, label: "Search sites" },
                                React.createElement(react_components_1.Input, { value: props.siteSearchText, onChange: function (_, data) { return props.onSiteSearchTextChange(data.value); }, placeholder: "Search sites, URLs, or collections" }))))),
                React.createElement(react_components_1.Card, { className: (0, react_components_1.mergeClasses)(styles.usagePanel, !usageSettingsOpen && styles.slidePanelHidden) },
                    React.createElement("div", { className: (0, react_components_1.mergeClasses)(styles.usagePanelBody, styles.usagePanelBodyNoScroll) },
                        React.createElement("div", { className: styles.filterPanelHeader },
                            React.createElement("div", { className: styles.filterPanelTitle },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Full-width view settings"),
                                React.createElement(react_components_1.Caption1, null, "Toggle and reorder the cards shown in the Usage dashboard.")),
                            React.createElement(react_components_1.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close settings", onClick: function () { return setUsageSettingsOpen(false); } })),
                        React.createElement("div", { className: styles.filterPanel }, usageCardOrder.map(function (key, index) {
                            var definition = USAGE_CARD_DEFINITIONS.find(function (candidate) { return candidate.key === key; });
                            var label = definition ? definition.label : key;
                            return (React.createElement("div", { key: key, className: styles.cardOrderRow },
                                React.createElement(react_components_1.Checkbox, { checked: usageCardVisibility[key], onChange: function (_, data) { return setUsageCardVisible(key, Boolean(data.checked)); }, label: label }),
                                React.createElement("div", { className: styles.cardOrderActions },
                                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: React.createElement(react_icons_1.ChevronUp16Regular, null), "aria-label": "Move ".concat(label, " up"), disabled: index === 0, onClick: function () { return moveUsageCard(key, -1); } }),
                                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: React.createElement(react_icons_1.ChevronDown16Regular, null), "aria-label": "Move ".concat(label, " down"), disabled: index === usageCardOrder.length - 1, onClick: function () { return moveUsageCard(key, 1); } }))));
                        })))),
                React.createElement(react_components_1.Card, { className: (0, react_components_1.mergeClasses)(styles.createPanel, !createSkillOpen && styles.slidePanelHidden) },
                    React.createElement("div", { className: styles.createPanelBody },
                        React.createElement("div", { className: styles.filterPanelHeader },
                            React.createElement("div", { className: styles.filterPanelTitle },
                                React.createElement(react_components_1.Text, { weight: "semibold" }, "Create Skill"),
                                React.createElement(react_components_1.Caption1, null, "Create a new skill folder and SKILL.md in a selected site.")),
                            React.createElement(react_components_1.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: React.createElement(react_icons_1.Dismiss24Regular, null), "aria-label": "Close create skill", disabled: createSkillSubmitting, onClick: function () { return setCreateSkillOpen(false); } })),
                        React.createElement(CreateSkillForm_1.default, { sites: props.sites, onCreateSkill: props.onCreateSkill, onActivateAgentAssetsFeature: props.onActivateAgentAssetsFeature, onCreated: function () { return setCreateSkillOpen(false); }, onSubmittingChange: setCreateSkillSubmitting }))),
                React.createElement("div", { className: styles.kpiGrid }, [
                    ['Total Sites', visibleSites.length, 'Sites in the current view'],
                    ['Total Skills', visibleSkills.length, 'Skills used by those sites'],
                    ['Sites with Skills', visibleSitesWithSkills, 'Sites showing at least one skill'],
                    ['Sites without Skills', visibleSitesWithoutSkills, 'Coverage gaps in the current view'],
                    ['Average Skills / Site', visibleAverageSkillsPerSite.toFixed(1), 'Mean skills per visible site']
                ].map(function (_a) {
                    var label = _a[0], value = _a[1], hint = _a[2];
                    return (React.createElement(react_components_1.Card, { key: String(label), className: styles.kpiCard },
                        React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, label) }),
                        React.createElement(react_components_1.Text, { size: 800, weight: "semibold", style: { color: react_components_1.tokens.colorBrandForeground1 } }, value),
                        React.createElement(react_components_1.Caption1, null, hint)));
                })),
                React.createElement("div", { className: styles.chartGrid }, usageCardOrder.map(function (cardKey) {
                    if (!usageCardVisibility[cardKey]) {
                        return null;
                    }
                    switch (cardKey) {
                        case 'skills-adoption':
                            return (React.createElement(react_components_1.Card, { key: cardKey, className: styles.chartCard },
                                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skills ranked by site adoption"), description: React.createElement(react_components_1.Caption1, null, "Horizontal bars show how many visible sites use each skill.") }),
                                React.createElement("div", { className: styles.chartList }, sortedUsageSkills.length ? sortedUsageSkills.map(function (skill) {
                                    var count = skillCountById.get(skill.id) || 0;
                                    var maxCount = Math.max.apply(Math, tslib_1.__spreadArray(tslib_1.__spreadArray([], Array.from(skillCountById.values()), false), [1], false));
                                    return React.createElement("button", { key: skill.id, type: "button", className: styles.chartItem, onClick: function () { return setUsageSkillFilterId(skill.id); } },
                                        React.createElement("div", { className: styles.chartItemHeader },
                                            React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name),
                                            React.createElement(react_components_1.Caption1, null,
                                                count,
                                                " site",
                                                count === 1 ? '' : 's')),
                                        React.createElement("div", { className: styles.chartTrack },
                                            React.createElement("div", { className: styles.chartFill, style: { width: "".concat(Math.max(4, (count / maxCount) * 100), "%") } })));
                                }) : React.createElement(react_components_1.Body1, { className: styles.chartNote }, "No skills match the current filters."))));
                        case 'sites-with-vs-without':
                            return (React.createElement(react_components_1.Card, { key: cardKey, className: styles.chartCard },
                                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Sites with vs. without skills"), description: React.createElement(react_components_1.Caption1, null, "Coverage and gap view for the current scope.") }),
                                React.createElement("div", { className: styles.donutLayout },
                                    React.createElement("svg", { viewBox: "0 0 160 160", className: styles.donutSvg, role: "img", "aria-label": "Sites with skills versus sites without skills" },
                                        React.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: react_components_1.tokens.colorNeutralBackground3, strokeWidth: "20" }),
                                        visibleSites.length ? (function () {
                                            var circumference = 2 * Math.PI * 54;
                                            var withLength = circumference * (visibleSitesWithSkills / visibleSites.length);
                                            var withoutLength = circumference - withLength;
                                            return (React.createElement(React.Fragment, null,
                                                React.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: react_components_1.tokens.colorPaletteGreenForeground1, strokeWidth: "20", strokeDasharray: "".concat(withLength, " ").concat(circumference), transform: "rotate(-90 80 80)", onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'with-skills' ? 'all' : 'with-skills'); }); }, style: { cursor: 'pointer' } }),
                                                React.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: react_components_1.tokens.colorNeutralStroke1, strokeWidth: "20", strokeDasharray: "".concat(withoutLength, " ").concat(circumference), strokeDashoffset: -withLength, transform: "rotate(-90 80 80)", onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'without-skills' ? 'all' : 'without-skills'); }); }, style: { cursor: 'pointer' } })));
                                        })() : null,
                                        React.createElement("text", { x: "80", y: "75", textAnchor: "middle", fontSize: "20", fill: react_components_1.tokens.colorNeutralForeground1, fontWeight: 600 }, visibleSites.length),
                                        React.createElement("text", { x: "80", y: "96", textAnchor: "middle", fontSize: "11", fill: react_components_1.tokens.colorNeutralForeground3 }, "sites")),
                                    React.createElement(react_components_1.Caption1, { className: styles.donutCaption }, "Click a segment to filter sites with or without skills."),
                                    React.createElement("div", { className: styles.donutLegend },
                                        React.createElement("button", { type: "button", className: styles.donutButton, onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'with-skills' ? 'all' : 'with-skills'); }); } },
                                            React.createElement("span", { className: styles.legendLeft },
                                                React.createElement("span", { className: (0, react_components_1.mergeClasses)(styles.legendSwatch, styles.legendGreen) }),
                                                React.createElement("span", null,
                                                    React.createElement(react_components_1.Text, { weight: "semibold" }, "Sites with skills"))),
                                            React.createElement(react_components_1.Caption1, null, visibleSites.length ? "".concat(Math.round((visibleSitesWithSkills / visibleSites.length) * 100), "%") : '0%')),
                                        React.createElement("button", { type: "button", className: styles.donutButton, onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'without-skills' ? 'all' : 'without-skills'); }); } },
                                            React.createElement("span", { className: styles.legendLeft },
                                                React.createElement("span", { className: (0, react_components_1.mergeClasses)(styles.legendSwatch, styles.legendGray) }),
                                                React.createElement("span", null,
                                                    React.createElement(react_components_1.Text, { weight: "semibold" }, "Sites without skills"))),
                                            React.createElement(react_components_1.Caption1, null, visibleSites.length ? "".concat(Math.round((visibleSitesWithoutSkills / visibleSites.length) * 100), "%") : '0%'))))));
                        case 'skill-distribution':
                            return (React.createElement(react_components_1.Card, { key: cardKey, className: styles.chartCard },
                                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Skill distribution"), description: React.createElement(react_components_1.Caption1, null, "How many skills each visible site has, grouped into bands.") }),
                                React.createElement("div", { className: styles.distributionList }, skillDistributionBuckets.map(function (bucket) {
                                    var percentage = visibleSites.length ? Math.round((bucket.count / visibleSites.length) * 100) : 0;
                                    return (React.createElement("div", { key: bucket.label, className: styles.distributionRow },
                                        React.createElement(react_components_1.Text, { weight: "semibold" }, bucket.label),
                                        React.createElement("div", { className: styles.distributionTrack },
                                            React.createElement("div", { className: styles.distributionFill, style: { width: bucket.count > 0 ? "".concat(Math.max(4, percentage), "%") : '0%' } }),
                                            React.createElement("div", { className: styles.distributionTrackLabel },
                                                React.createElement("span", { className: styles.distributionTrackLabelText },
                                                    percentage,
                                                    "%"))),
                                        React.createElement("div", { className: styles.distributionMeta },
                                            React.createElement(react_components_1.Text, { weight: "semibold" }, bucket.count))));
                                }))));
                        case 'sites':
                            return (React.createElement(react_components_1.Card, { key: cardKey, className: (0, react_components_1.mergeClasses)(styles.chartCard, styles.tableCard) },
                                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Sites"), description: React.createElement(react_components_1.Caption1, null, "Search, filter, and select a site to inspect its skills.") }),
                                React.createElement("div", { className: styles.usageViewport },
                                    React.createElement(SitesTable_1.default, { sites: usagePageSites, skills: visibleSkills, selectedSiteId: usageSiteFilterId, onSelectSite: setUsageSiteFilterId, sortField: usageSortField, sortDirection: usageSortDirection, onSortChange: handleUsageSortChange })),
                                React.createElement("div", { className: styles.paginationBar },
                                    React.createElement(react_components_1.Body1, null,
                                        "Page ",
                                        safeUsagePage,
                                        " of ",
                                        usagePageCount),
                                    React.createElement("div", { className: styles.toolbarActions },
                                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: safeUsagePage <= 1, onClick: function () { return setUsagePage(function (page) { return Math.max(1, page - 1); }); } }, "Previous"),
                                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: safeUsagePage >= usagePageCount, onClick: function () { return setUsagePage(function (page) { return Math.min(usagePageCount, page + 1); }); } }, "Next")))));
                        default:
                            return null;
                    }
                })))))));
}
//# sourceMappingURL=SkillsFactoryDashboard.js.map