"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillsFactoryDashboard;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var SkillCards_1 = tslib_1.__importDefault(require("../SkillCards"));
var SkillDetailsPanel_1 = tslib_1.__importDefault(require("./SkillDetailsPanel"));
var SitesTable_1 = tslib_1.__importDefault(require("./SitesTable"));
var SkillsTable_1 = tslib_1.__importDefault(require("./SkillsTable"));
var useStyles = (0, react_components_1.makeStyles)({
    root: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM,
        padding: react_components_1.tokens.spacingHorizontalM
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXS
    },
    toolbar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalS,
        alignItems: 'end',
        justifyContent: 'space-between'
    },
    filters: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalS,
        alignItems: 'end'
    },
    filterField: {
        flex: '1 1 260px',
        minWidth: '260px'
    },
    body: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: react_components_1.tokens.spacingHorizontalM,
        alignItems: 'start'
    },
    fullWidthBody: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalM
    },
    usageSummary: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(160px, 180px))',
        gap: react_components_1.tokens.spacingHorizontalM,
        justifyContent: 'start'
    },
    summaryCard: {
        minHeight: '100%',
        padding: react_components_1.tokens.spacingVerticalS
    },
    summaryCardCompact: {
        width: '180px',
        alignSelf: 'flex-start',
        minHeight: '72px',
        padding: react_components_1.tokens.spacingVerticalS
    },
    summaryLabel: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    summaryValue: {
        color: react_components_1.tokens.colorBrandForeground1
    },
    skillDetailsBody: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
        gap: react_components_1.tokens.spacingHorizontalM,
        alignItems: 'start'
    }
});
function SkillsFactoryDashboard(props) {
    var _a, _b;
    var styles = useStyles();
    var itemsPerPage = 10;
    var _c = React.useState(1), usagePage = _c[0], setUsagePage = _c[1];
    var _d = React.useState('site'), usageSortField = _d[0], setUsageSortField = _d[1];
    var _e = React.useState('ascending'), usageSortDirection = _e[0], setUsageSortDirection = _e[1];
    var usageSites = props.selectedSkill
        ? props.sites.filter(function (site) { var _a; return ((_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.siteIds.indexOf(site.id)) !== -1; })
        : props.sites.slice(0, 5);
    var usageCollections = props.selectedSkill
        ? props.siteCollections.filter(function (collection) { var _a; return ((_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.siteCollectionIds.indexOf(collection.id)) !== -1; })
        : props.siteCollections;
    var filteredSites = React.useMemo(function () {
        var needle = props.siteSearchText.trim().toLowerCase();
        if (!needle) {
            return props.sites;
        }
        return props.sites.filter(function (site) {
            return [site.name, site.url, site.webUrl, site.siteCollectionName, site.hostname].filter(Boolean).join(' ').toLowerCase().indexOf(needle) !== -1;
        });
    }, [props.siteSearchText, props.sites]);
    React.useEffect(function () {
        setUsagePage(1);
    }, [props.siteSearchText]);
    React.useEffect(function () {
        setUsagePage(1);
    }, [usageSortField, usageSortDirection]);
    var sortedFilteredSites = React.useMemo(function () {
        var compareText = function (left, right) { return left.localeCompare(right, undefined, { sensitivity: 'base' }); };
        var items = filteredSites.slice();
        items.sort(function (left, right) {
            var comparison = 0;
            if (usageSortField === 'site') {
                comparison = compareText(left.name, right.name);
            }
            else if (usageSortField === 'url') {
                comparison = compareText(left.webUrl || left.url, right.webUrl || right.url);
            }
            else if (usageSortField === 'collection') {
                comparison = compareText(left.siteCollectionName || '', right.siteCollectionName || '');
            }
            else {
                var leftCount = props.allSkills.filter(function (skill) { return skill.siteIds.indexOf(left.id) !== -1; }).length;
                var rightCount = props.allSkills.filter(function (skill) { return skill.siteIds.indexOf(right.id) !== -1; }).length;
                comparison = leftCount - rightCount;
            }
            return usageSortDirection === 'ascending' ? comparison : -comparison;
        });
        return items;
    }, [filteredSites, props.allSkills, usageSortDirection, usageSortField]);
    var usagePageCount = Math.max(1, Math.ceil(filteredSites.length / itemsPerPage));
    var safeUsagePage = Math.min(usagePage, usagePageCount);
    var usagePageSites = sortedFilteredSites.slice((safeUsagePage - 1) * itemsPerPage, safeUsagePage * itemsPerPage);
    var selectedSite = usagePageSites.find(function (site) { var _a; return site.id === ((_a = props.selectedSite) === null || _a === void 0 ? void 0 : _a.id); }) || usagePageSites[0];
    var handleUsageSortChange = React.useCallback(function (field) {
        if (usageSortField === field) {
            setUsageSortDirection(function (current) { return (current === 'ascending' ? 'descending' : 'ascending'); });
            return;
        }
        setUsageSortField(field);
        setUsageSortDirection(field === 'skills' ? 'descending' : 'ascending');
    }, [usageSortField]);
    return (React.createElement("div", { className: styles.root },
        React.createElement("div", { className: styles.header },
            React.createElement(react_components_1.Text, { size: 600, weight: "semibold" }, "Awesome SharePoint Skills Factory"),
            React.createElement(react_components_1.Body1, null, "Create. Discover. Understand.")),
        React.createElement("div", { className: styles.toolbar },
            React.createElement(react_components_1.TabList, { selectedValue: props.activeTab, onTabSelect: function (_, data) { return props.onTabChange(data.value); } },
                React.createElement(react_components_1.Tab, { value: "my-skills" }, "My Skills"),
                React.createElement(react_components_1.Tab, { value: "all-skills" }, "All Skills"),
                React.createElement(react_components_1.Tab, { value: "usage" }, "Usage")),
            React.createElement("div", { className: styles.filters },
                React.createElement(react_components_1.Field, { className: styles.filterField, label: "Search", orientation: "horizontal" },
                    React.createElement(react_components_1.Input, { value: props.searchText, onChange: function (_, data) { return props.onSearchTextChange(data.value); }, placeholder: "Search skills" })),
                React.createElement(react_components_1.Field, { className: styles.filterField, label: "Search sites", orientation: "horizontal" },
                    React.createElement(react_components_1.Input, { value: props.siteSearchText, onChange: function (_, data) { return props.onSiteSearchTextChange(data.value); }, placeholder: "Search sites..." })),
                React.createElement(react_components_1.Button, { appearance: "secondary", icon: React.createElement(react_icons_1.ArrowCollapseAll24Regular, null), onClick: props.onCollapseToInline }, "Collapse"))),
        props.activeTab === 'my-skills' ? (React.createElement("div", { className: styles.fullWidthBody },
            React.createElement(react_components_1.Card, { className: styles.summaryCardCompact },
                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "My skills") }),
                React.createElement(react_components_1.Text, { size: 700, weight: "semibold", className: styles.summaryValue }, props.mySkills.length)),
            React.createElement("div", { className: styles.skillDetailsBody },
                React.createElement("div", { className: styles.fullWidthBody },
                    React.createElement(SkillCards_1.default, { skills: props.mySkills, currentUserName: props.currentUserName, selectedSkillId: (_a = props.selectedSkill) === null || _a === void 0 ? void 0 : _a.id, onSelectSkill: props.onSelectSkill })),
                React.createElement(SkillDetailsPanel_1.default, { skill: props.selectedSkill, sites: usageSites, siteCollections: usageCollections, currentUserName: props.currentUserName })))) : null,
        props.activeTab === 'all-skills' ? (React.createElement("div", { className: styles.fullWidthBody },
            React.createElement(react_components_1.Card, { className: styles.summaryCardCompact },
                React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "All skills") }),
                React.createElement(react_components_1.Text, { size: 700, weight: "semibold", className: styles.summaryValue }, props.allSkills.length)),
            React.createElement("div", { className: styles.body },
                React.createElement("div", { className: styles.fullWidthBody },
                    React.createElement(SkillsTable_1.default, { skills: props.allSkills, siteCollections: props.siteCollections, selectedSkillId: (_b = props.selectedSkill) === null || _b === void 0 ? void 0 : _b.id, onSelectSkill: props.onSelectSkill })),
                React.createElement(SkillDetailsPanel_1.default, { skill: props.selectedSkill, sites: usageSites, siteCollections: usageCollections, currentUserName: props.currentUserName })))) : null,
        props.activeTab === 'usage' ? (React.createElement("div", { className: styles.fullWidthBody },
            React.createElement("div", { className: styles.usageSummary },
                React.createElement(react_components_1.Card, { className: styles.summaryCardCompact },
                    React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "SharePoint sites") }),
                    React.createElement(react_components_1.Text, { size: 700, weight: "semibold", className: styles.summaryValue }, filteredSites.length)),
                React.createElement(react_components_1.Card, { className: styles.summaryCardCompact },
                    React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, "Total skills") }),
                    React.createElement(react_components_1.Text, { size: 700, weight: "semibold", className: styles.summaryValue }, props.allSkills.length))),
            React.createElement(react_components_1.Card, null,
                React.createElement(SitesTable_1.default, { sites: usagePageSites, skills: props.allSkills, selectedSiteId: selectedSite === null || selectedSite === void 0 ? void 0 : selectedSite.id, onSelectSite: props.onSelectSite, sortField: usageSortField, sortDirection: usageSortDirection, onSortChange: handleUsageSortChange }),
                React.createElement("div", { className: styles.toolbar, style: { marginTop: react_components_1.tokens.spacingVerticalS } },
                    React.createElement(react_components_1.Body1, null,
                        "Page ",
                        safeUsagePage,
                        " of ",
                        usagePageCount),
                    React.createElement("div", { className: styles.filters },
                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: safeUsagePage <= 1, onClick: function () { return setUsagePage(function (page) { return Math.max(1, page - 1); }); } }, "Previous"),
                        React.createElement(react_components_1.Button, { appearance: "secondary", disabled: safeUsagePage >= usagePageCount, onClick: function () { return setUsagePage(function (page) { return Math.min(usagePageCount, page + 1); }); } }, "Next")))))) : null));
}
//# sourceMappingURL=SkillsFactoryDashboard.js.map