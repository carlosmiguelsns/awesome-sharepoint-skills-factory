"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillsTable;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var dateHelpers_1 = require("../../utils/dateHelpers");
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
    skillName: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    }
});
function SkillsTable(props) {
    var styles = useStyles();
    var _a = React.useState('skill'), sortField = _a[0], setSortField = _a[1];
    var _b = React.useState('ascending'), sortDirection = _b[0], setSortDirection = _b[1];
    var getOwnerName = React.useCallback(function (skill) { return (skill.isOwnedByCurrentUser ? props.currentUserName || skill.owner : skill.owner); }, [props.currentUserName]);
    var getModifiedByName = React.useCallback(function (skill) { return (skill.isOwnedByCurrentUser ? props.currentUserName || skill.owner : skill.owner); }, [props.currentUserName]);
    var sortedSkills = React.useMemo(function () {
        var items = props.skills.slice();
        var compareText = function (left, right) { return left.localeCompare(right, undefined, { sensitivity: 'base' }); };
        items.sort(function (left, right) {
            var comparison = 0;
            if (sortField === 'skill') {
                comparison = compareText(left.name, right.name);
            }
            else if (sortField === 'owner') {
                comparison = compareText(getOwnerName(left), getOwnerName(right));
            }
            else if (sortField === 'created') {
                comparison = compareText(left.skillMarkdownCreatedDate || left.createdDate, right.skillMarkdownCreatedDate || right.createdDate);
            }
            else if (sortField === 'modifiedBy') {
                comparison = compareText(getModifiedByName(left), getModifiedByName(right));
            }
            else {
                comparison = compareText(left.skillMarkdownModifiedDate || left.modifiedDate, right.skillMarkdownModifiedDate || right.modifiedDate);
            }
            return sortDirection === 'ascending' ? comparison : -comparison;
        });
        return items;
    }, [getOwnerName, props.skills, sortDirection, sortField]);
    var requestSort = React.useCallback(function (field) {
        if (sortField === field) {
            setSortDirection(function (current) { return (current === 'ascending' ? 'descending' : 'ascending'); });
            return;
        }
        setSortField(field);
        setSortDirection(field === 'modifiedDate' ? 'descending' : 'ascending');
    }, [sortField]);
    var sortIconFor = React.useCallback(function (field) {
        if (sortField !== field) {
            return React.createElement(react_icons_1.ChevronUpDown24Regular, null);
        }
        return sortDirection === 'ascending' ? React.createElement(react_icons_1.ChevronUp24Regular, null) : React.createElement(react_icons_1.ChevronDown24Regular, null);
    }, [sortDirection, sortField]);
    return (React.createElement("table", { className: styles.table },
        React.createElement("thead", null,
            React.createElement("tr", null,
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('skill'), onClick: function () { return requestSort('skill'); } }, "Skill")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('owner'), onClick: function () { return requestSort('owner'); } }, "Owner")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('created'), onClick: function () { return requestSort('created'); } }, "Created Date")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('modifiedBy'), onClick: function () { return requestSort('modifiedBy'); } }, "Modified by")),
                React.createElement("th", { className: styles.headerCell },
                    React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor('modifiedDate'), onClick: function () { return requestSort('modifiedDate'); } }, "Modified date")))),
        React.createElement("tbody", null, sortedSkills.map(function (skill) {
            var isSelected = props.selectedSkillId === skill.id;
            return (React.createElement("tr", { key: skill.id, className: "".concat(styles.row, " ").concat(isSelected ? styles.selectedRow : ''), onClick: function () { return props.onSelectSkill(skill.id); } },
                React.createElement("td", { className: styles.cell },
                    React.createElement("div", { className: styles.skillName },
                        React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name),
                        React.createElement(react_components_1.Body1, null, skill.description))),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Persona, { name: getOwnerName(skill), secondaryText: skill.isOwnedByCurrentUser ? 'Current user' : 'Skill owner', size: "small" })),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Caption1, null, (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownCreatedDate || skill.createdDate))),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Caption1, null, getModifiedByName(skill))),
                React.createElement("td", { className: styles.cell },
                    React.createElement(react_components_1.Caption1, null, (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownModifiedDate || skill.modifiedDate)))));
        }))));
}
//# sourceMappingURL=SkillsTable.js.map