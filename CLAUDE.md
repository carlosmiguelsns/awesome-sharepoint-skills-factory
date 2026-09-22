# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An SPFx 1.24 (beta) **Copilot component** ("Awesome SharePoint Skills Factory") that runs inside the SharePoint Copilot Workbench. It lets users browse SharePoint "Skills" (markdown-defined agent skill files stored in an `Agent Assets` document library per site), see who owns them, see where they're used across the tenant, and create new skills. It renders in two Copilot host display modes: `inline` (compact, current user's top skills) and `fullscreen` (full tabbed dashboard).

Node engine is pinned: `>=22.14.0 <23.0.0`.

## Commands

```bash
npm install       # install deps
npm start         # heft start --clean — local dev server (SPFx workbench), serves on https://localhost:4321
npm run build      # heft test --clean --production && heft package-solution --production — full production build + .sppkg package
npm run clean      # heft clean
```

There is no dedicated `lint` or `test` npm script; `npm run build` runs `heft test` (which runs lint + any Jest specs) as part of the production build. There are currently no test files (`*.test.ts(x)`/`*.spec.ts(x)`) in `src/`.

To open the running component during local dev, load the Copilot Workbench in the target tenant:
```
https://{tenantDomain}/_layouts/15/copilotworkbench.aspx
```
The dev workbench initial page is configured in `config/serve.json`.

## Architecture

### Entry point and host contract

`src/SharePointSkillsFactoryCopilotComponent.tsx` is the SPFx `BaseCopilotComponent` entry point (from `@microsoft/sp-copilot-component`). It bridges SPFx context (page user, `spHttpClient`, `msGraphClientFactory`, host display mode) into a plain React tree rooted at `SkillsFactoryApp`. It has no business logic — all data loading and view state live in `SkillsFactoryApp`.

`src/SharePointSkillsFactoryCopilotComponentProperties.ts` defines the component's Copilot tool `propertiesSchema` via `zod` (currently an empty schema — the component takes no NL input parameters; it just always shows the signed-in user's own skills, with more surfaced via "Expand"). This is referenced from `src/SharePointSkillsFactoryCopilotComponent.manifest.json`, which declares the component's Copilot tool metadata and its two supported display modes (`inline`, `fullscreen`).

`config/copilot-agent.json` registers the component's GUID as a tool for a declarative Copilot agent, and `copilot/` holds the standalone declarative agent manifest/instructions (`declarativeAgent.json`, `manifest.json`, `ai-plugin.json`, `instruction.txt`) used when the app is also packaged as a Teams/M365 Copilot agent (see `teams/*.zip`).

### App shell and data flow

`src/components/SkillsFactoryApp.tsx` is the top-level app component. On mount it loads skills and sites **in parallel** (`Promise.all`) via `SkillService` and `SiteService`, tracks a discovery progress counter while Graph site pagination completes, and derives `siteCollections` from the loaded sites. It owns all cross-cutting UI state (search text, active dashboard tab, selected skill) and switches between `InlineSkillsView` and `SkillsFactoryDashboard` based on `hostContext.displayMode`.

Two independent, parallel data-loading paths exist and are **not yet unified**:
- `SkillService` → `TenantSharePointDataService`: discovers tenant sites via Graph *itself* (private `getTenantSitesAsync`), then walks each site's `Agent Assets/skills/*/SKILL.md` files over the SharePoint REST API (`spHttpClient`) to build `Skill[]`. Also handles `createSkill` (creates the skill folder + `SKILL.md` via SharePoint REST `Folders/add` / `Files/add`).
- `SiteService` → `GraphSiteService`: discovers tenant sites via Graph (`GET /sites?search=*`, paginated via `@odata.nextLink`) to build the `SharePointSite[]` list used for the Usage/Sites views.

Both services independently call `GET /sites?search=*` and paginate — there's duplicated site-discovery and URL-normalization logic between `TenantSharePointDataService`'s private helpers and `src/utils/siteHelpers.ts`. Be aware of this when touching site discovery so both paths stay consistent.

### Graph site discovery

