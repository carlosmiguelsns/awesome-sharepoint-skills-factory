"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDOM = tslib_1.__importStar(require("react-dom"));
var sp_copilot_component_1 = require("@microsoft/sp-copilot-component");
var SkillsFactoryApp_1 = tslib_1.__importDefault(require("./components/SkillsFactoryApp"));
var SharePointSkillsFactoryCopilotComponent = /** @class */ (function (_super) {
    tslib_1.__extends(SharePointSkillsFactoryCopilotComponent, _super);
    function SharePointSkillsFactoryCopilotComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SharePointSkillsFactoryCopilotComponent.prototype.render = function () {
        var _this = this;
        var _a, _b, _c;
        var currentUserName = ((_a = this.context.pageContext.user) === null || _a === void 0 ? void 0 : _a.displayName) || '';
        var currentUserEmail = ((_b = this.context.pageContext.user) === null || _b === void 0 ? void 0 : _b.email) || ((_c = this.context.pageContext.user) === null || _c === void 0 ? void 0 : _c.loginName) || '';
        ReactDOM.render(React.createElement(SkillsFactoryApp_1.default, {
            hostContext: this.hostContext,
            spHttpClient: this.context.spHttpClient,
            msGraphClientFactory: this.context.msGraphClientFactory,
            siteUrl: this.context.pageContext.web.absoluteUrl,
            currentUserName: currentUserName,
            currentUserEmail: currentUserEmail,
            targetDocument: this.context.domElement.ownerDocument,
            onRequestFullscreen: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.requestDisplayModeAsync('fullscreen')];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }
        }), this.context.domElement);
    };
    SharePointSkillsFactoryCopilotComponent.prototype.onHostContextChanged = function (_diff) {
        // The React tree re-renders automatically with the updated host context.
    };
    SharePointSkillsFactoryCopilotComponent.prototype.onTeardown = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                ReactDOM.unmountComponentAtNode(this.context.domElement);
                return [2 /*return*/];
            });
        });
    };
    return SharePointSkillsFactoryCopilotComponent;
}(sp_copilot_component_1.BaseCopilotComponent));
exports.default = SharePointSkillsFactoryCopilotComponent;
//# sourceMappingURL=SharePointSkillsFactoryCopilotComponent.js.map