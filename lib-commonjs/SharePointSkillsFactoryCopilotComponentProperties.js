"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
// The component no longer relies on a natural-language input query; it always shows the
// signed-in user's own skills inline, with the full experience available via "Expand".
var propertiesSchema = zod_1.z.object({});
exports.default = propertiesSchema.toJSONSchema();
//# sourceMappingURL=SharePointSkillsFactoryCopilotComponentProperties.js.map