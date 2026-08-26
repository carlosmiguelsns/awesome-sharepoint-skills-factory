# Awesome SharePoint Skills Factory

Create. Discover. Understand.

SPFx 1.24 Copilot Component POC for exploring SharePoint Skills and where they are used across SharePoint.

## What it does

- **Inline**: compact **My Skills** view with the top 5 skills used
- **Full-width**: dashboard for all skills, usage, and SharePoint sites
- Search/filter skills and sites
- Inspect skill details and site usage
- Discover tenant sites through Microsoft Graph

## Architecture

- `src/components/inline` - inline layout
- `src/components/fullscreen` - full-width dashboard
- `src/models` - skill, site, usage, and blueprint models
- `src/services` - Graph/SharePoint data services
- `src/utils` - date/text/site helpers

## Graph site discovery

The solution uses the SPFx Graph client and a delegated-safe site search flow:

- **Primary API**: `GET /sites?search=*`
- **Why not `GET /sites/getAllSites`?** That endpoint is app-only only and is not supported from the delegated SPFx Graph client context.
- **Pagination**: follows `@odata.nextLink` until all pages are loaded
- **Permission requested**: `Sites.Read.All` via `config/package-solution.json`

## Permissions

The app requests delegated Microsoft Graph permission:

```json
{
  "resource": "Microsoft Graph",
  "scope": "Sites.Read.All"
}
```

Admin consent is still required in the tenant.

## Switching data sources

- Sites/site collections: `GraphSiteService`
- Tenant skills from **Agent Assets** libraries: `TenantSharePointDataService`

If Graph access is unavailable, the site service returns an empty result rather than bypassing the security model.

## Run and debug

```bash
npm install
npm start
```

Open the Copilot Workbench in your tenant:

`https://{tenantDomain}/_layouts/15/copilotworkbench.aspx`

Package for deployment:

```bash
npm run build
```
