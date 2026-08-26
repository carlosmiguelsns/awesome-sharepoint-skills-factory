import * as React from 'react';

import { Body1, Text, makeStyles, tokens } from '@fluentui/react-components';

import type { Skill } from '../../models';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  row: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalS,
    textAlign: 'left',
    width: '100%'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    flexGrow: 1
  },
  arrow: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0
  },
  meta: {
    color: tokens.colorNeutralForeground3
  }
});

export interface IInlineSkillsListProps {
  skills: Skill[];
  onSelectSkill: (skillId: string) => void;
  onExpand: () => void;
}

export default function InlineSkillsList(props: IInlineSkillsListProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {props.skills.map((skill: Skill) => (
        <button
          key={skill.id}
          type="button"
          className={styles.row}
          onClick={() => {
            props.onSelectSkill(skill.id);
            props.onExpand();
          }}
        >
          <div className={styles.content}>
            <Text weight="semibold">{skill.name}</Text>
            <Body1>{skill.description}</Body1>
          </div>
          <Text className={styles.arrow} weight="semibold">
            &gt;
          </Text>
        </button>
      ))}
    </div>
  );
}
