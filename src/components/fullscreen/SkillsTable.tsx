import * as React from 'react';

import { Body1, Button, Caption1, Persona, Text, makeStyles, tokens } from '@fluentui/react-components';
import { CheckmarkCircle24Filled, ChevronDown24Regular, ChevronUp24Regular, ChevronUpDown24Regular } from '@fluentui/react-icons';

import type { SiteCollection, Skill } from '../../models';
import { formatRelativeDate } from '../../utils/dateHelpers';

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
  statusCell: {
    width: '1%',
    paddingRight: 0
  },
  statusIcon: {
    color: tokens.colorPaletteGreenForeground1,
    marginTop: tokens.spacingVerticalXS
  },
  skillName: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  }
});

type SortField = 'skill' | 'owner' | 'collection' | 'modified';
type SortDirection = 'ascending' | 'descending';

export interface ISkillsTableProps {
  skills: Skill[];
  siteCollections: SiteCollection[];
  selectedSkillId?: string;
  onSelectSkill: (skillId: string) => void;
}

export default function SkillsTable(props: ISkillsTableProps): React.ReactElement {
  const styles = useStyles();
  const [sortField, setSortField] = React.useState<SortField>('skill');
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('ascending');

  const collectionNameForSkill = React.useCallback(
    (skill: Skill): string => {
      const firstCollectionId: string | undefined = skill.siteCollectionIds[0];
      const collection: SiteCollection | undefined = props.siteCollections.find((item: SiteCollection) => item.id === firstCollectionId);
      return collection ? collection.name : '—';
    },
    [props.siteCollections]
  );

  const getOwnerName = React.useCallback((skill: Skill): string => (skill.isOwnedByCurrentUser ? 'You' : skill.owner), []);

  const sortedSkills: Skill[] = React.useMemo(() => {
    const items: Skill[] = props.skills.slice();
    const compareText = (left: string, right: string): number => left.localeCompare(right, undefined, { sensitivity: 'base' });

    items.sort((left: Skill, right: Skill) => {
      let comparison: number = 0;
      if (sortField === 'skill') {
        comparison = compareText(left.name, right.name);
      } else if (sortField === 'owner') {
        comparison = compareText(getOwnerName(left), getOwnerName(right));
      } else if (sortField === 'collection') {
        comparison = compareText(collectionNameForSkill(left), collectionNameForSkill(right));
      } else {
        comparison = left.modifiedDate.localeCompare(right.modifiedDate);
      }

      return sortDirection === 'ascending' ? comparison : -comparison;
    });

    return items;
  }, [collectionNameForSkill, getOwnerName, props.skills, sortDirection, sortField]);

  const requestSort = React.useCallback(
    (field: SortField): void => {
      if (sortField === field) {
        setSortDirection((current: SortDirection) => (current === 'ascending' ? 'descending' : 'ascending'));
        return;
      }

      setSortField(field);
      setSortDirection(field === 'modified' ? 'descending' : 'ascending');
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
          <th className={styles.headerCell} />
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
            <Button appearance="subtle" size="small" icon={sortIconFor('collection')} onClick={() => requestSort('collection')}>
              Site Collection
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('modified')} onClick={() => requestSort('modified')}>
              Modified
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
              <td className={`${styles.cell} ${styles.statusCell}`}>
                {isSelected ? <CheckmarkCircle24Filled className={styles.statusIcon} /> : null}
              </td>
              <td className={styles.cell}>
                <div className={styles.skillName}>
                  <Text weight="semibold">{skill.name}</Text>
                  <Body1>{skill.description}</Body1>
                </div>
              </td>
              <td className={styles.cell}>
                <Persona name={skill.owner} secondaryText={skill.isOwnedByCurrentUser ? 'Current user' : 'Skill owner'} size="small" />
              </td>
              <td className={styles.cell}>
                <Caption1>{collectionNameForSkill(skill)}</Caption1>
              </td>
              <td className={styles.cell}>
                <Caption1>{formatRelativeDate(skill.modifiedDate)}</Caption1>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
