import * as React from 'react';

import {
  Badge,
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
import { Delete24Regular, Dismiss24Regular, DocumentCopy24Regular, Search24Regular, Sparkle24Regular } from '@fluentui/react-icons';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import type { SharePointSite, SiteCollection, Skill, SkillSiteRevision } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';
import { isTeamOrCommunicationSiteTemplate } from '../../utils/siteHelpers';
import { isAgentAssetsLibraryNotFoundError, type ICreateSkillRequest, type ICreateSkillResult } from '../../services/TenantSharePointDataService';
import ActivateAgentAssetsDialog from '../ActivateAgentAssetsDialog';
import SkillCompareDialog from './SkillCompareDialog';

const SITES_PAGE_SIZE: number = 8;

const useStyles = makeStyles({
  card: {
    boxShadow: 'none'
  },
  headerIconTile: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0
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
  sitesGridHeader: {
    backgroundColor: tokens.colorNeutralBackground2
  },
  sitesGridRow: {
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover
    }
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
    backgroundColor: tokens.colorStatusDangerBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
    ':hover': {
      backgroundColor: tokens.colorStatusDangerBackground3Hover,
      color: tokens.colorNeutralForegroundOnBrand
    },
    ':hover:active': {
      backgroundColor: tokens.colorStatusDangerBackground3Pressed,
      color: tokens.colorNeutralForegroundOnBrand
    }
  },
  dialogSpinner: {
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM
  },
  cloneField: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  cloneTargetHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS
  },
  cloneTargetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    maxHeight: '220px',
    overflowY: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS
  },
  cloneResultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  cloneResultError: {
    color: tokens.colorPaletteRedForeground1
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
  onActivateAgentAssetsFeature: (siteUrl: string) => Promise<void>;
}

interface IDeleteTarget {
  site: SharePointSite;
  skillFolderUrl: string;
}

interface ICloneSource {
  site: SharePointSite;
  skillContent: string;
}

interface ICloneTargetResult {
  collectionId: string;
  collectionName: string;
  status: 'success' | 'error';
  message?: string;
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
  const [cloneTargetCollectionIds, setCloneTargetCollectionIds] = React.useState<string[]>([]);
  const [cloneResults, setCloneResults] = React.useState<ICloneTargetResult[]>([]);
  const [isCloning, setIsCloning] = React.useState<boolean>(false);
  const [cloneStatus, setCloneStatus] = React.useState<string>('');
  const [cloneError, setCloneError] = React.useState<string>('');
  const [agentAssetsPromptSiteUrl, setAgentAssetsPromptSiteUrl] = React.useState<string | undefined>(undefined);
  const [isActivatingFeature, setIsActivatingFeature] = React.useState<boolean>(false);
  const [activateError, setActivateError] = React.useState<string>('');

