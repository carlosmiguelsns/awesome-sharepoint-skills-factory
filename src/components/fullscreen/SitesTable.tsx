import * as React from 'react';

import { Badge, Body1, Button, Caption1, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronUp24Regular, ChevronUpDown24Regular } from '@fluentui/react-icons';

import type { SharePointSite, Skill } from '../../models';

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
  siteName: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  }
});

type SortField = 'site' | 'url' | 'collection' | 'skills';
type SortDirection = 'ascending' | 'descending';

export interface ISitesTableProps {
  sites: SharePointSite[];
  skills: Skill[];
  selectedSiteId?: string;
  onSelectSite: (siteId: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField) => void;
}

export default function SitesTable(props: ISitesTableProps): React.ReactElement {
  const styles = useStyles();

  const skillCountForSite = React.useCallback(
    (siteId: string): number => props.skills.filter((skill: Skill) => skill.siteIds.indexOf(siteId) !== -1).length,
    [props.skills]
  );

  const sortIconFor = React.useCallback(
    (field: SortField) => {
      if (props.sortField !== field) {
        return <ChevronUpDown24Regular />;
      }

      return props.sortDirection === 'ascending' ? <ChevronUp24Regular /> : <ChevronDown24Regular />;
    },
    [props.sortDirection, props.sortField]
  );

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('site')} onClick={() => props.onSortChange('site')}>
              Site
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('url')} onClick={() => props.onSortChange('url')}>
              URL
            </Button>
          </th>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('collection')} onClick={() => props.onSortChange('collection')}>
              Site collection
            </Button>
          </th>
          <th className={styles.headerCell} style={{ textAlign: 'right' }}>
            <Button appearance="subtle" size="small" icon={sortIconFor('skills')} onClick={() => props.onSortChange('skills')}>
              Skills
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        {props.sites.map((site: SharePointSite) => {
          const isSelected: boolean = props.selectedSiteId === site.id;
          return (
            <tr key={site.id} className={`${styles.row} ${isSelected ? styles.selectedRow : ''}`} onClick={() => props.onSelectSite(site.id)}>
              <td className={styles.cell}>
                <div className={styles.siteName}>
                  <Text weight="semibold">{site.name}</Text>
                  <Body1>{site.description}</Body1>
                </div>
              </td>
              <td className={styles.cell}>
                <Caption1>{site.webUrl || site.url}</Caption1>
              </td>
              <td className={styles.cell}>
                <Caption1>{site.siteCollectionName || '—'}</Caption1>
              </td>
              <td className={styles.cell} style={{ textAlign: 'right' }}>
                <Badge appearance="outline" color="informative">
                  {skillCountForSite(site.id)}
                </Badge>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
