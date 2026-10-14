"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillsTable;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var dateHelpers_1 = require("../../utils/dateHelpers");
var useStyles = (0, react_components_1.makeStyles)({
    grid: {
        width: '100%'
    },
    headerRow: {
        backgroundColor: react_components_1.tokens.colorNeutralBackground2
    },
    row: {
        cursor: 'pointer',
        ':hover': {
            backgroundColor: react_components_1.tokens.colorSubtleBackgroundHover
        }
    },
    skillName: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS
    }
});
// Deliberately omits `idealWidth`: Fluent's column resizing treats an explicit idealWidth as
// authoritative and re-applies it whenever the `columns` array is recreated (e.g. on every
// re-render), which would wipe out any width the user drags. Leaving it unset lets the resize
// state fall back to the user's last dragged width instead.
var SKILLS_TABLE_COLUMN_SIZING_OPTIONS = {
    skill: { minWidth: 160, defaultWidth: 240 },
    owner: { minWidth: 140, defaultWidth: 180 },
    created: { minWidth: 120, defaultWidth: 150 },
    modifiedBy: { minWidth: 140, defaultWidth: 160 },
    modifiedDate: { minWidth: 120, defaultWidth: 150 },
    sites: { minWidth: 80, defaultWidth: 100 }
};
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
    var sortHeaderButton = React.useCallback(function (field, label) { return (React.createElement(react_components_1.Button, { appearance: "subtle", size: "small", icon: sortIconFor(field), onClick: function () { return requestSort(field); } }, label)); }, [requestSort, sortIconFor]);
    var columns = React.useMemo(function () { return [
        (0, react_components_1.createTableColumn)({
            columnId: 'skill',
            renderHeaderCell: function () { return sortHeaderButton('skill', 'Skill'); },
            renderCell: function (skill) { return (React.createElement("div", { className: styles.skillName },
                React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name))); }
        }),
        (0, react_components_1.createTableColumn)({
            columnId: 'owner',
            renderHeaderCell: function () { return sortHeaderButton('owner', 'Owner'); },
            renderCell: function (skill) { return (React.createElement(react_components_1.Persona, { name: getOwnerName(skill), secondaryText: skill.isOwnedByCurrentUser ? 'Current user' : 'Skill owner', size: "small" })); }
        }),
        (0, react_components_1.createTableColumn)({
            columnId: 'created',
            renderHeaderCell: function () { return sortHeaderButton('created', 'Created Date'); },
            renderCell: function (skill) { return React.createElement(react_components_1.Caption1, null, (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownCreatedDate || skill.createdDate)); }
        }),
        (0, react_components_1.createTableColumn)({
            columnId: 'modifiedBy',
            renderHeaderCell: function () { return sortHeaderButton('modifiedBy', 'Modified by'); },
            renderCell: function (skill) { return React.createElement(react_components_1.Caption1, null, getModifiedByName(skill)); }
        }),
        (0, react_components_1.createTableColumn)({
            columnId: 'modifiedDate',
            renderHeaderCell: function () { return sortHeaderButton('modifiedDate', 'Modified date'); },
            renderCell: function (skill) { return React.createElement(react_components_1.Caption1, null, (0, dateHelpers_1.formatLongDate)(skill.skillMarkdownModifiedDate || skill.modifiedDate)); }
        }),
        (0, react_components_1.createTableColumn)({
            columnId: 'sites',
            renderHeaderCell: function () { return 'Sites'; },
            renderCell: function (skill) { return (React.createElement(react_components_1.Badge, { appearance: "outline", color: "informative" },
                skill.siteIds.length,
                " ",
                skill.siteIds.length === 1 ? 'site' : 'sites')); }
        })
    ]; }, [getModifiedByName, getOwnerName, sortHeaderButton, styles.skillName]);
    return (React.createElement(react_components_1.DataGrid, { className: styles.grid, items: sortedSkills, columns: columns, getRowId: function (skill) { return skill.id; }, resizableColumns: true, columnSizingOptions: SKILLS_TABLE_COLUMN_SIZING_OPTIONS },
        React.createElement(react_components_1.DataGridHeader, { className: styles.headerRow },
            React.createElement(react_components_1.DataGridRow, null, function (_a) {
                var renderHeaderCell = _a.renderHeaderCell;
                return React.createElement(react_components_1.DataGridHeaderCell, null, renderHeaderCell());
            })),
        React.createElement(react_components_1.DataGridBody, null, function (_a) {
            var item = _a.item, rowId = _a.rowId;
            var isSelected = props.selectedSkillId === item.id;
            return (React.createElement(react_components_1.DataGridRow, { key: rowId, className: styles.row, appearance: isSelected ? 'brand' : 'none', onClick: function () { return props.onSelectSkill(item.id); } }, function (_a) {
                var renderCell = _a.renderCell;
                return React.createElement(react_components_1.DataGridCell, null, renderCell(item));
            }));
        })));
}
//# sourceMappingURL=SkillsTable.js.map