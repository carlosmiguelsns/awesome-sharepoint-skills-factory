"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InlineSkillsList;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var useStyles = (0, react_components_1.makeStyles)({
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS
    },
    row: {
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusMedium,
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: react_components_1.tokens.spacingHorizontalM,
        padding: react_components_1.tokens.spacingVerticalS,
        textAlign: 'left',
        width: '100%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS,
        minWidth: 0,
        flexGrow: 1
    },
    arrow: {
        color: react_components_1.tokens.colorNeutralForeground3,
        flexShrink: 0
    },
    meta: {
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function InlineSkillsList(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.list }, props.skills.map(function (skill) { return (React.createElement("button", { key: skill.id, type: "button", className: styles.row, onClick: function () {
            props.onSelectSkill(skill.id);
            props.onExpand();
        } },
        React.createElement("div", { className: styles.content },
            React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name),
            React.createElement(react_components_1.Body1, null, skill.description)),
        React.createElement(react_components_1.Text, { className: styles.arrow, weight: "semibold" }, ">"))); })));
}
//# sourceMappingURL=InlineSkillsList.js.map