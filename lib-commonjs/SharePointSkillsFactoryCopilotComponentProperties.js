"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var propertiesSchema = zod_1.z.object({
    inputQuery: zod_1.z.string().optional().describe('Natural language query that drives the initial inline experience.')
});
exports.default = propertiesSchema.toJSONSchema();
//# sourceMappingURL=SharePointSkillsFactoryCopilotComponentProperties.js.map