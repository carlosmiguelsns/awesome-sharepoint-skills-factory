import * as React from 'react';

import { Body1, Button, Caption1, Persona, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronUp24Regular, ChevronUpDown24Regular } from '@fluentui/react-icons';

import type { Skill } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';

const useStyles = makeStyles({
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  headerCell: {
    textAlign: 'left',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
  },
  row: {
    cursor: 'pointer',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
  },
  selectedRow: {
    backgroundColor: tokens.colorNeutralBackground3
  },
  cell: {
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
    verticalAlign: 'top'
  },
  skillName: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  }
});

type SortField = 'skill' | 'owner' | 'created' | 'modifiedBy' | 'modifiedDate';
type SortDirection = 'ascending' | 'descending';

export interface ISkillsTableProps {
  skills: Skill[];
  selectedSkillId?: string;
  onSelectSkill: (skillId: string) => void;
  currentUserName: string;
}

export default function SkillsTable(props: ISkillsTableProps): React.ReactElement {
  const styles = useStyles();
  const [sortField, setSortField] = React.useState<SortField>('skill');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('ascending');

  const getOwnerName = React.useCallback(
    (skill: Skill): string => (skill.isOwnedByCurrentUser ? props.currentUserName || skill.owner : skill.owner),
    [props.currentUserName]
  );

  const getModifiedByName = React.useCallback(
    (skill: Skill): string => (skill.isOwnedByCurrentUser ? props.currentUserName || skill.owner : skill.owner),
    [props.currentUserName]
  );

  const sortedSkills: Skill[] = React.useMemo(() => {
    const items: Skill[] = props.skills.slice();
    const compareText = (left: string, right: string): number => left.localeCompare(right, undefined, { sensitivity: 'base' });

    items.sort((left: Skill, right: Skill) => {
      let comparison: number = 0;
      if (sortField === 'skill') {
        comparison = compareText(left.name, right.name);
      } else if (sortField === 'owner') {
        comparison = compareText(getOwnerName(left), getOwnerName(right));
      } else if (sortField === 'created') {
        comparison = compareText(left.skillMarkdownCreatedDate || left.createdDate, right.skillMarkdownCreatedDate || right.createdDate);
      } else if (sortField === 'modifiedBy') {
        comparison = compareText(getModifiedByName(left), getModifiedByName(right));
      } else {
        comparison = compareText(left.skillMarkdownModifiedDate || left.modifiedDate, right.skillMarkdownModifiedDate || right.modifiedDate);
      }

      return sortDirection === 'ascending' ? comparison : -comparison;
    });

    return items;
  }, [getOwnerName, props.skills, sortDirection, sortField]);

  const requestSort = React.useCallback(
    (field: SortField): void => {
      if (sortField === field) {
        setSortDirection((current: SortDirection) => (current === 'ascending' ? 'descending' : 'ascending'));
        return;
      }

      setSortField(field);
      setSortDirection(field === 'modifiedDate' ? 'descending' : 'ascending');
    },
    [sortField]
  );

  const sortIconFor = React.useCallback(
    (field: SortField) => {
      if (sortField !== field) {
        return <ChevronUpDown24Regular />;
      }

      return sortDirection === 'ascending' ? <ChevronUp24Regular /> : <ChevronDown24Regular />;
    },
    [sortDirection, sortField]
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('skill')} onClick={() => requestSort('skill')}>
              Skill
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('owner')} onClick={() => requestSort('owner')}>
              Owner
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('created')} onClick={() => requestSort('created')}>
              Created Date
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('modifiedBy')} onClick={() => requestSort('modifiedBy')}>
              Modified by
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('modifiedDate')} onClick={() => requestSort('modifiedDate')}>
              Modified date
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedSkills.map((skill: Skill) => {
          const isSelected: boolean = props.selectedSkillId === skill.id;
          return (
            <tr
              key={skill.id}
              className={`${styles.row} ${isSelected ? styles.selectedRow : ''}`}
              onClick={() => props.onSelectSkill(skill.id)}
            >
              <td className={styles.cell}>
                <div className={styles.skillName}>
                  <Text weight="semibold">{skill.name}</Text>
                  <Body1>{skill.description}</Body1>
                </div>
              </td>
              <td className={styles.cell}>
                <Persona name={getOwnerName(skill)} secondaryText={skill.isOwnedByCurrentUser ? 'Current user' : 'Skill owner'} size="small" />
              </td>
              <td className={styles.cell}>
                <Caption1>{formatLongDate(skill.skillMarkdownCreatedDate || skill.createdDate)}</Caption1>
              </td>
              <td className={styles.cell}>
                <Caption1>{getModifiedByName(skill)}</Caption1>
              </td>
              <td className={styles.cell}>
                <Caption1>{formatLongDate(skill.skillMarkdownModifiedDate || skill.modifiedDate)}</Caption1>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
