"use strict";
self["webpackHotUpdate_7f6a4b7c_32d0_4d3f_8a1a_35f7e4ac5b29_0_0_1"]("sharepoint-skills-factory",{

/***/ 776
/*!*************************************************************!*\
  !*** ./lib/components/fullscreen/SkillsFactoryDashboard.js ***!
  \*************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SkillsFactoryDashboard)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ 2691);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ 5959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @fluentui/react-components */ 6122);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react-components */ 4494);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react-components */ 7285);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react-components */ 6731);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react-components */ 9691);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react-components */ 8651);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react-components */ 4497);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react-components */ 9403);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react-components */ 661);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react-components */ 1173);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react-components */ 4781);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @fluentui/react-components */ 3409);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @fluentui/react-components */ 4942);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @fluentui/react-components */ 106);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @fluentui/react-components */ 2640);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @fluentui/react-components */ 4413);
/* harmony import */ var _fluentui_react_components__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @fluentui/react-components */ 7008);
/* harmony import */ var _fluentui_react_icons__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @fluentui/react-icons */ 6758);
/* harmony import */ var _fluentui_react_icons__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @fluentui/react-icons */ 5858);
/* harmony import */ var _SkillCards__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../SkillCards */ 4620);
/* harmony import */ var _SkillDetailsPanel__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./SkillDetailsPanel */ 8591);
/* harmony import */ var _SitesTable__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./SitesTable */ 4772);
/* harmony import */ var _SkillsTable__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./SkillsTable */ 6860);