  React.useEffect(() => {
    setPreviewSiteId(undefined);
    setCompareSiteIds([]);
    setIsCompareOpen(false);
    setSiteSearchText('');
    setSitePage(1);
    setDeleteTarget(undefined);
    setDeleteError('');
    setCloneSource(undefined);
    setCloneTargetCollectionIds([]);
    setCloneResults([]);
    setCloneError('');
    setAgentAssetsPromptSiteUrl(undefined);
    setActivateError('');
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
    () =>
      skill
        ? props.siteCollections.filter(
            (collection: SiteCollection) =>
              skill.siteCollectionIds.indexOf(collection.id) === -1 &&
              props.sites.some(
                (site: SharePointSite) => site.siteCollectionId === collection.id && isTeamOrCommunicationSiteTemplate(site.template)
              )
          )
        : [],
    [props.siteCollections, props.sites, skill]
  );

  const toggleCloneTargetCollection = React.useCallback((collectionId: string, checked: boolean): void => {
    setCloneTargetCollectionIds((current: string[]) => {
      if (checked) {
        return current.indexOf(collectionId) !== -1 ? current : [...current, collectionId];
      }

      return current.filter((id: string) => id !== collectionId);
    });
  }, []);

  const handleToggleSelectAllCloneTargets = React.useCallback(
    (checked: boolean): void => {
      setCloneTargetCollectionIds(checked ? cloneTargetCollections.map((collection: SiteCollection) => collection.id) : []);
    },
    [cloneTargetCollections]
  );

  const handleConfirmClone = React.useCallback(async (): Promise<void> => {
    if (!cloneSource || !skill || !cloneTargetCollectionIds.length) {
      return;
    }

    // Only successes are considered "done" — a target that errored (or never got attempted
    // because an earlier target paused the run for Agent Assets activation) is retried.
    const successfulIds: Set<string> = new Set(cloneResults.filter((result: ICloneTargetResult) => result.status === 'success').map((result: ICloneTargetResult) => result.collectionId));
    const pendingCollectionIds: string[] = cloneTargetCollectionIds.filter((id: string) => !successfulIds.has(id));

    if (!pendingCollectionIds.length) {
      return;
    }

    setIsCloning(true);
    setCloneError('');

    const nextResults: ICloneTargetResult[] = cloneResults.filter((result: ICloneTargetResult) => successfulIds.has(result.collectionId));

    for (let index: number = 0; index < pendingCollectionIds.length; index++) {
      const collectionId: string = pendingCollectionIds[index];
      const collection: SiteCollection | undefined = cloneTargetCollections.find((item: SiteCollection) => item.id === collectionId);
      const collectionName: string = collection?.name || 'the selected site collection';
      const targetSite: SharePointSite | undefined = resolveSiteForCollection(collectionId);

      if (!targetSite) {
        nextResults.push({ collectionId, collectionName, status: 'error', message: 'Could not resolve a destination site for that site collection.' });
        continue;
      }

      setCloneStatus(`Copying to ${collectionName} (${nextResults.length + 1}/${cloneTargetCollectionIds.length})…`);

      try {
        await props.onCreateSkill({
          siteUrl: targetSite.url,
          skillName: skill.name,
          skillContent: cloneSource.skillContent,
          onProgress: (message: string) => setCloneStatus(`${collectionName}: ${message}`)
        });
        nextResults.push({ collectionId, collectionName, status: 'success' });
      } catch (error: unknown) {
        if (isAgentAssetsLibraryNotFoundError(error)) {
          setCloneResults(nextResults);
          setCloneStatus('');
          setIsCloning(false);
          setAgentAssetsPromptSiteUrl(error.siteUrl);
          return;
        }

        nextResults.push({ collectionId, collectionName, status: 'error', message: error instanceof Error ? error.message : 'Failed to copy the skill.' });
      }
    }

    setCloneResults(nextResults);
    setCloneStatus('');
    setIsCloning(false);

    if (nextResults.every((result: ICloneTargetResult) => result.status === 'success')) {
      setCloneSource(undefined);
      setCloneTargetCollectionIds([]);
      setCloneResults([]);
    }
  }, [cloneResults, cloneSource, cloneTargetCollectionIds, cloneTargetCollections, props, resolveSiteForCollection, skill]);

  const handleCancelActivateFeature = React.useCallback((): void => {
    setAgentAssetsPromptSiteUrl(undefined);
    setActivateError('');
  }, []);

  const handleConfirmActivateFeature = React.useCallback(async (): Promise<void> => {
    if (!agentAssetsPromptSiteUrl) {
      return;
    }

    setIsActivatingFeature(true);
    setActivateError('');
    try {
      await props.onActivateAgentAssetsFeature(agentAssetsPromptSiteUrl);
      setAgentAssetsPromptSiteUrl(undefined);
      await handleConfirmClone();
    } catch (activationError: unknown) {
      setActivateError(activationError instanceof Error ? activationError.message : 'Failed to activate the Agent Assets feature.');
    } finally {
      setIsActivatingFeature(false);
    }
  }, [agentAssetsPromptSiteUrl, handleConfirmClone, props]);

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
        image={<span className={styles.headerIconTile} aria-hidden="true"><Sparkle24Regular /></span>}
        header={<Text size={400} weight="semibold">{skill.name}</Text>}
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
                <Spinner className={styles.dialogSpinner} label="Deleting the skill folder and its contents…" />
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
              <Button appearance="primary" className={styles.deleteConfirmButton} disabled={isDeleting} onClick={() => { void handleConfirmDelete(); }}>
                {isDeleting ? 'Deleting…' : 'Delete skill'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog open={Boolean(cloneSource)} onOpenChange={(_, data) => { if (!data.open && !isCloning) { setCloneSource(undefined); setCloneTargetCollectionIds([]); setCloneResults([]); setCloneError(''); } }}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Copy skill to other site collections</DialogTitle>
            <DialogContent>
              {isCloning ? (
                <Spinner className={styles.dialogSpinner} label={cloneStatus || 'Copying skill…'} />
              ) : (
                <>
                  <Body1>
                    Copies the “{skill.name}” SKILL.md content from <strong>{cloneSource?.site.name}</strong> into a new skill folder in each site collection you select below.
                  </Body1>
                  {cloneTargetCollections.length ? (
                    <div className={styles.cloneField}>
                      <div className={styles.cloneTargetHeader}>
                        <Text weight="semibold">Destination site collections</Text>
                        <Checkbox
                          label="Select all"
                          checked={cloneTargetCollectionIds.length === cloneTargetCollections.length}
                          onChange={(_, data) => handleToggleSelectAllCloneTargets(Boolean(data.checked))}
                        />
                      </div>
                      <div className={styles.cloneTargetList}>
                        {cloneTargetCollections.map((collection: SiteCollection) => (
                          <Checkbox
                            key={collection.id}
                            label={collection.name}
                            checked={cloneTargetCollectionIds.indexOf(collection.id) !== -1}
                            onChange={(_, data) => toggleCloneTargetCollection(collection.id, Boolean(data.checked))}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Body1 className={styles.metaLabel}>This skill already exists in every discovered site collection.</Body1>
                  )}
                  {cloneResults.length ? (
                    <div className={styles.cloneResultsList} role="status" aria-live="polite">
                      {cloneResults.map((result: ICloneTargetResult) => (
                        <Caption1 key={result.collectionId} className={result.status === 'error' ? styles.cloneResultError : undefined}>
                          <span aria-hidden="true">{result.status === 'success' ? '✓' : '✗'} </span>
                          {result.status === 'success' ? 'Copied' : 'Failed'} to {result.collectionName}
                          {result.message ? `: ${result.message}` : ''}
                        </Caption1>
                      ))}
                    </div>
                  ) : null}
                </>
              )}
              {cloneError ? <Body1 className={styles.deleteError}>{cloneError}</Body1> : null}
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" disabled={isCloning} onClick={() => { setCloneSource(undefined); setCloneTargetCollectionIds([]); setCloneResults([]); setCloneError(''); }}>
                Cancel
              </Button>
              <Button appearance="primary" disabled={isCloning || !cloneTargetCollectionIds.length} onClick={() => { void handleConfirmClone(); }}>
                {isCloning ? 'Copying…' : cloneResults.some((result: ICloneTargetResult) => result.status === 'error') ? 'Retry failed' : 'Copy skill'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <ActivateAgentAssetsDialog
        open={Boolean(agentAssetsPromptSiteUrl)}
        siteUrl={agentAssetsPromptSiteUrl}
        isActivating={isActivatingFeature}
        error={activateError}
        onConfirm={() => { void handleConfirmActivateFeature(); }}
        onCancel={handleCancelActivateFeature}
      />

      <div className={styles.root}>
        <div className={styles.section}>
          <div className={styles.sitesSectionHeader}>
            <Text weight="semibold">
              Sites where this skill exists <Badge appearance="tint" color="informative">{skillSites.length}</Badge>
            </Text>
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
                <DataGridHeader className={styles.sitesGridHeader}>
                  <DataGridRow>
                    {({ renderHeaderCell, columnId }) => (
                      <DataGridHeaderCell
                        aria-label={columnId === 'compare' ? 'Compare' : columnId === 'actions' ? 'Actions' : undefined}
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
                    <DataGridRow<SharePointSite> key={rowId} className={styles.sitesGridRow}>
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
