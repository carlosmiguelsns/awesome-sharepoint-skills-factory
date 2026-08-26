"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SitesTable;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var useStyles = (0, react_components_1.makeStyles)({
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    headerCell: {
        textAlign: 'left',
        padding: "".concat(react_components_1.tokens.spacingVerticalXS, " ").concat(react_components_1.tokens.spacingHorizontalS),
        borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        whiteSpace: 'nowrap'
    },
    row: {
        cursor: 'pointer',
        borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2)
    },
    selectedRow: {
        backgroundColor: react_components_1.tokens.colorNeutralBackground3
    },
    cell: {
        padding: "".concat(react_components_1.tokens.spacingVerticalS, " ").concat(react_components_1.tokens.spacingHorizontalS),
        verticalAlign: 'top'
    },
    expandCell: {
        width: '1%',
        paddingRight: 0
    },
    siteName: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    },
    detailsRow: {
        backgroundColor: react_components_1.tokens.colorNeutralBackground2
    },
    detailsCell: {
        padding: "".concat(react_components_1.tokens.spacingVerticalM, " ").concat(react_components_1.tokens.spacingHorizontalL),
        borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2)
    },
    detailsHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: react_components_1.tokens.spacingHorizontalS,
        marginBottom: react_components_1.tokens.spacingVerticalS
    },
    skillsWrap: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: react_components_1.tokens.spacingHorizontalXS,
        marginTop: react_components_1.tokens.spacingVerticalS
    },
    muted: {
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function SitesTable(props) {
    var styles = useStyles();
    var _a = React.useState(new Set()), expandedSiteIds = _a[0], setExpandedSiteIds = _a[1];
    var skillsForSite = React.useCallback(function (siteId) { return props.skills.filter(function (skill) { return skill.siteIds.indexOf(siteId) !== -1; }); }, [props.skills]);
    var skillCountForSite = React.useCallback(function (siteId) { return skillsForSite(siteId).length; }, [skillsForSite]);
    var sortIconFor = React.useCallback(function (field) {
        if (props.sortField !== field) {
            return React.createElement(react_icons_1.ChevronUpDown24Regular, null);
        }
        return props.sortDirection === 'ascending' ? React.createElement(react_icons_1.ChevronUp24Regular, null) : React.createElement(react_icons_1.ChevronDown24Regular, null);
    }, [props.sortDirection, props.sortField]);
    var toggleExpanded = React.useCallback(function (siteId) {
        setExpandedSiteIds(function (current) {
            var next = new Set(current);
            if (next.has(siteId)) {
                next.delete(siteId);
            }
            else {
                next.add(siteId);
            }
            return next;
        });
    }, []);
    React.useEffect(function () {
        if (!props.selectedSiteId) {
            return;
        }
        setExpandedSiteIds(function (current) {
            if (current.has(props.selectedSiteId)) {
                return current;
            }
            var next = new Set(current);
            next.add(props.selectedSiteId);
            return next;
        });
    }, [props.selectedSiteId]);
    return (React.createElement("table", { className: styles.table },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: "".concat(styles.headerCell, " ").concat(styles.expandCell) }),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('site'), onClick: function () { return props.onSortChange('site'); } }, "Site")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('collection'), onClick: function () { return props.onSortChange('collection'); } }, "Site collection")),
                React.createElement("th", { className: styles.headerCell, style: { textAlign: 'right' } },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('skills'), onClick: function () { return props.onSortChange('skills'); } }, "Skills")))),
        React.createElement("tbody", null, props.sites.map(function (site) {
            var isSelected = props.selectedSiteId === site.id;
            var isExpanded = expandedSiteIds.has(site.id);
            var siteSkills = skillsForSite(site.id);
            return (React.createElement(React.Fragment, { key: site.id },
                React.createElement("tr", { className: "".concat(styles.row, " ").concat(isSelected ? styles.selectedRow : ''), onClick: function () { return props.onSelectSite(site.id); } },
                    React.createElement("td", { className: "".concat(styles.cell, " ").concat(styles.expandCell) },
                        React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: isExpanded ? React.createElement(react_icons_1.ChevronDown24Regular, null) : React.createElement(react_icons_1.ChevronRight24Regular, null), onClick: function (event) {
                                event.stopPropagation();
                                toggleExpanded(site.id);
                            }, "aria-label": "".concat(isExpanded ? 'Collapse' : 'Expand', " ").concat(site.name) })),
                    React.createElement("td", { className: styles.cell },
                        React.createElement("div", { className: styles.siteName },
                            React.createElement(react_components_1.Text, { weight: "semibold" }, site.name),
                            React.createElement(react_components_1.Caption1, null, site.webUrl || site.url))),
                    React.createElement("td", { className: styles.cell },
                        React.createElement(react_components_1.Caption1, null, site.siteCollectionName || '—')),
                    React.createElement("td", { className: styles.cell, style: { textAlign: 'right' } },
                        React.createElement(react_components_1.Badge, { appearance: "outline", color: "informative" }, skillCountForSite(site.id)))),
                isExpanded ? (React.createElement("tr", { className: styles.detailsRow },
                    React.createElement("td", { className: styles.detailsCell, colSpan: 4 },
                        React.createElement("div", { className: styles.detailsHeader },
                            React.createElement(react_components_1.Text, { weight: "semibold" }, "Skills on this site"),
                            React.createElement(react_components_1.Caption1, { className: styles.muted },
                                siteSkills.length,
                                " matching skill",
                                siteSkills.length === 1 ? '' : 's')),
                        siteSkills.length ? (React.createElement("div", { className: styles.skillsWrap }, siteSkills.map(function (skill) { return (React.createElement(react_components_1.Badge, { key: skill.id, appearance: "filled" }, skill.name)); }))) : (React.createElement(react_components_1.Body1, { className: styles.muted }, "No skills found for this site."))))) : null));
        }))));
}
//# sourceMappingURL=SitesTable.js.map