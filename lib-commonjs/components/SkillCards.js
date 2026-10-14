"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SkillCards;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var react_icons_1 = require("@fluentui/react-icons");
var useStyles = (0, react_components_1.makeStyles)({
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: react_components_1.tokens.spacingHorizontalM
    },
    card: {},
    cardClickable: {
        cursor: 'pointer',
        transition: 'box-shadow 100ms ease, transform 100ms ease',
        ':hover': {
            boxShadow: react_components_1.tokens.shadow4,
            transform: 'translateY(-1px)'
        },
        ':focus-visible': {
            outline: "2px solid ".concat(react_components_1.tokens.colorStrokeFocus2),
            outlineOffset: '2px'
        }
    },
    cardSelected: {
        backgroundColor: react_components_1.tokens.colorSubtleBackgroundSelected,
        borderLeft: "3px solid ".concat(react_components_1.tokens.colorBrandStroke1),
        position: 'relative'
    },
    selectedIcon: {
        position: 'absolute',
        top: react_components_1.tokens.spacingVerticalS,
        right: react_components_1.tokens.spacingHorizontalS,
        color: react_components_1.tokens.colorPaletteGreenForeground1
    },
    description: {
        marginTop: react_components_1.tokens.spacingVerticalXS
    }
});
function SkillCards(props) {
    var styles = useStyles();
    var isClickable = typeof props.onSelectSkill === 'function';
    return (React.createElement("div", { className: styles.grid }, props.skills.map(function (skill) {
        var isSelected = props.selectedSkillId === skill.id;
        return (React.createElement(react_components_1.Card, { key: skill.id, className: "".concat(styles.card, " ").concat(isClickable ? styles.cardClickable : '', " ").concat(isSelected ? styles.cardSelected : ''), onClick: isClickable ? function () { var _a; return (_a = props.onSelectSkill) === null || _a === void 0 ? void 0 : _a.call(props, skill.id); } : undefined },
            isSelected ? React.createElement(react_icons_1.CheckmarkCircle24Filled, { className: styles.selectedIcon }) : null,
            React.createElement(react_components_1.CardHeader, { header: React.createElement(react_components_1.Text, { weight: "semibold" }, skill.name), description: React.createElement(react_components_1.Body1, null, skill.description) }),
            React.createElement(react_components_1.Body1, { className: styles.description },
                "Created by ",
                skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner),
            React.createElement(react_components_1.Body1, { className: styles.description }, skill.knowledgeSources.join(' · '))));
    })));
}
//# sourceMappingURL=SkillCards.js.map