import * as React from 'react';

import { Body1, Card, CardHeader, Text, makeStyles, tokens } from '@fluentui/react-components';
import { CheckmarkCircle24Filled } from '@fluentui/react-icons';

import type { Skill } from '../models';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: tokens.spacingHorizontalM
  },
  card: {},
  cardClickable: {
    cursor: 'pointer'
  },
  cardSelected: {
    backgroundColor: tokens.colorNeutralBackground3,
    position: 'relative'
  },
  selectedIcon: {
    position: 'absolute',
    top: tokens.spacingVerticalS,
    right: tokens.spacingHorizontalS,
    color: tokens.colorPaletteGreenForeground1
  },
  description: {
    marginTop: tokens.spacingVerticalXS
  }
});

export interface ISkillCardsProps {
  skills: Skill[]; 
  currentUserName: string;
  selectedSkillId?: string;
  onSelectSkill?: (skillId: string) => void;
}

export default function SkillCards(props: ISkillCardsProps): React.ReactElement {
  const styles = useStyles();
  const isClickable: boolean = typeof props.onSelectSkill === 'function';

  return (
    <div className={styles.grid}>
      {props.skills.map((skill: Skill) => {
        const isSelected: boolean = props.selectedSkillId === skill.id;
        return (
          <Card
            key={skill.id}
            className={`${styles.card} ${isClickable ? styles.cardClickable : ''} ${isSelected ? styles.cardSelected : ''}`}
            onClick={isClickable ? () => props.onSelectSkill?.(skill.id) : undefined}
          >
            {isSelected ? <CheckmarkCircle24Filled className={styles.selectedIcon} /> : null}
            <CardHeader header={<Text weight="semibold">{skill.name}</Text>} description={<Body1>{skill.description}</Body1>} />
            <Body1 className={styles.description}>
              Created by {skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner}
            </Body1>
            <Body1 className={styles.description}>{skill.knowledgeSources.join(' · ')}</Body1>
          </Card>
        );
      })}
    </div>
  );
}
