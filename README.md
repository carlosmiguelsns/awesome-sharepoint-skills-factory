# Awesome SharePoint Skills Factory

Create. Discover. Understand.

A SharePoint Framework (SPFx) 1.24 Copilot component for exploring SharePoint Skills, understanding which skills are owned by a user, and identifying where those skills are used across the tenant.

## Overview

This solution surfaces two complementary experiences:

- Inline mode: a compact, contextual view for the current user
- Fullscreen mode: a tenant-wide dashboard for skill discovery and usage analysis

It combines data from:

- SharePoint Agent Assets / skill libraries
- Microsoft Graph site discovery
- SharePoint site and site collection metadata

## What the app does

### Inline experience

- Shows the current user’s top 5 skills on load, with no chat/message input required
- Understands natural-language requests typed in the Copilot chat, e.g.:
  - "List my top skills used" → top 5 (the default)
  - "Show me my top 3 skills used" → top 3
  - "Show me all my skills" → every skill the user owns
  - "I want to create a new skill" → opens the create-skill form inline, no need to expand
- Offers the same requests as clickable “suggested prompt” pills, so users don’t have to type them
- Clicking a skill row switches to the fullscreen dashboard with that skill’s details/comparison panel already open

### Fullscreen dashboard

- Tabbed views for My Skills, All Skills, and Usage
- Search and filter across skills and sites
- Inspect skill details, owners, knowledge sources, and suggested prompts
- See which sites are using each skill
- Filter by coverage: sites with skills vs. sites without skills
- Sort and paginate site usage tables
- Review summary KPI cards and usage visualizations

### Graph-backed discovery

- Discovers SharePoint sites through Microsoft Graph
- Builds a site collection map and usage relationships
- Normalizes site metadata like hostname, URL, collection name, and owner

## Architecture

The project is organized around clear layers:

- `src/components/inline` – compact inline skill views
- `src/components/fullscreen` – full dashboard and analysis panels
- `src/components/SkillCards.tsx` – reusable skill cards
- `src/components/CreateSkillForm.tsx` – shared create-skill form, embedded both in the inline view and in the fullscreen dashboard's slide-over panel
- `src/components/SkillsFactoryApp.tsx` – app orchestration and loading flow
- `src/models` – skill, site, site collection, and usage models
- `src/services` – Graph, SharePoint, and skill data access
- `src/utils` – helper logic for dates, text, and site parsing

## Natural-language input

The component's Copilot tool declares a small `propertiesSchema` (`src/SharePointSkillsFactoryCopilotComponentProperties.ts`) that Copilot parses from the user's chat message and hands to the component as `this.properties`:

- `intent`: `'listSkills'` or `'createSkill'`
- `skillCount`: an explicit number of skills to show (e.g. "top 3")
- `showAllSkills`: true when the user asks for every skill they own

These drive what the inline view opens with — e.g. "I want to create a new skill" opens the create-skill form inline instead of the skills list, with no need to expand to fullscreen. The inline view also exposes the same set of requests as clickable "suggested prompt" pills (`src/components/inline/SuggestedPromptPills.tsx`) that update the view instantly, without a chat round-trip. With no match, the component defaults to listing the user's top 5 skills.

## Data flow

### Skills

Skills are loaded from SharePoint data sources through `SkillService`, which uses `TenantSharePointDataService` to read tenant skill metadata from the relevant Agent Assets libraries.

### Sites

Sites are loaded through `SiteService` and `GraphSiteService`, which call Microsoft Graph to enumerate sites and follow pagination through `@odata.nextLink` results.

## Graph site discovery

The solution uses a delegated-safe Graph flow instead of the app-only-only site enumeration endpoint:

- Primary API: `GET /sites?search=*`
- Why not `GET /sites/getAllSites`?
  - That endpoint is app-only only
  - It is not supported in the delegated SPFx Graph client context used here
- Pagination: follows `@odata.nextLink` until all pages are loaded
- Results are filtered to practical SharePoint site entries and normalized into reusable models

## Permissions

The app requests delegated Microsoft Graph permission:

```json
{
  "resource": "Microsoft Graph",
  "scope": "Sites.Read.All"
}
```

This permission is declared in the SPFx package manifest and still requires admin consent in the tenant before the app can enumerate sites successfully.

## Security and behavior

- If Graph access is unavailable, site discovery returns an empty result instead of silently bypassing the security model.
- The app intentionally respects delegated permissions and tenant boundaries.
- Skill and site data are only shown if they are resolveable through the current user’s access context.

## Local development

### Prerequisites

- Node.js `>=22.14.0 <23.0.0`
- An SPFx development environment with SharePoint tenant access
- Appropriate Microsoft Graph permissions and tenant admin consent

### Install and run

```bash
npm install
npm start
```

Then open the Copilot Workbench in your tenant:

```text
https://{tenantDomain}/_layouts/15/copilotworkbench.aspx
```

### Build for deployment

```bash
npm run build
```

This produces the package artifacts for deployment to the target SharePoint environment.

## Useful project notes

- The app supports both inline and fullscreen display modes via the SPFx Copilot component host.
- The loading experience tracks discovery progress while Graph site enumeration completes.
- Search and filtering work across skill names, descriptions, owners, suggested prompts, and site metadata.
- The usage dashboard can highlight skill coverage by site and support drill-down exploration of where specific skills are active.
- The inline view understands natural-language intent (list top N / list all / create a new skill) via the tool's `propertiesSchema`, and offers the same actions as clickable suggested-prompt pills.

## Repository structure

```text
src/
  components/
    inline/
    fullscreen/
  models/
  services/
  utils/
config/
  package-solution.json
copilot/
  manifest.json
sharepoint/
  solution/
```

## Summary

This project is a practical proof of concept for bringing SharePoint skill intelligence into the Copilot experience: it helps users discover skills, understand ownership, and identify where those skills are applied across the tenant.

