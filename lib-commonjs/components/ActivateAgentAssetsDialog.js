"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ActivateAgentAssetsDialog;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var react_components_1 = require("@fluentui/react-components");
var useStyles = (0, react_components_1.makeStyles)({
    error: {
        color: react_components_1.tokens.colorPaletteRedForeground1
    }
});
function ActivateAgentAssetsDialog(props) {
    var styles = useStyles();
    return (React.createElement(react_components_1.Dialog, { open: props.open, onOpenChange: function (_, data) { if (!data.open && !props.isActivating) {
            props.onCancel();
        } } },
        React.createElement(react_components_1.DialogSurface, null,
            React.createElement(react_components_1.DialogBody, null,
                React.createElement(react_components_1.DialogTitle, null, "Agent Assets library not found"),
                React.createElement(react_components_1.DialogContent, null,
                    React.createElement(react_components_1.Body1, null,
                        "The Agent Assets library was not found on ",
                        props.siteUrl || 'the selected site',
                        ". Would you like to activate the Agent Assets feature on that site collection now?"),
                    props.isActivating ? React.createElement(react_components_1.Spinner, { label: "Activating feature\u2026" }) : null,
                    props.error ? React.createElement(react_components_1.Body1, { className: styles.error }, props.error) : null),
                React.createElement(react_components_1.DialogActions, null,
                    React.createElement(react_components_1.Button, { appearance: "secondary", disabled: props.isActivating, onClick: props.onCancel }, "Cancel"),
                    React.createElement(react_components_1.Button, { appearance: "primary", disabled: props.isActivating, onClick: props.onConfirm }, props.isActivating ? 'Activating…' : 'Activate feature'))))));
}
//# sourceMappingURL=ActivateAgentAssetsDialog.js.map