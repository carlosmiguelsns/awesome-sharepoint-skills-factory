import * as React from 'react';

import { Body1, Button, Card, Link, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ArrowExpandAll24Regular } from '@fluentui/react-icons';

import type { SharePointSite, SiteCollection, Skill } from '../../models';
import InlineSkillsList from './InlineSkillsList';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  helper: {
    color: tokens.colorNeutralForeground3
  },
  usageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  usageItem: {
    padding: tokens.spacingVerticalS
  },
  emptyState: {
    color: tokens.colorNeutralForeground3
  }
});

export interface IInlineSkillsViewProps {
  mode: 'my-skills' | 'skill-usage';
  skills: Skill[];
  selectedSkill?: Skill;
  usageSkillName?: string;
  usageSiteCount?: number;
  sites: SharePointSite[];
  siteCollections: SiteCollection[];
  onSelectSkill: (skillId: string) => void;
  onExpand: () => void;
}

export default function InlineSkillsView(props: IInlineSkillsViewProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Text size={500} weight="semibold">{props.mode === 'skill-usage' ? 'Skill usage' : 'My Skills'}</Text>
          <Body1 className={styles.helper}>
            {props.mode === 'skill-usage'
              ? `Sites using ${props.usageSkillName || 'the requested skill'} (${props.usageSiteCount || 0}).`
              : 'A compact view of your top 5 skills used.'}
          </Body1>
        </div>
        <Button appearance="secondary" icon={<ArrowExpandAll24Regular />} onClick={props.onExpand}>
          Open full screen
        </Button>
      </div>

      {props.mode === 'skill-usage' ? (
        props.sites.length > 0 ? (
          <div className={styles.usageList}>
            {props.sites.map((site: SharePointSite) => (
              <Card key={site.id} className={styles.usageItem}>
                <Text weight="semibold">{site.name}</Text>
                <Body1>
                  <Link href={site.webUrl || site.url} target="_blank" rel="noreferrer">
                    {site.webUrl || site.url}
                  </Link>
                </Body1>
              </Card>
            ))}
          </div>
        ) : (
          <Body1 className={styles.emptyState}>No sites found for this skill.</Body1>
        )
      ) : (
        <InlineSkillsList skills={props.skills} onSelectSkill={props.onSelectSkill} onExpand={props.onExpand} />
      )}
    </div>
  );
}
