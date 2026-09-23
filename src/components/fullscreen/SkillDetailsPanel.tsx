import * as React from 'react';

import {
  Body1,
  Button,
  Card,
  CardHeader,
  Caption1,
  Checkbox,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  Link,
  Text,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import type { SharePointSite, SiteCollection, Skill, SkillSiteRevision } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';
import SkillCompareDialog from './SkillCompareDialog';

const useStyles = makeStyles({
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
  metadataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: tokens.spacingVerticalS
  },
  siteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: tokens.spacingVerticalS
  },
  metaCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  metaLabel: {
    color: tokens.colorNeutralForeground3
  },
  metaValue: {
    overflowWrap: 'anywhere'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS
  },
  siteItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  siteLink: {
    color: tokens.colorBrandForegroundLink,
    textDecorationLine: 'none',
    ':hover': {
      textDecorationLine: 'underline'
    }
  },
  metaGrid: {
    display: 'grid',
    gap: tokens.spacingVerticalL
  },
  sourceLine: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  sourceMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  siteCard: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM
  },
  siteCardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    paddingBottom: tokens.spacingVerticalXS,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
  },
  siteMetaGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  siteMetaValue: {
    display: 'block',
    lineHeight: tokens.lineHeightBase300
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
  compareCheckbox: {
    alignSelf: 'flex-start'
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
  currentUserName: string;
}

export default function SkillDetailsPanel(props: ISkillDetailsPanelProps): React.ReactElement {
  const styles = useStyles();
  const skill: Skill | undefined = props.skill;
  const [previewSiteId, setPreviewSiteId] = React.useState<string | undefined>(undefined);
  const [compareSiteIds, setCompareSiteIds] = React.useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    setPreviewSiteId(undefined);
    setCompareSiteIds([]);
    setIsCompareOpen(false);
  }, [skill?.id]);

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

  if (!skill) {
    return (
      <Card>
        <CardHeader header={<Text weight="semibold">Skill details</Text>} description={<Body1>Select a skill to inspect its usage.</Body1>} />
      </Card>
    );
  }

  const skillSites: SharePointSite[] = props.sites.filter((site: SharePointSite) => skill.siteIds.indexOf(site.id) !== -1);
  const siteCollectionForSite = React.useCallback(
    (site: SharePointSite): SiteCollection | undefined => props.siteCollections.find((collection: SiteCollection) => collection.id === site.siteCollectionId),
    [props.siteCollections]
  );
  return (
    <Card>
      <CardHeader
        header={<Text weight="semibold">{skill.name}</Text>}
        description={<Body1>{skill.description}</Body1>}
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

      {compareSiteIds.length === 2 ? (
        <SkillCompareDialog
          open={isCompareOpen}
          onOpenChange={setIsCompareOpen}
          skill={skill}
          siteA={skillSites.find((site: SharePointSite) => site.id === compareSiteIds[0]) as SharePointSite}
          siteB={skillSites.find((site: SharePointSite) => site.id === compareSiteIds[1]) as SharePointSite}
        />
      ) : null}

      <div className={styles.root}>
        <div className={styles.section}>
          <div className={styles.sitesSectionHeader}>
            <Caption1>Sites where this skill exists</Caption1>
            {skillSites.length > 1 ? (
              <Button appearance="secondary" size="small" disabled={compareSiteIds.length !== 2} onClick={() => setIsCompareOpen(true)}>
                Compare selected sites
              </Button>
            ) : null}
          </div>
          <div className={styles.siteGrid}>
            {skillSites.map((site: SharePointSite) => {
              const siteCollection: SiteCollection | undefined = siteCollectionForSite(site);
              const isSelectedForCompare: boolean = compareSiteIds.indexOf(site.id) !== -1;
              const revision: SkillSiteRevision | undefined = revisionForSite(site.id);
              return (
                <Card key={site.id} className={styles.siteCard}>
                  <div className={styles.siteCardHeader}>
                    <Text weight="semibold">{site.name}</Text>
                    <Caption1>{siteCollection?.name || site.siteCollectionName || 'Site collection'}</Caption1>
                  </div>

                  {skillSites.length > 1 ? (
                    <Checkbox
                      className={styles.compareCheckbox}
                      checked={isSelectedForCompare}
                      disabled={!isSelectedForCompare && compareSiteIds.length >= 2}
                      label="Select to compare"
                      onChange={(_, data) => toggleCompareSite(site.id, Boolean(data.checked))}
                    />
                  ) : null}

                  <div className={styles.metaGrid}>
                    <div className={styles.siteMetaGroup}>
                      <Caption1 className={styles.metaLabel}>Folder</Caption1>
                      <Body1 className={styles.siteMetaValue}>
                        <Link href={revision?.skillFolderUrl || skill.skillFolderUrl || siteCollection?.url || site.url} target="_blank" rel="noreferrer">
                          {revision?.skillFolderName || skill.skillFolderName || 'Open folder'}
                        </Link>
                      </Body1>
                      <Caption1>Created {(revision?.skillFolderCreatedDate || skill.skillFolderCreatedDate) ? formatLongDate((revision?.skillFolderCreatedDate || skill.skillFolderCreatedDate) as string) : '—'}</Caption1>
                      <Caption1>Modified {(revision?.skillFolderModifiedDate || skill.skillFolderModifiedDate) ? formatLongDate((revision?.skillFolderModifiedDate || skill.skillFolderModifiedDate) as string) : '—'}</Caption1>
                    </div>

                    <div className={styles.siteMetaGroup}>
                      <Caption1 className={styles.metaLabel}>Skill file</Caption1>
                      <Body1 className={styles.siteMetaValue}>
                        <Link onClick={() => setPreviewSiteId(site.id)}>
                          {revision?.skillMarkdownFileName || skill.skillMarkdownFileName || 'SKILL.md'}
                        </Link>
                      </Body1>
                      <Caption1>Creator {skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner}</Caption1>
                      <Caption1>Created {(revision?.skillMarkdownCreatedDate || skill.skillMarkdownCreatedDate) ? formatLongDate((revision?.skillMarkdownCreatedDate || skill.skillMarkdownCreatedDate) as string) : '—'}</Caption1>
                      <Caption1>Modified {(revision?.skillMarkdownModifiedDate || skill.skillMarkdownModifiedDate) ? formatLongDate((revision?.skillMarkdownModifiedDate || skill.skillMarkdownModifiedDate) as string) : '—'}</Caption1>
                      <Caption1>Size {formatBytes(revision?.skillMarkdownSize ?? skill.skillMarkdownSize)}</Caption1>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
