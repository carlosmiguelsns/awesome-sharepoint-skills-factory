"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InlineSkillsList;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var dateHelpers_1 = require("../../utils/dateHelpers");
var AUTO_DESCRIPTION_PREFIX = 'Skill discovered from ';
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
    title: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    description: {
        color: react_components_1.tokens.colorNeutralForeground3,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
    },
    metaRow: {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: react_components_1.tokens.spacingHorizontalM,
        rowGap: react_components_1.tokens.spacingVerticalXXS,
        marginTop: react_components_1.tokens.spacingVerticalXXS
    },
    metaItem: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: react_components_1.tokens.spacingHorizontalXXS,
        color: react_components_1.tokens.colorNeutralForeground3
    }
});
function InlineSkillsList(props) {
    var styles = useStyles();
    return (React.createElement("div", { className: styles.list }, props.skills.map(function (skill, index) {
        var ownerName = skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner;
        var hasRealDescription = Boolean(skill.description) && skill.description.indexOf(AUTO_DESCRIPTION_PREFIX) !== 0;
        return (React.createElement("button", { key: skill.id, type: "button", className: "".concat(styles.row, " ").concat(index === 0 ? styles.rowTop : ''), onClick: function () { return props.onSelectSkill(skill.id); } },
            React.createElement("span", { className: "".concat(styles.iconWrap, " ").concat(index === 0 ? styles.iconWrapTop : ''), "aria-hidden": "true" },
                React.createElement(react_icons_1.Sparkle24Regular, null)),
            React.createElement("div", { className: styles.content },
                React.createElement("div", { className: styles.headerLine },
                    React.createElement(react_components_1.Text, { weight: "semibold", className: styles.title }, skill.name)),
                hasRealDescription ? React.createElement(react_components_1.Body1, { className: styles.description }, skill.description) : null,
                React.createElement("div", { className: styles.metaRow },
                    React.createElement(react_components_1.Caption1, { className: styles.metaItem },
                        React.createElement(react_icons_1.Person16Regular, null),
                        " ",
                        ownerName),
                    React.createElement(react_components_1.Caption1, { className: styles.metaItem },
                        React.createElement(react_icons_1.Board16Regular, null),
                        " Used in ",
                        skill.usageCount,
                        " site",
                        skill.usageCount === 1 ? '' : 's'),
                    React.createElement(react_components_1.Caption1, { className: styles.metaItem },
                        React.createElement(react_icons_1.CalendarLtr16Regular, null),
                        " Updated ",
                        (0, dateHelpers_1.formatRelativeDate)(skill.skillMarkdownModifiedDate || skill.modifiedDate)),
                    skill.knowledgeSources.length ? (React.createElement(react_components_1.Caption1, { className: styles.metaItem },
                        React.createElement(react_icons_1.DocumentMultiple16Regular, null),
                        " ",
                        skill.knowledgeSources.join(' · '))) : null))));
    })));
}
//# sourceMappingURL=InlineSkillsList.js.map