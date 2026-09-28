import * as React from 'react';

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Checkbox,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Input,
  Link,
  Spinner,
  Text,
  makeStyles,
  mergeClasses,
  tokens,
  type TableColumnDefinition
} from '@fluentui/react-components';
import { Delete24Regular, Dismiss24Regular, DocumentCopy24Regular, Search24Regular } from '@fluentui/react-icons';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import type { SharePointSite, SiteCollection, Skill, SkillSiteRevision } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';
import type { ICreateSkillRequest, ICreateSkillResult } from '../../services/TenantSharePointDataService';
import SkillCompareDialog from './SkillCompareDialog';

const SITES_PAGE_SIZE: number = 8;

const useStyles = makeStyles({
  card: {
    boxShadow: 'none'
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  metaLabel: {
    color: tokens.colorNeutralForeground3
  },
  siteMetaGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0
  },
  siteMetaValue: {
    display: 'block',
    lineHeight: tokens.lineHeightBase300
  },
  truncate: {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%'
  },
  sitesToolbar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  sitesSearch: {
    flex: '1 1 240px',
    minWidth: '200px',
    maxWidth: '360px'
  },
  sitesGridCard: {
    overflow: 'hidden',
    boxShadow: 'none'
  },
  sitesGrid: {
    width: '100%'
  },
  sitesEmpty: {
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalM
  },
  sitesPagination: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  compareCheckbox: {
    margin: 0
  },
  previewDialogSurface: {
    maxWidth: '90vw',
    width: 'min(1100px, 90vw)'
  },
  previewSurface: {
    maxHeight: '65vh',
    overflow: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium
  },
  previewEmpty: {
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalM
  },
  sitesSectionHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS
  },
  deleteError: {
    color: tokens.colorPaletteRedForeground1
  },
  deleteConfirmButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorPaletteRedForeground2
  },
  cloneField: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  select: {
    minHeight: '32px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    font: 'inherit'
  }
});

