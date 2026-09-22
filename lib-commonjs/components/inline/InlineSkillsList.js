"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InlineSkillsList;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var useStyles = (0, react_components_1.makeStyles)({
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalS
    },
    row: {
        border: "1px solid ".concat(react_components_1.tokens.colorNeutralStroke2),
        borderRadius: react_components_1.tokens.borderRadiusLarge,
        backgroundColor: react_components_1.tokens.colorNeutralBackground1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: react_components_1.tokens.spacingHorizontalM,
        padding: react_components_1.tokens.spacingVerticalM,
        textAlign: 'left',
        width: '100%',
        '&:hover': {
            transform: 'translateY(-1px)',
            backgroundColor: react_components_1.tokens.colorNeutralBackground2
        },
        '&:focus-visible': {
            outline: "2px solid ".concat(react_components_1.tokens.colorStrokeFocus2),
            outlineOffset: '2px'
        }
    },
    rowTop: {
        backgroundColor: react_components_1.tokens.colorBrandBackground2
    },
    iconWrap: {
        width: '36px',
        height: '36px',
        borderRadius: react_components_1.tokens.borderRadiusCircular,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        backgroundColor: react_components_1.tokens.colorNeutralBackground3,
        color: react_components_1.tokens.colorBrandForeground1
    },
    iconWrapTop: {
        backgroundColor: react_components_1.tokens.colorBrandBackground2
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: react_components_1.tokens.spacingVerticalXXS,
        minWidth: 0,
        flexGrow: 1
    },
    headerLine: {
        display: 'flex',
        alignItems: 'center',
        gap: react_components_1.tokens.spacingHorizontalXS,
        minWidth: 0
    },
    source: {
        color: react_components_1.tokens.colorNeutralForeground3
    },
    description: {
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function InlineSkillsList(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.list }, props.skills.map(function (skill, index) { return (React.createElement("button", { key: skill.id, type: "button", className: "".concat(styles.row, " ").concat(index === 0 ? styles.rowTop : ''), onClick: function () { return props.onSelectSkill(skill.id); } },
        React.createElement("span", { className: "".concat(styles.iconWrap, " ").concat(index === 0 ? styles.iconWrapTop : ''), "aria-hidden": "true" },
            React.createElement(react_icons_1.Sparkle24Regular, null)),
        React.createElement("div", { className: styles.content },
            React.createElement("div", { className: styles.headerLine },
                React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name),
                index === 0 ? React.createElement(react_components_1.Caption1, { className: styles.source }, "Top skill") : null),
            React.createElement(react_components_1.Body1, { className: styles.description }, skill.description),
            React.createElement(react_components_1.Caption1, { className: styles.source }, skill.knowledgeSources.length ? "Source: ".concat(skill.knowledgeSources.join(' · ')) : 'Source unavailable')))); })));
}
//# sourceMappingURL=InlineSkillsList.js.map