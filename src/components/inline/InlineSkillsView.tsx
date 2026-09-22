import * as React from 'react';

import { Body1, Link, Text, makeStyles, tokens } from '@fluentui/react-components';

import type { Skill } from '../../models';
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
  }
});

export interface IInlineSkillsViewProps {
  skills: Skill[];
  onSelectSkill: (skillId: string) => void;
  onExpand: () => Promise<void>;
}

export default function InlineSkillsView(props: IInlineSkillsViewProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Text size={500} weight="semibold">My Skills</Text>
          <Body1 className={styles.helper}>A compact view of your top 5 skills used.</Body1>
        </div>
        <Link onClick={(): void => { void props.onExpand(); }}>Expand</Link>
      </div>

      <InlineSkillsList skills={props.skills} onSelectSkill={props.onSelectSkill} />
    </div>
  );
}