var useStyles = (0,_fluentui_react_components__WEBPACK_IMPORTED_MODULE_14__.makeStyles)({
    root: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalM, padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalM },
    header: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS },
    toolbar: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'center', justifyContent: 'space-between' },
    toolbarActions: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'center' },
    searchBar: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'end' },
    searchField: { flex: '1 1 320px', minWidth: '260px' },
    body: { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalM, alignItems: 'start' },
    fullWidthBody: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalM },
    usageLayout: { display: 'grid', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    usageShell: { position: 'relative', display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    usageBody: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    usageTopBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'start' },
    usageFilterChips: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalXS, alignItems: 'center' },
    usagePanel: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 'min(420px, 92vw)',
        maxWidth: '100%',
        zIndex: 5,
        boxShadow: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.shadow16,
        borderLeft: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2),
        borderTopLeftRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusLarge,
        borderBottomLeftRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusLarge
    },
    usagePanelBody: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
    usagePanelSpacer: { minHeight: '1px' },
    searchPanel: { position: 'absolute', right: 0, top: 0, width: 'min(420px, 92vw)', zIndex: 5, boxShadow: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.shadow16, borderLeft: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), borderTopLeftRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusLarge, borderBottomLeftRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusLarge },
    searchPanelBody: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS, maxHeight: '72vh', overflowY: 'auto' },
    filterGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'end' },
    filterField: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXXS },
    filterPanel: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    filterPanelHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS },
    filterPanelTitle: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXXS },
    filterPanelClose: { alignSelf: 'flex-end' },
    select: { minHeight: '32px', borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusMedium, border: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1, color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground1, padding: "".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS, " ").concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS), font: 'inherit' },
    filterSummary: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalXS, alignItems: 'center' },
    usageCard: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    compactStatCard: { display: 'inline-flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXXS, minHeight: '92px', width: 'fit-content', minWidth: '180px', padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalM },
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalM },
    kpiCard: { minHeight: '104px' },
    chartGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS },
    chartCard: { minHeight: '100%', maxHeight: '460px', overflowY: 'auto' },
    chartWide: { gridColumn: '1 / -1' },
    chartList: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    chartItem: { border: 'none', background: 'transparent', padding: 0, textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS },
    chartItemHeader: { display: 'flex', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'baseline' },
    chartTrack: { height: '10px', borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusCircular, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground3, overflow: 'hidden' },
    chartFill: { height: '100%', borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusCircular, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorBrandBackground },
    chartNote: { color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground3 },
    donutLayout: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS, alignItems: 'center' },
    donutSvg: { width: '100%', maxWidth: '220px', display: 'block', margin: '0 auto' },
    donutCaption: { textAlign: 'center', color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground3 },
    donutLegend: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS },
    donutButton: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, width: '100%', border: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusMedium, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1, padding: "".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS, " ").concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS), cursor: 'pointer' },
    legendLeft: { display: 'flex', alignItems: 'center', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS },
    legendSwatch: { width: '12px', height: '12px', borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusCircular, flexShrink: 0 },
    legendGreen: { backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorPaletteGreenForeground1 },
    legendGray: { backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke1 },
    siteTiles: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS },
    siteTile: {
        border: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2),
        borderRadius: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.borderRadiusLarge,
        backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1,
        padding: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalM,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalS,
        minHeight: '100%'
    },
    siteTileHeader: { display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS },
    siteTileMeta: { display: 'flex', flexDirection: 'column', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXXS, minWidth: 0, flex: '1 1 auto' },
    siteTileUrl: { maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    siteSkillRow: { display: 'flex', flexWrap: 'wrap', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalXS, minWidth: 0 },
    siteSkillCount: { flexShrink: 0, alignSelf: 'flex-start' },
    siteSkillMore: { color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground3 },
    usageViewport: { paddingRight: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalXXS },
    heatmapScroll: { overflow: 'auto' },
    heatmapTable: { borderCollapse: 'collapse', minWidth: 'max-content', width: '100%' },
    heatmapCorner: { position: 'sticky', top: 0, left: 0, zIndex: 3, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), padding: "".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS, " ").concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS), textAlign: 'left', whiteSpace: 'nowrap' },
    heatmapHeader: { position: 'sticky', top: 0, zIndex: 2, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), padding: "".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS, " ").concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS), textAlign: 'center', whiteSpace: 'nowrap' },
    heatmapRowHeader: { position: 'sticky', left: 0, zIndex: 1, backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground1, borderBottom: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), padding: "".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalXS, " ").concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS), textAlign: 'left', whiteSpace: 'nowrap' },
    heatmapCell: { width: '40px', height: '40px', borderBottom: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), borderRight: "1px solid ".concat(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke2), padding: 0, textAlign: 'center' },
    heatmapPresent: { backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorPaletteGreenBackground2 },
    heatmapEmpty: { backgroundColor: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground2 },
    heatmapButton: { width: '100%', height: '100%', border: 'none', background: 'transparent', cursor: 'pointer' },
    heatmapMark: { fontWeight: 700, color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground1 },
    tableCard: { overflow: 'hidden' },
    paginationBar: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingHorizontalS, alignItems: 'center', marginTop: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.spacingVerticalM }
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
function SkillsFactoryDashboard(props) {
    var _a, _b, _c, _d;
    var styles = useStyles();
    var _e = react__WEBPACK_IMPORTED_MODULE_1__.useState(1), usagePage = _e[0], setUsagePage = _e[1];
    var _f = react__WEBPACK_IMPORTED_MODULE_1__.useState('site'), usageSortField = _f[0], setUsageSortField = _f[1];
    var _g = react__WEBPACK_IMPORTED_MODULE_1__.useState('ascending'), usageSortDirection = _g[0], setUsageSortDirection = _g[1];
    var _h = react__WEBPACK_IMPORTED_MODULE_1__.useState(), usageSkillFilterId = _h[0], setUsageSkillFilterId = _h[1];
    var _j = react__WEBPACK_IMPORTED_MODULE_1__.useState(), usageSiteFilterId = _j[0], setUsageSiteFilterId = _j[1];
    var _k = react__WEBPACK_IMPORTED_MODULE_1__.useState('all'), usageCoverageFilter = _k[0], setUsageCoverageFilter = _k[1];
    var _l = react__WEBPACK_IMPORTED_MODULE_1__.useState(false), usageFiltersOpen = _l[0], setUsageFiltersOpen = _l[1];
    var _m = react__WEBPACK_IMPORTED_MODULE_1__.useState(false), skillsSearchOpen = _m[0], setSkillsSearchOpen = _m[1];
    var theme = props.hostContext.theme === 'dark' ? _fluentui_react_components__WEBPACK_IMPORTED_MODULE_15__.webDarkTheme : _fluentui_react_components__WEBPACK_IMPORTED_MODULE_2__.webLightTheme;
    var siteSkillMap = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return buildSiteSkillMap(props.sites, props.usageSkills); }, [props.sites, props.usageSkills]);
    var filteredMySkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var needle = props.searchText.trim().toLowerCase();
        return props.mySkills.filter(function (skill) { return !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1; });
    }, [props.mySkills, props.searchText]);
    var filteredAllSkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var needle = props.searchText.trim().toLowerCase();
        return props.allSkills.filter(function (skill) { return !needle || [skill.name, skill.description, skill.owner, skill.knowledgeSources.join(' '), skill.suggestedPrompts.join(' ')].join(' ').toLowerCase().indexOf(needle) !== -1; });
    }, [props.allSkills, props.searchText]);
    var visibleSites = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
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
    var visibleSiteSet = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return new Set(visibleSites.map(function (site) { return site.id; })); }, [visibleSites]);
    var visibleSkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return props.usageSkills.filter(function (skill) { return skill.siteIds.some(function (siteId) { return visibleSiteSet.has(siteId); }); }); }, [props.usageSkills, visibleSiteSet]);
    var skillCountById = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
        var counts = new Map();
        for (var _i = 0, visibleSkills_1 = visibleSkills; _i < visibleSkills_1.length; _i++) {
            var skill = visibleSkills_1[_i];
            counts.set(skill.id, skill.siteIds.filter(function (siteId) { return visibleSiteSet.has(siteId); }).length);
        }
        return counts;
    }, [visibleSiteSet, visibleSkills]);
    var siteCountById = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () {
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
    var sortedUsageSkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return visibleSkills.slice().sort(function (left, right) { return (skillCountById.get(right.id) || 0) - (skillCountById.get(left.id) || 0) || compareText(left.name, right.name); }); }, [skillCountById, visibleSkills]);
    var sortedUsageSites = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return visibleSites.slice().sort(function (left, right) {
        if (usageSortField === 'site')
            return usageSortDirection === 'ascending' ? compareText(left.name, right.name) : compareText(right.name, left.name);
        if (usageSortField === 'url')
            return usageSortDirection === 'ascending' ? compareText(left.webUrl || left.url, right.webUrl || right.url) : compareText(right.webUrl || right.url, left.webUrl || left.url);
        if (usageSortField === 'collection')
            return usageSortDirection === 'ascending' ? compareText(left.siteCollectionName || '', right.siteCollectionName || '') : compareText(right.siteCollectionName || '', left.siteCollectionName || '');
        var diff = (siteCountById.get(left.id) || 0) - (siteCountById.get(right.id) || 0);
        return usageSortDirection === 'ascending' ? diff : -diff;
    }); }, [siteCountById, usageSortDirection, usageSortField, visibleSites]);
    var visibleSitesWithSkills = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function () { return visibleSites.filter(function (site) { return (siteCountById.get(site.id) || 0) > 0; }).length; }, [siteCountById, visibleSites]);
    var visibleSitesWithoutSkills = Math.max(0, visibleSites.length - visibleSitesWithSkills);
    var visibleAverageSkillsPerSite = visibleSites.length ? visibleSkills.length / visibleSites.length : 0;
    var usagePageCount = Math.max(1, Math.ceil(sortedUsageSites.length / 10));
    var safeUsagePage = Math.min(usagePage, usagePageCount);
    var usagePageSites = sortedUsageSites.slice((safeUsagePage - 1) * 10, safeUsagePage * 10);
    react__WEBPACK_IMPORTED_MODULE_1__.useEffect(function () { setUsagePage(1); }, [props.siteSearchText, usageCoverageFilter, usageSkillFilterId, usageSiteFilterId, usageSortDirection, usageSortField]);
    var handleUsageSortChange = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function (field) {
        if (usageSortField === field) {
            setUsageSortDirection(function (current) { return (current === 'ascending' ? 'descending' : 'ascending'); });
            return;
        }
        setUsageSortField(field);
        setUsageSortDirection(field === 'skills' ? 'descending' : 'ascending');
    }, [usageSortField]);
    var clearUsageFilters = react__WEBPACK_IMPORTED_MODULE_1__.useCallback(function () {
        setUsageSkillFilterId(undefined);
        setUsageSiteFilterId(undefined);
        setUsageCoverageFilter('all');
        props.onSiteSearchTextChange('');
    }, [props.onSiteSearchTextChange]);
    var themeForHost = theme;
    return (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_18__.IdPrefixProvider, { value: "sharepoint-skills-factory-" },
        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_16__.FluentProvider, { theme: themeForHost, targetDocument: props.targetDocument, className: styles.root },
            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.header },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { size: 600, weight: "semibold" }, "Awesome SharePoint Skills Factory"),
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Body1, null, "Create. Discover. Understand.")),
            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.toolbar },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_5__.TabList, { selectedValue: props.activeTab, onTabSelect: function (_, data) { return props.onTabChange(data.value); } },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.Tab, { value: "my-skills" }, "My Skills"),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.Tab, { value: "all-skills" }, "All Skills"),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_6__.Tab, { value: "usage" }, "Usage"))),
            (props.activeTab === 'my-skills' || props.activeTab === 'all-skills') && (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageShell },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageTopBar },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageFilterChips }, props.searchText.trim() ? react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline" },
                        "Search: ",
                        props.searchText.trim()) : null),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.toolbarActions },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", icon: skillsSearchOpen ? react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_19__.ChevronRight24Regular, null) : react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_19__.ChevronDown24Regular, null), onClick: function () { return setSkillsSearchOpen(function (current) { return !current; }); } }, skillsSearchOpen ? 'Close search' : 'Open search'),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", onClick: function () { return props.onSearchTextChange(''); }, disabled: !props.searchText.trim() }, "Clear search"))),
                skillsSearchOpen ? (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.searchPanel },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.searchPanelBody },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.filterPanelHeader },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.filterPanelTitle },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Search"),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Filter skills in the current tab.")),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_20__.Dismiss24Regular, null), "aria-label": "Close search", onClick: function () { return setSkillsSearchOpen(false); } })),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_11__.Field, { className: styles.filterField, label: "Search", orientation: "horizontal" },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_12__.Input, { value: props.searchText, onChange: function (_, data) { return props.onSearchTextChange(data.value); }, placeholder: "Search skills" }))))) : null)),
            props.activeTab === 'my-skills' && (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageLayout },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.compactStatCard },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "My skills") }),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { size: 700, weight: "semibold", style: { color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorBrandForeground1 } }, props.mySkills.length)),
                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.body },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.fullWidthBody },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SkillCards__WEBPACK_IMPORTED_MODULE_21__["default"], { skills: filteredMySkills, currentUserName: props.currentUserName, selectedSkillId: (_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.id, onSelectSkill: props.onSelectSkill })),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SkillDetailsPanel__WEBPACK_IMPORTED_MODULE_22__["default"], { skill: props.selectedSkill, sites: props.sites.filter(function (site) { var _a; return (((_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.siteIds) || []).indexOf(site.id) !== -1; }), siteCollections: props.siteCollections, currentUserName: props.currentUserName })))),
            props.activeTab === 'all-skills' && (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageLayout },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.compactStatCard },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "All skills") }),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { size: 700, weight: "semibold", style: { color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorBrandForeground1 } }, props.allSkills.length)),
                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.body },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.fullWidthBody },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SkillsTable__WEBPACK_IMPORTED_MODULE_24__["default"], { skills: filteredAllSkills, siteCollections: props.siteCollections, selectedSkillId: (_b = props.selectedSkill) === null || _b === void 0 ? void 0 : _b.id, onSelectSkill: props.onSelectSkill })),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SkillDetailsPanel__WEBPACK_IMPORTED_MODULE_22__["default"], { skill: props.selectedSkill, sites: props.sites.filter(function (site) { var _a; return (((_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.siteIds) || []).indexOf(site.id) !== -1; }), siteCollections: props.siteCollections, currentUserName: props.currentUserName })))),
            props.activeTab === 'usage' && (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageShell },
                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageTopBar },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usageFilterChips },
                        usageSkillFilterId && react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline" },
                            "Skill: ", (_c = props.usageSkills.find(function (skill) { return skill.id === usageSkillFilterId; })) === null || _c === void 0 ? void 0 :
                            _c.name),
                        usageSiteFilterId && react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline" },
                            "Site: ", (_d = props.sites.find(function (site) { return site.id === usageSiteFilterId; })) === null || _d === void 0 ? void 0 :
                            _d.name),
                        usageCoverageFilter !== 'all' && react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline" },
                            "Coverage: ",
                            usageCoverageFilter === 'with-skills' ? 'with skills' : 'without skills'),
                        props.siteSearchText.trim() && react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline" },
                            "Search: ",
                            props.siteSearchText.trim()),
                        null),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.toolbarActions },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", icon: usageFiltersOpen ? react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_19__.ChevronRight24Regular, null) : react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_19__.ChevronDown24Regular, null), onClick: function () { return setUsageFiltersOpen(function (current) { return !current; }); } }, usageFiltersOpen ? 'Close filters' : 'Open filters'),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", onClick: clearUsageFilters, disabled: !props.siteSearchText.trim() && !usageSkillFilterId && !usageSiteFilterId && usageCoverageFilter === 'all' }, "Clear filters"))),
                usageFiltersOpen ? (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.usagePanel },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usagePanelBody },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.filterPanelHeader },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.filterPanelTitle },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Usage filters"),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Slide-over panel for filtering the dashboard.")),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { className: styles.filterPanelClose, appearance: "subtle", icon: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_icons__WEBPACK_IMPORTED_MODULE_20__.Dismiss24Regular, null), "aria-label": "Close usage filters", onClick: function () { return setUsageFiltersOpen(false); } })),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.filterGrid },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("label", { className: styles.filterField },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Skill"),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("select", { className: styles.select, value: usageSkillFilterId || '', onChange: function (event) { return setUsageSkillFilterId(event.target.value || undefined); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { value: "" }, "All skills"),
                                    props.usageSkills.slice().sort(function (a, b) { return compareText(a.name, b.name); }).map(function (skill) { return react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { key: skill.id, value: skill.id }, skill.name); }))),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("label", { className: styles.filterField },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Site"),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("select", { className: styles.select, value: usageSiteFilterId || '', onChange: function (event) { return setUsageSiteFilterId(event.target.value || undefined); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { value: "" }, "All sites"),
                                    props.sites.slice().sort(function (a, b) { return compareText(a.name, b.name); }).map(function (site) { return react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { key: site.id, value: site.id }, site.name); }))),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("label", { className: styles.filterField },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Sites with/without skills"),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("select", { className: styles.select, value: usageCoverageFilter, onChange: function (event) { return setUsageCoverageFilter(event.target.value); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { value: "all" }, "All sites"),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { value: "with-skills" }, "With skills"),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("option", { value: "without-skills" }, "Without skills"))),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_11__.Field, { className: styles.filterField, label: "Search sites" },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_12__.Input, { value: props.siteSearchText, onChange: function (_, data) { return props.onSiteSearchTextChange(data.value); }, placeholder: "Search sites, URLs, or collections" })))))) : null,
                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.usagePanelSpacer }),
                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.usageCard },
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.kpiGrid }, [
                        ['Total Sites', visibleSites.length, 'Sites in the current view'],
                        ['Total Skills', visibleSkills.length, 'Skills used by those sites'],
                        ['Sites with Skills', visibleSitesWithSkills, 'Sites showing at least one skill'],
                        ['Sites without Skills', visibleSitesWithoutSkills, 'Coverage gaps in the current view'],
                        ['Average Skills / Site', visibleAverageSkillsPerSite.toFixed(1), 'Mean skills per visible site']
                    ].map(function (_a) {
                        var label = _a[0], value = _a[1], hint = _a[2];
                        return (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { key: String(label), className: styles.kpiCard },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, label) }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { size: 800, weight: "semibold", style: { color: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorBrandForeground1 } }, value),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, hint)));
                    })),
                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartGrid },
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.chartCard },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Skills ranked by site adoption"), description: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Horizontal bars show how many visible sites use each skill.") }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartList }, sortedUsageSkills.length ? sortedUsageSkills.map(function (skill) {
                                var count = skillCountById.get(skill.id) || 0;
                                var maxCount = Math.max.apply(Math, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], Array.from(skillCountById.values()), false), [1], false));
                                return react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", { key: skill.id, type: "button", className: styles.chartItem, onClick: function () { return setUsageSkillFilterId(skill.id); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartItemHeader },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, skill.name),
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null,
                                            count,
                                            " site",
                                            count === 1 ? '' : 's')),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartTrack },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartFill, style: { width: "".concat(Math.max(4, (count / maxCount) * 100), "%") } })));
                            }) : react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Body1, { className: styles.chartNote }, "No skills match the current filters."))),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: styles.chartCard },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Sites with vs. without skills"), description: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Coverage and gap view for the current scope.") }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.donutLayout },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("svg", { viewBox: "0 0 160 160", className: styles.donutSvg, role: "img", "aria-label": "Sites with skills versus sites without skills" },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralBackground3, strokeWidth: "20" }),
                                    visibleSites.length ? (function () {
                                        var circumference = 2 * Math.PI * 54;
                                        var withLength = circumference * (visibleSitesWithSkills / visibleSites.length);
                                        var withoutLength = circumference - withLength;
                                        return (react__WEBPACK_IMPORTED_MODULE_1__.createElement(react__WEBPACK_IMPORTED_MODULE_1__.Fragment, null,
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorPaletteGreenForeground1, strokeWidth: "20", strokeDasharray: "".concat(withLength, " ").concat(circumference), transform: "rotate(-90 80 80)", onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'with-skills' ? 'all' : 'with-skills'); }); }, style: { cursor: 'pointer' } }),
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("circle", { cx: "80", cy: "80", r: "54", fill: "none", stroke: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralStroke1, strokeWidth: "20", strokeDasharray: "".concat(withoutLength, " ").concat(circumference), strokeDashoffset: -withLength, transform: "rotate(-90 80 80)", onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'without-skills' ? 'all' : 'without-skills'); }); }, style: { cursor: 'pointer' } })));
                                    })() : null,
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("text", { x: "80", y: "75", textAnchor: "middle", fontSize: "20", fill: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground1, fontWeight: 600 }, visibleSites.length),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("text", { x: "80", y: "96", textAnchor: "middle", fontSize: "11", fill: _fluentui_react_components__WEBPACK_IMPORTED_MODULE_17__.tokens.colorNeutralForeground3 }, "sites")),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, { className: styles.donutCaption }, "Click a segment to filter sites with or without skills."),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.donutLegend },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", { type: "button", className: styles.donutButton, onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'with-skills' ? 'all' : 'with-skills'); }); } },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: styles.legendLeft },
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: "".concat(styles.legendSwatch, " ").concat(styles.legendGreen) }),
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null,
                                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Sites with skills"),
                                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, visibleSitesWithSkills))),
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, visibleSites.length ? "".concat(Math.round((visibleSitesWithSkills / visibleSites.length) * 100), "%") : '0%')),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", { type: "button", className: styles.donutButton, onClick: function () { return setUsageCoverageFilter(function (current) { return (current === 'without-skills' ? 'all' : 'without-skills'); }); } },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: styles.legendLeft },
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", { className: "".concat(styles.legendSwatch, " ").concat(styles.legendGray) }),
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("span", null,
                                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Sites without skills"),
                                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, visibleSitesWithoutSkills))),
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, visibleSites.length ? "".concat(Math.round((visibleSitesWithoutSkills / visibleSites.length) * 100), "%") : '0%'))))),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: "".concat(styles.chartCard, " ").concat(styles.chartWide) },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Skills per site"), description: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Sites are sorted by visible skill count, highest first.") }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartList }, sortedUsageSites.length ? sortedUsageSites.map(function (site) {
                                var count = siteCountById.get(site.id) || 0;
                                var maxCount = Math.max.apply(Math, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], Array.from(siteCountById.values()), false), [1], false));
                                return (react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", { key: site.id, type: "button", className: styles.chartItem, onClick: function () { return setUsageSiteFilterId(site.id); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartItemHeader },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, site.name),
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null,
                                            count,
                                            " skill",
                                            count === 1 ? '' : 's')),
                                    count > 0 ? (react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartTrack },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.chartFill, style: { width: "".concat(Math.max(4, (count / maxCount) * 100), "%") } }))) : (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, { className: styles.heatmapEmpty }, "No skills"))));
                            }) : react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Body1, { className: styles.chartNote }, "No sites match the current filters."))),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: "".concat(styles.chartCard, " ").concat(styles.chartWide) },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Site skill tiles"), description: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Responsive tiles replace the old matrix and stay compact as tenant size grows.") }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.siteTiles }, sortedUsageSites.length ? sortedUsageSites.map(function (site) {
                                var siteSkills = visibleSkills.filter(function (skill) { return skill.siteIds.indexOf(site.id) !== -1; });
                                var badgeLimit = 6;
                                var overflowCount = Math.max(0, siteSkills.length - badgeLimit);
                                return (react__WEBPACK_IMPORTED_MODULE_1__.createElement("button", { key: site.id, type: "button", className: styles.siteTile, onClick: function () { return setUsageSiteFilterId(site.id); } },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.siteTileHeader },
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.siteTileMeta },
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, site.name),
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, site.siteCollectionName || 'Site collection unavailable'),
                                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, { className: styles.siteTileUrl }, (site.webUrl || site.url || '').replace(/^https?:\/\/[^/]*?\.sharepoint\.com/i, '') || (site.webUrl || site.url || ''))),
                                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { appearance: "outline", className: styles.siteSkillCount }, siteSkills.length)),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.siteSkillRow },
                                        siteSkills.slice(0, badgeLimit).map(function (skill) { return (react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_7__.Badge, { key: skill.id, appearance: "outline", onClick: function (event) { event.stopPropagation(); setUsageSkillFilterId(skill.id); setUsageSiteFilterId(site.id); } }, skill.name)); }),
                                        overflowCount > 0 ? react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, { className: styles.siteSkillMore },
                                            "+",
                                            overflowCount,
                                            " more") : null)));
                            }) : react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Body1, { className: styles.chartNote }, "No sites or skills match the current filters."))),
                        react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_9__.Card, { className: "".concat(styles.chartCard, " ").concat(styles.chartWide, " ").concat(styles.tableCard) },
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_13__.CardHeader, { header: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_3__.Text, { weight: "semibold" }, "Sites"), description: react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_10__.Caption1, null, "Search, sort, filter, and expand to inspect the skills on each site.") }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement(_SitesTable__WEBPACK_IMPORTED_MODULE_23__["default"], { sites: usagePageSites, skills: visibleSkills, selectedSiteId: usageSiteFilterId, onSelectSite: setUsageSiteFilterId, sortField: usageSortField, sortDirection: usageSortDirection, onSortChange: handleUsageSortChange }),
                            react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.paginationBar },
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_4__.Body1, null,
                                    "Page ",
                                    safeUsagePage,
                                    " of ",
                                    usagePageCount),
                                react__WEBPACK_IMPORTED_MODULE_1__.createElement("div", { className: styles.toolbarActions },
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", disabled: safeUsagePage <= 1, onClick: function () { return setUsagePage(function (page) { return Math.max(1, page - 1); }); } }, "Previous"),
                                    react__WEBPACK_IMPORTED_MODULE_1__.createElement(_fluentui_react_components__WEBPACK_IMPORTED_MODULE_8__.Button, { appearance: "secondary", disabled: safeUsagePage >= usagePageCount, onClick: function () { return setUsagePage(function (page) { return Math.min(usagePageCount, page + 1); }); } }, "Next")))))))))));
}


/***/ }

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("b41b0571d1e998ad5f91")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=sharepoint-skills-factory.73a664f5d4e3e7c4279b.hot-update.js.map