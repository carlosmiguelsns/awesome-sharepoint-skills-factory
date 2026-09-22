import { z } from 'zod';

// The component no longer relies on a natural-language input query; it always shows the
// signed-in user's own skills inline, with the full experience available via "Expand".
const propertiesSchema = z.object({});

export type ISharePointSkillsFactoryCopilotComponentProperties = z.infer<typeof propertiesSchema>;

export default propertiesSchema.toJSONSchema();
