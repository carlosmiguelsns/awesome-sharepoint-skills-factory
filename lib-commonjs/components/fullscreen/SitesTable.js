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
        borderBottom: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2)
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
    siteName: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    }
});
function SitesTable(props) {
    var styles = useStyles();
    var skillCountForSite = React.useCallback(function (siteId) { return props.skills.filter(function (skill) { return skill.siteIds.indexOf(siteId) !== -1; }).length; }, [props.skills]);
    var sortIconFor = React.useCallback(function (field) {
        if (props.sortField !== field) {
            return React.createElement(react_icons_1.ChevronUpDown24Regular, null);
        }
        return props.sortDirection === 'ascending' ? React.createElement(react_icons_1.ChevronUp24Regular, null) : React.createElement(react_icons_1.ChevronDown24Regular, null);
    }, [props.sortDirection, props.sortField]);
    return (React.createElement("table", { className: styles.table },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('site'), onClick: function () { return props.onSortChange('site'); } }, "Site")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('url'), onClick: function () { return props.onSortChange('url'); } }, "URL")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('collection'), onClick: function () { return props.onSortChange('collection'); } }, "Site collection")),
                React.createElement("th", { className: styles.headerCell, style: { textAlign: 'right' } },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('skills'), onClick: function () { return props.onSortChange('skills'); } }, "Skills")))),
        React.createElement("tbody", null, props.sites.map(function (site) {
            var isSelected = props.selectedSiteId === site.id;
            return (React.createElement("tr", { key: site.id, className: "".concat(styles.row, " ").concat(isSelected ? styles.selectedRow : ''), onClick: function () { return props.onSelectSite(site.id); } },
                React.createElement("td", { className: styles.cell },
                    React.createElement("div", { className: styles.siteName },
                        React.createElement(react_components_1.Text, { weight: "semibold" }, site.name),
                        React.createElement(react_components_1.Body1, null, site.description))),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Caption1, null, site.webUrl || site.url)),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Caption1, null, site.siteCollectionName || '—')),
                React.createElement("td", { className: styles.cell, style: { textAlign: 'right' } },
                    React.createElement(react_components_1.Badge, { appearance: "outline", color: "informative" }, skillCountForSite(site.id)))));
        }))));
}
//# sourceMappingURL=SitesTable.js.map