- Uses the **delegated-safe** `GET /sites?search=*` endpoint, not `GET /sites/getAllSites` (that one is app-only and unsupported in the delegated SPFx Graph client context).
- Always paginate via `@odata.nextLink` until exhausted (see `toGraphApiPath` in `GraphSiteService.ts` for turning a full nextLink URL back into a relative Graph API path).
- `GraphSiteService.isVisibleSite` filters out non-content sites (content storage, app catalog, OneDrive/"personal", the Viva Engage answers group) — extend this filter rather than re-filtering downstream.
- Requires the delegated Graph permission `Sites.Read.All`, declared in `config/package-solution.json` under `webApiPermissionRequests` and requiring tenant admin consent.
- If Graph access is unavailable, discovery returns an empty array rather than falling back to an unscoped/elevated path — preserve this behavior; don't silently broaden permissions to work around a missing consent.

### Skill markdown format

Skills are plain markdown files named `SKILL.md`, one per folder under `<site>/Agent Assets/skills/<skill-folder>/`. `TenantSharePointDataService` parses them with lightweight regex, not a markdown parser:
- Title: `title: ...` front-matter-style line, falling back to the first `# heading`.
- Sections (`description:`, `owner:`, `instructions:`, `knowledge:`, `suggested prompts:`) are read via `readSection()`, which captures everything until the next `Word:` line and treats `-`/`*` prefixed lines as list items.
- Skills discovered across multiple sites with the same normalized title (`normalizeKey`) are merged into one `Skill`, accumulating `siteIds`/`siteCollectionIds` — `usageCount` is derived from the number of distinct sites, not an explicit counter.

When creating a skill (`createSkillAsync`), folder/file names are derived from `normalizeSkillFolderName` in `src/utils/textHelpers.ts` (lowercase, `-`-separated, alphanumeric only); it throws if the sanitized name has no letters/numbers, and throws if a folder with that name already exists under `skills/`.

### Components

- `src/components/inline/` — compact inline view (`InlineSkillsView` header + `InlineSkillsList`), shown when `hostContext.displayMode === 'inline'`. Has an "Expand" link that calls `onRequestFullscreen` (→ `BaseCopilotComponent.requestDisplayModeAsync('fullscreen')`).
- `src/components/fullscreen/` — `SkillsFactoryDashboard` (tabbed shell: My Skills / All Skills / Usage, search, create-skill flyout, `SkillDetailsPanel`), plus `SkillsTable` and `SitesTable` for the tabular views.
- `src/components/SkillCards.tsx` — shared skill card rendering used by both inline and fullscreen views.
- Theming: Fluent UI v9 (`@fluentui/react-components`). Components pick `webDarkTheme`/`webLightTheme` from `hostContext.theme` and wrap output in `FluentProvider` + `IdPrefixProvider value="sharepoint-skills-factory-"` (keep this prefix — it namespaces generated Fluent element IDs so they don't collide with the rest of the host page).

### Models

`src/models/skillModels.ts` (re-exported via `src/models/index.ts`) defines `Skill`, `SharePointSite`, `SiteCollection` — the shared vocabulary used across services and components. Most fields are optional because sites/skills are progressively enriched as different Graph/REST calls resolve (basic site info first, then Agent Assets library detection, then per-skill markdown parsing).

## Repo layout quirks

- `src/` is the only source of truth for hand-written code (TypeScript/TSX).
- `lib/`, `dist/`, `temp/`, `solution/`, `node_modules/`, `.npm-cache/` are gitignored build output.
- **`lib-commonjs/` and `release/` are NOT gitignored and are committed to the repo** — they're compiled/bundled output (webpack bundle + manifests under `release/`, CommonJS transpile under `lib-commonjs/`). Do not hand-edit files under these directories; regenerate them with `npm run build` / `npm start` instead, and expect them to show as diffs when `src/` changes. `release/assets/*.hot-update.*` files are dev-server HMR artifacts — safe to ignore/delete, not meaningful build output.
- `sharepoint/solution/` holds the packaged `.sppkg` and its unpacked debug manifest/feature XML for local sideloading.
- `config/package-solution.json` is the canonical place for solution metadata, feature IDs, and Graph permission requests.
