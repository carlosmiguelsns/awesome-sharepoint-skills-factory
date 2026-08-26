import * as React from 'react';

import { Body1, Card, CardHeader, Caption1, Link, Text, makeStyles, tokens } from '@fluentui/react-components';

import type { SharePointSite, SiteCollection, Skill } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';

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

      <div className={styles.root}>
        <div className={styles.section}>
          <Caption1>Sites where this skill exists</Caption1>
          <div className={styles.siteGrid}>
            {skillSites.map((site: SharePointSite) => {
              const siteCollection: SiteCollection | undefined = siteCollectionForSite(site);
              return (
                <Card key={site.id} className={styles.siteCard}>
                  <div className={styles.siteCardHeader}>
                    <Text weight="semibold">{site.name}</Text>
                    <Caption1>{siteCollection?.name || site.siteCollectionName || 'Site collection'}</Caption1>
                  </div>

                  <div className={styles.metaGrid}>
                    <div className={styles.siteMetaGroup}>
                      <Caption1 className={styles.metaLabel}>Folder</Caption1>
                      <Body1 className={styles.siteMetaValue}>
                        <Link href={skill.skillFolderUrl || siteCollection?.url || site.url} target="_blank" rel="noreferrer">
                          {skill.skillFolderName || 'Open folder'}
                        </Link>
                      </Body1>
                      <Caption1>Created {skill.skillFolderCreatedDate ? formatLongDate(skill.skillFolderCreatedDate) : '—'}</Caption1>
                      <Caption1>Modified {skill.skillFolderModifiedDate ? formatLongDate(skill.skillFolderModifiedDate) : '—'}</Caption1>
                    </div>

                    <div className={styles.siteMetaGroup}>
                      <Caption1 className={styles.metaLabel}>Skill file</Caption1>
                      <Body1 className={styles.siteMetaValue}>
                        <Link href={skill.skillMarkdownUrl || skill.sourceDocumentUrl || site.url} target="_blank" rel="noreferrer">
                          {skill.skillMarkdownFileName || 'SKILL.md'}
                        </Link>
                      </Body1>
                      <Caption1>Creator {skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner}</Caption1>
                      <Caption1>Created {skill.skillMarkdownCreatedDate ? formatLongDate(skill.skillMarkdownCreatedDate) : '—'}</Caption1>
                      <Caption1>Modified {skill.skillMarkdownModifiedDate ? formatLongDate(skill.skillMarkdownModifiedDate) : '—'}</Caption1>
                      <Caption1>Size {formatBytes(skill.skillMarkdownSize)}</Caption1>
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
