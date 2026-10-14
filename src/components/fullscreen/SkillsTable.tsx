import * as React from 'react';

import {
  Badge,
  Button,
  Caption1,
  createTableColumn,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Persona,
  Text,
  makeStyles,
  tokens,
  type TableColumnDefinition,
  type TableColumnSizingOptions
} from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronUp24Regular, ChevronUpDown24Regular } from '@fluentui/react-icons';

import type { Skill } from '../../models';
import { formatLongDate } from '../../utils/dateHelpers';

const useStyles = makeStyles({
  grid: {
    width: '100%'
  },
  headerRow: {
    backgroundColor: tokens.colorNeutralBackground2
  },
  row: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorSubtleBackgroundHover
    }
  },
  skillName: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  }
});

type SortField = 'skill' | 'owner' | 'created' | 'modifiedBy' | 'modifiedDate';
type SortDirection = 'ascending' | 'descending';

// Deliberately omits `idealWidth`: Fluent's column resizing treats an explicit idealWidth as
// authoritative and re-applies it whenever the `columns` array is recreated (e.g. on every
// re-render), which would wipe out any width the user drags. Leaving it unset lets the resize
// state fall back to the user's last dragged width instead.
const SKILLS_TABLE_COLUMN_SIZING_OPTIONS: TableColumnSizingOptions = {
  skill: { minWidth: 160, defaultWidth: 240 },
  owner: { minWidth: 140, defaultWidth: 180 },
  created: { minWidth: 120, defaultWidth: 150 },
  modifiedBy: { minWidth: 140, defaultWidth: 160 },
  modifiedDate: { minWidth: 120, defaultWidth: 150 },
  sites: { minWidth: 80, defaultWidth: 100 }
};

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

  const sortHeaderButton = React.useCallback(
    (field: SortField, label: string): React.ReactElement => (
      <Button appearance="subtle" size="small" icon={sortIconFor(field)} onClick={() => requestSort(field)}>
        {label}
      </Button>
    ),
    [requestSort, sortIconFor]
  );

  const columns: Array<TableColumnDefinition<Skill>> = React.useMemo(
    () => [
      createTableColumn<Skill>({
        columnId: 'skill',
        renderHeaderCell: () => sortHeaderButton('skill', 'Skill'),
        renderCell: (skill: Skill) => (
          <div className={styles.skillName}>
            <Text weight="semibold">{skill.name}</Text>
          </div>
        )
      }),
      createTableColumn<Skill>({
        columnId: 'owner',
        renderHeaderCell: () => sortHeaderButton('owner', 'Owner'),
        renderCell: (skill: Skill) => (
          <Persona name={getOwnerName(skill)} secondaryText={skill.isOwnedByCurrentUser ? 'Current user' : 'Skill owner'} size="small" />
        )
      }),
      createTableColumn<Skill>({
        columnId: 'created',
        renderHeaderCell: () => sortHeaderButton('created', 'Created Date'),
        renderCell: (skill: Skill) => <Caption1>{formatLongDate(skill.skillMarkdownCreatedDate || skill.createdDate)}</Caption1>
      }),
      createTableColumn<Skill>({
        columnId: 'modifiedBy',
        renderHeaderCell: () => sortHeaderButton('modifiedBy', 'Modified by'),
        renderCell: (skill: Skill) => <Caption1>{getModifiedByName(skill)}</Caption1>
      }),
      createTableColumn<Skill>({
        columnId: 'modifiedDate',
        renderHeaderCell: () => sortHeaderButton('modifiedDate', 'Modified date'),
        renderCell: (skill: Skill) => <Caption1>{formatLongDate(skill.skillMarkdownModifiedDate || skill.modifiedDate)}</Caption1>
      }),
      createTableColumn<Skill>({
        columnId: 'sites',
        renderHeaderCell: () => 'Sites',
        renderCell: (skill: Skill) => (
          <Badge appearance="outline" color="informative">
            {skill.siteIds.length} {skill.siteIds.length === 1 ? 'site' : 'sites'}
          </Badge>
        )
      })
    ],
    [getModifiedByName, getOwnerName, sortHeaderButton, styles.skillName]
  );

  return (
    <DataGrid
      className={styles.grid}
      items={sortedSkills}
      columns={columns}
      getRowId={(skill: Skill) => skill.id}
      resizableColumns
      columnSizingOptions={SKILLS_TABLE_COLUMN_SIZING_OPTIONS}
    >
      <DataGridHeader className={styles.headerRow}>
        <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
      </DataGridHeader>
      <DataGridBody<Skill>>
        {({ item, rowId }) => {
          const isSelected: boolean = props.selectedSkillId === item.id;
          return (
            <DataGridRow<Skill>
              key={rowId}
              className={styles.row}
              appearance={isSelected ? 'brand' : 'none'}
              onClick={() => props.onSelectSkill(item.id)}
            >
              {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
            </DataGridRow>
          );
        }}
      </DataGridBody>
    </DataGrid>
  );
}
