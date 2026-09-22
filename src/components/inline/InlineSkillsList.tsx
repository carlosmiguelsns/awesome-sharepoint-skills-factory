import * as React from 'react';

import { Body1, Caption1, Text, makeStyles, tokens } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';

import type { Skill } from '../../models';

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  row: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusLarge,
    backgroundColor: tokens.colorNeutralBackground1,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: tokens.spacingHorizontalM,
    padding: tokens.spacingVerticalM,
    textAlign: 'left',
    width: '100%',
    '&:hover': {
      transform: 'translateY(-1px)',
      backgroundColor: tokens.colorNeutralBackground2
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px'
    }
  },
  rowTop: {
    backgroundColor: tokens.colorBrandBackground2
  },
  iconWrap: {
    width: '36px',
    height: '36px',
    borderRadius: tokens.borderRadiusCircular,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorBrandForeground1
  },
  iconWrapTop: {
    backgroundColor: tokens.colorBrandBackground2
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
    minWidth: 0,
    flexGrow: 1
  },
  headerLine: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
    minWidth: 0
  },
  source: {
    color: tokens.colorNeutralForeground3
  },
  description: {
    color: tokens.colorNeutralForeground3
  }
});

export interface IInlineSkillsListProps {
  skills: Skill[];
  onSelectSkill: (skillId: string) => void;
}

export default function InlineSkillsList(props: IInlineSkillsListProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {props.skills.map((skill: Skill, index: number) => (
        <button
          key={skill.id}
          type="button"
          className={`${styles.row} ${index === 0 ? styles.rowTop : ''}`}
          onClick={() => props.onSelectSkill(skill.id)}
        >
          <span className={`${styles.iconWrap} ${index === 0 ? styles.iconWrapTop : ''}`} aria-hidden="true">
            <Sparkle24Regular />
          </span>
          <div className={styles.content}>
            <div className={styles.headerLine}>
              <Text weight="semibold">{skill.name}</Text>
              {index === 0 ? <Caption1 className={styles.source}>Top skill</Caption1> : null}
            </div>
            <Body1 className={styles.description}>{skill.description}</Body1>
            <Caption1 className={styles.source}>
              {skill.knowledgeSources.length ? `Source: ${skill.knowledgeSources.join(' · ')}` : 'Source unavailable'}
            </Caption1>
          </div>
        </button>
      ))}
    </div>
  );
}