function formatBytes(size?: number): string {
  if (!size || size <= 0) {
    return '—';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  const units: string[] = ['KB', 'MB', 'GB'];
  let value: number = size / 1024;
  let unitIndex: number = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

export interface ISkillDetailsPanelProps {
  skill?: Skill;
  sites: SharePointSite[];
  siteCollections: SiteCollection[];
  onClose?: () => void;
  onDeleteSkillSite: (site: SharePointSite, skillFolderUrl: string) => Promise<void>;
  onCreateSkill: (request: ICreateSkillRequest) => Promise<ICreateSkillResult>;
}

interface IDeleteTarget {
  site: SharePointSite;
  skillFolderUrl: string;
}

interface ICloneSource {
  site: SharePointSite;
  skillContent: string;
}

export default function SkillDetailsPanel(props: ISkillDetailsPanelProps): React.ReactElement {
  const styles = useStyles();
  const skill: Skill | undefined = props.skill;
  const [previewSiteId, setPreviewSiteId] = React.useState<string | undefined>(undefined);
  const [compareSiteIds, setCompareSiteIds] = React.useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = React.useState<boolean>(false);
  const [siteSearchText, setSiteSearchText] = React.useState<string>('');
  const [sitePage, setSitePage] = React.useState<number>(1);
  const [deleteTarget, setDeleteTarget] = React.useState<IDeleteTarget | undefined>(undefined);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [deleteError, setDeleteError] = React.useState<string>('');
  const [cloneSource, setCloneSource] = React.useState<ICloneSource | undefined>(undefined);
  const [cloneTargetCollectionId, setCloneTargetCollectionId] = React.useState<string | undefined>(undefined);
  const [isCloning, setIsCloning] = React.useState<boolean>(false);
  const [cloneStatus, setCloneStatus] = React.useState<string>('');
  const [cloneError, setCloneError] = React.useState<string>('');

  React.useEffect(() => {
    setPreviewSiteId(undefined);
    setCompareSiteIds([]);
    setIsCompareOpen(false);
    setSiteSearchText('');
    setSitePage(1);
    setDeleteTarget(undefined);
    setDeleteError('');
    setCloneSource(undefined);
    setCloneTargetCollectionId(undefined);
    setCloneError('');
  }, [skill?.id]);

  const handleConfirmDelete = React.useCallback(async (): Promise<void> => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setDeleteError('');
    try {
      await props.onDeleteSkillSite(deleteTarget.site, deleteTarget.skillFolderUrl);
      setDeleteTarget(undefined);
    } catch (error: unknown) {
      setDeleteError(error instanceof Error ? error.message : 'Failed to delete the skill.');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, props]);

  const revisionForSite = React.useCallback(
    (siteId: string): SkillSiteRevision | undefined => (skill?.siteRevisions || []).find((revision: SkillSiteRevision) => revision.siteId === siteId),
    [skill]
  );

  const toggleCompareSite = React.useCallback((siteId: string, checked: boolean): void => {
    setCompareSiteIds((current: string[]) => {
      if (checked) {
        return current.indexOf(siteId) !== -1 || current.length >= 2 ? current : [...current, siteId];
      }

      return current.filter((id: string) => id !== siteId);
    });
  }, []);

  const siteCollectionForSite = React.useCallback(
    (site: SharePointSite): SiteCollection | undefined => props.siteCollections.find((collection: SiteCollection) => collection.id === site.siteCollectionId),
    [props.siteCollections]
  );

  const resolveSiteForCollection = React.useCallback(
    (collectionId: string): SharePointSite | undefined => {
      const candidates: SharePointSite[] = props.sites.filter((site: SharePointSite) => site.siteCollectionId === collectionId);
      const collection: SiteCollection | undefined = props.siteCollections.find((item: SiteCollection) => item.id === collectionId);
      const rootSite: SharePointSite | undefined = candidates.find(
        (site: SharePointSite) => site.url.replace(/\/$/, '') === (collection?.url || '').replace(/\/$/, '')
      );
      return rootSite || candidates[0];
    },
    [props.sites, props.siteCollections]
  );

  const cloneTargetCollections: SiteCollection[] = React.useMemo(
    () => (skill ? props.siteCollections.filter((collection: SiteCollection) => skill.siteCollectionIds.indexOf(collection.id) === -1) : []),
    [props.siteCollections, skill]
  );

  const handleConfirmClone = React.useCallback(async (): Promise<void> => {
    if (!cloneSource || !cloneTargetCollectionId || !skill) {
      return;
    }

    const targetSite: SharePointSite | undefined = resolveSiteForCollection(cloneTargetCollectionId);
    if (!targetSite) {
      setCloneError('Could not resolve a destination site for that site collection.');
      return;
    }

    setIsCloning(true);
    setCloneError('');
    try {
      setCloneStatus('Copying skill…');
      await props.onCreateSkill({
        siteUrl: targetSite.url,
        skillName: skill.name,
        skillContent: cloneSource.skillContent,
        onProgress: (message: string) => setCloneStatus(message)
      });
      setCloneSource(undefined);
      setCloneTargetCollectionId(undefined);
    } catch (error: unknown) {
      setCloneError(error instanceof Error ? error.message : 'Failed to copy the skill.');
    } finally {
      setIsCloning(false);
    }
  }, [cloneSource, cloneTargetCollectionId, props, resolveSiteForCollection, skill]);

  const skillSites: SharePointSite[] = React.useMemo(
    () => (skill ? props.sites.filter((site: SharePointSite) => skill.siteIds.indexOf(site.id) !== -1) : []),
    [props.sites, skill]
  );

  const filteredSkillSites: SharePointSite[] = React.useMemo(() => {
    const needle: string = siteSearchText.trim().toLowerCase();
    if (!needle) {
      return skillSites;
    }

    return skillSites.filter((site: SharePointSite) => {
      const collectionName: string = siteCollectionForSite(site)?.name || site.siteCollectionName || '';
      return [site.name, site.webUrl, site.url, collectionName].filter(Boolean).join(' ').toLowerCase().indexOf(needle) !== -1;
    });
  }, [siteCollectionForSite, siteSearchText, skillSites]);

  const sitesPageCount: number = Math.max(1, Math.ceil(filteredSkillSites.length / SITES_PAGE_SIZE));
  const safeSitesPage: number = Math.min(sitePage, sitesPageCount);
  const pagedSkillSites: SharePointSite[] = filteredSkillSites.slice((safeSitesPage - 1) * SITES_PAGE_SIZE, safeSitesPage * SITES_PAGE_SIZE);

  React.useEffect(() => {
    setSitePage(1);
  }, [siteSearchText]);

  const hasCompareColumn: boolean = skillSites.length > 1;
  const columnWidths: Record<string, string> = hasCompareColumn
    ? { compare: '28px', site: '19%', folder: '35%', file: '35%', actions: '84px' }
    : { site: '20%', folder: '36%', file: '36%', actions: '84px' };

  const columns: Array<TableColumnDefinition<SharePointSite>> = React.useMemo(() => {
    const definitions: Array<TableColumnDefinition<SharePointSite>> = [];

    if (hasCompareColumn) {
      definitions.push(
        createTableColumn<SharePointSite>({
          columnId: 'compare',
          renderHeaderCell: () => null,
          renderCell: (site: SharePointSite) => {
            const isSelectedForCompare: boolean = compareSiteIds.indexOf(site.id) !== -1;
            return (
              <Checkbox
                className={styles.compareCheckbox}
                checked={isSelectedForCompare}
                disabled={!isSelectedForCompare && compareSiteIds.length >= 2}
                aria-label={`Select ${site.name} to compare`}
                onChange={(_, data) => toggleCompareSite(site.id, Boolean(data.checked))}
              />
            );
          }
        })
      );
    }

    definitions.push(
      createTableColumn<SharePointSite>({
        columnId: 'site',
        renderHeaderCell: () => 'Site',
        renderCell: (site: SharePointSite) => <Text weight="semibold" title={site.name} className={styles.truncate}>{site.name}</Text>
      }),
      createTableColumn<SharePointSite>({
        columnId: 'folder',
        renderHeaderCell: () => 'Folder',
        renderCell: (site: SharePointSite) => {
          const siteCollection: SiteCollection | undefined = siteCollectionForSite(site);
          const revision: SkillSiteRevision | undefined = revisionForSite(site.id);
          const folderName: string = revision?.skillFolderName || skill?.skillFolderName || 'Open folder';
          const folderCreatedDate: string | undefined = revision?.skillFolderCreatedDate || skill?.skillFolderCreatedDate;
          const folderModifiedDate: string | undefined = revision?.skillFolderModifiedDate || skill?.skillFolderModifiedDate;
          const folderMeta = `Created ${folderCreatedDate ? formatLongDate(folderCreatedDate) : '—'} · Modified ${folderModifiedDate ? formatLongDate(folderModifiedDate) : '—'}`;
          return (
            <div className={styles.siteMetaGroup}>
              <Link
                className={styles.truncate}
                title={folderName}
                href={revision?.skillFolderUrl || skill?.skillFolderUrl || siteCollection?.url || site.url}
                target="_blank"
                rel="noreferrer"
              >
                {folderName}
              </Link>
              <Caption1 className={mergeClasses(styles.metaLabel, styles.truncate)} title={folderMeta}>{folderMeta}</Caption1>
            </div>
          );
        }
      }),
      createTableColumn<SharePointSite>({
        columnId: 'file',
        renderHeaderCell: () => 'Skill file',
        renderCell: (site: SharePointSite) => {
          const revision: SkillSiteRevision | undefined = revisionForSite(site.id);
          const fileName: string = revision?.skillMarkdownFileName || skill?.skillMarkdownFileName || 'SKILL.md';
          const fileModifiedDate: string | undefined = revision?.skillMarkdownModifiedDate || skill?.skillMarkdownModifiedDate;
          const fileMeta = `Modified ${fileModifiedDate ? formatLongDate(fileModifiedDate) : '—'} · ${formatBytes(revision?.skillMarkdownSize ?? skill?.skillMarkdownSize)}`;
          return (
            <div className={styles.siteMetaGroup}>
              <Link className={styles.truncate} title={fileName} onClick={() => setPreviewSiteId(site.id)}>
                {fileName}
              </Link>
              <Caption1 className={mergeClasses(styles.metaLabel, styles.truncate)} title={fileMeta}>{fileMeta}</Caption1>
            </div>
          );
        }
      }),
      createTableColumn<SharePointSite>({
        columnId: 'actions',
        renderHeaderCell: () => null,
        renderCell: (site: SharePointSite) => {
          const revision: SkillSiteRevision | undefined = revisionForSite(site.id);
          const skillFolderUrl: string | undefined = revision?.skillFolderUrl;
          const skillContent: string | undefined = revision?.rawContent;
          return (
            <>
              <Button
                appearance="subtle"
                size="small"
                icon={<DocumentCopy24Regular />}
                aria-label={`Copy skill from ${site.name} to another site collection`}
                disabled={!skillContent || !cloneTargetCollections.length}
                onClick={() => skillContent && setCloneSource({ site, skillContent })}
              />
              <Button
                appearance="subtle"
                size="small"
                icon={<Delete24Regular />}
                aria-label={`Delete skill from ${site.name}`}
                disabled={!skillFolderUrl}
                onClick={() => skillFolderUrl && setDeleteTarget({ site, skillFolderUrl })}
              />
            </>
          );
        }
      })
    );

    return definitions;
  }, [cloneTargetCollections.length, compareSiteIds, hasCompareColumn, revisionForSite, siteCollectionForSite, skill, styles, toggleCompareSite]);

  if (!skill) {
    return (
      <Card className={styles.card}>
        <CardHeader
          header={<Text weight="semibold">Skill details</Text>}
          description={<Body1>Select a skill to inspect its usage.</Body1>}
          action={props.onClose ? <Button appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close skill details" onClick={props.onClose} /> : undefined}
        />
      </Card>
    );
  }

  const compareSiteA: SharePointSite | undefined = skillSites.find((site: SharePointSite) => site.id === compareSiteIds[0]);
  const compareSiteB: SharePointSite | undefined = skillSites.find((site: SharePointSite) => site.id === compareSiteIds[1]);

  return (
    <Card className={styles.card}>
      <CardHeader
        header={<Text weight="semibold">{skill.name}</Text>}
        action={props.onClose ? <Button appearance="subtle" icon={<Dismiss24Regular />} aria-label="Close skill details" onClick={props.onClose} /> : undefined}
      />

      <Dialog open={previewSiteId !== undefined} onOpenChange={(_, data) => setPreviewSiteId(data.open ? previewSiteId : undefined)}>
        <DialogSurface className={styles.previewDialogSurface}>
          <DialogBody>
            <DialogTitle>{(previewSiteId ? revisionForSite(previewSiteId)?.skillMarkdownFileName : undefined) || skill.skillMarkdownFileName || 'SKILL.md'}</DialogTitle>
            <DialogContent>
              {previewSiteId && revisionForSite(previewSiteId)?.rawContent ? (
                <div className={styles.previewSurface}>
                  <Viewer key={previewSiteId} initialValue={revisionForSite(previewSiteId)?.rawContent} />
                </div>
              ) : (
                <Body1 className={styles.previewEmpty}>No content available to preview for this skill.</Body1>
              )}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setPreviewSiteId(undefined)}>Close</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {compareSiteA && compareSiteB ? (
        <SkillCompareDialog open={isCompareOpen} onOpenChange={setIsCompareOpen} skill={skill} siteA={compareSiteA} siteB={compareSiteB} />
      ) : null}

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(_, data) => { if (!data.open && !isDeleting) { setDeleteTarget(undefined); setDeleteError(''); } }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Delete this skill?</DialogTitle>
            <DialogContent>
              {isDeleting ? (
                <Spinner label="Deleting the skill folder and its contents…" />
              ) : (
                <>
                  <Body1>
                    This permanently deletes the “{skill.name}” skill folder from <strong>{deleteTarget?.site.name}</strong> - including SKILL.md and everything else inside the folder. This can’t be undone.
                  </Body1>
                  <Body1>Only Site Collection Administrators or SharePoint Admins for this site can do this.</Body1>
                </>
              )}
              {deleteError ? <Body1 className={styles.deleteError}>{deleteError}</Body1> : null}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" disabled={isDeleting} onClick={() => { setDeleteTarget(undefined); setDeleteError(''); }}>
                Cancel
              </Button>
              <Button className={styles.deleteConfirmButton} disabled={isDeleting} onClick={() => { void handleConfirmDelete(); }}>
                {isDeleting ? 'Deleting…' : 'Delete skill'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={Boolean(cloneSource)} onOpenChange={(_, data) => { if (!data.open && !isCloning) { setCloneSource(undefined); setCloneTargetCollectionId(undefined); setCloneError(''); } }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Copy skill to another site collection</DialogTitle>
            <DialogContent>
              {isCloning ? (
                <Spinner label={cloneStatus || 'Copying skill…'} />
              ) : (
                <>
                  <Body1>
                    Copies the “{skill.name}” SKILL.md content from <strong>{cloneSource?.site.name}</strong> into a new skill folder in the site collection you choose below.
                  </Body1>
                  {cloneTargetCollections.length ? (
                    <label className={styles.cloneField}>
                      <Text weight="semibold">Destination site collection</Text>
                      <select
                        className={styles.select}
                        value={cloneTargetCollectionId || ''}
                        onChange={(event) => setCloneTargetCollectionId(event.target.value || undefined)}
                      >
                        <option value="">Select a site collection</option>
                        {cloneTargetCollections.map((collection: SiteCollection) => (
                          <option key={collection.id} value={collection.id}>
                            {collection.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <Body1 className={styles.metaLabel}>This skill already exists in every discovered site collection.</Body1>
                  )}
                </>
              )}
              {cloneError ? <Body1 className={styles.deleteError}>{cloneError}</Body1> : null}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" disabled={isCloning} onClick={() => { setCloneSource(undefined); setCloneTargetCollectionId(undefined); setCloneError(''); }}>
                Cancel
              </Button>
              <Button appearance="primary" disabled={isCloning || !cloneTargetCollectionId} onClick={() => { void handleConfirmClone(); }}>
                {isCloning ? 'Copying…' : 'Copy skill'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <div className={styles.root}>
        <div className={styles.section}>
          <div className={styles.sitesSectionHeader}>
            <Caption1>
              Sites where this skill exists ({skillSites.length})
            </Caption1>
            {skillSites.length > 1 ? (
              <Button appearance="secondary" size="small" disabled={!compareSiteA || !compareSiteB} onClick={() => setIsCompareOpen(true)}>
                Compare selected sites{compareSiteIds.length ? ` (${compareSiteIds.length}/2)` : ''}
              </Button>
            ) : null}
          </div>

          {skillSites.length > SITES_PAGE_SIZE ? (
            <div className={styles.sitesToolbar}>
              <Input
                className={styles.sitesSearch}
                contentBefore={<Search24Regular />}
                value={siteSearchText}
                onChange={(_, data) => setSiteSearchText(data.value)}
                placeholder="Search sites or site collections"
              />
              <Caption1 className={styles.metaLabel}>
                Showing {pagedSkillSites.length} of {filteredSkillSites.length}
              </Caption1>
            </div>
          ) : null}

          <Card className={styles.sitesGridCard}>
            {filteredSkillSites.length ? (
              <DataGrid className={styles.sitesGrid} items={pagedSkillSites} columns={columns} getRowId={(site: SharePointSite) => site.id}>
                <DataGridHeader>
                  <DataGridRow>
                    {({ renderHeaderCell, columnId }) => (
                      <DataGridHeaderCell
                        style={
                          columnId === 'compare' || columnId === 'actions'
                            ? { width: columnWidths[columnId as string], padding: 0 }
                            : { width: columnWidths[columnId as string], paddingLeft: tokens.spacingHorizontalM, paddingRight: tokens.spacingHorizontalM }
                        }
                      >
                        {renderHeaderCell()}
                      </DataGridHeaderCell>
                    )}
                  </DataGridRow>
                </DataGridHeader>
                <DataGridBody<SharePointSite>>
                  {({ item, rowId }) => (
                    <DataGridRow<SharePointSite> key={rowId}>
                      {({ renderCell, columnId }) => (
                        <DataGridCell
                          style={
                            columnId === 'compare' || columnId === 'actions'
                              ? { width: columnWidths[columnId as string], padding: 0, justifyContent: 'center' }
                              : { width: columnWidths[columnId as string], paddingLeft: tokens.spacingHorizontalM, paddingRight: tokens.spacingHorizontalM }
                          }
                        >
                          {renderCell(item)}
                        </DataGridCell>
                      )}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>
            ) : (
              <Body1 className={styles.sitesEmpty}>No sites match your search.</Body1>
            )}
          </Card>

          {sitesPageCount > 1 ? (
            <div className={styles.sitesPagination}>
              <Body1>Page {safeSitesPage} of {sitesPageCount}</Body1>
              <div className={styles.sitesToolbar}>
                <Button appearance="secondary" size="small" disabled={safeSitesPage <= 1} onClick={() => setSitePage((page) => Math.max(1, page - 1))}>
                  Previous
                </Button>
                <Button appearance="secondary" size="small" disabled={safeSitesPage >= sitesPageCount} onClick={() => setSitePage((page) => Math.min(sitesPageCount, page + 1))}>
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
