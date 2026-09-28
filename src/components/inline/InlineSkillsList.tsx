import * as React from 'react';

import { Body1, Caption1, Text, makeStyles, tokens } from '@fluentui/react-components';
import { Board16Regular, CalendarLtr16Regular, DocumentMultiple16Regular, Person16Regular, Sparkle24Regular } from '@fluentui/react-icons';

import type { Skill } from '../../models';
import { formatRelativeDate } from '../../utils/dateHelpers';

const AUTO_DESCRIPTION_PREFIX: string = 'Skill discovered from ';

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
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  description: {
    color: tokens.colorNeutralForeground3,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalXXS,
    marginTop: tokens.spacingVerticalXXS
  },
  metaItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXXS,
    color: tokens.colorNeutralForeground3
  }
});

export interface IInlineSkillsListProps {
  skills: Skill[];
  currentUserName: string;
  onSelectSkill: (skillId: string) => void;
}

export default function InlineSkillsList(props: IInlineSkillsListProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.list}>
      {props.skills.map((skill: Skill, index: number) => {
        const ownerName: string = skill.isOwnedByCurrentUser ? props.currentUserName : skill.owner;
        const hasRealDescription: boolean = Boolean(skill.description) && skill.description.indexOf(AUTO_DESCRIPTION_PREFIX) !== 0;

        return (
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
                <Text weight="semibold" className={styles.title}>{skill.name}</Text>
              </div>
              {hasRealDescription ? <Body1 className={styles.description}>{skill.description}</Body1> : null}
              <div className={styles.metaRow}>
                <Caption1 className={styles.metaItem}>
                  <Person16Regular /> {ownerName}
                </Caption1>
                <Caption1 className={styles.metaItem}>
                  <Board16Regular /> Used in {skill.usageCount} site{skill.usageCount === 1 ? '' : 's'}
                </Caption1>
                <Caption1 className={styles.metaItem}>
                  <CalendarLtr16Regular /> Updated {formatRelativeDate(skill.skillMarkdownModifiedDate || skill.modifiedDate)}
                </Caption1>
                {skill.knowledgeSources.length ? (
                  <Caption1 className={styles.metaItem}>
                    <DocumentMultiple16Regular /> {skill.knowledgeSources.join(' · ')}
                  </Caption1>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
