import * as React from 'react';

import { Badge, Body1, Button, Caption1, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ChevronDown24Regular, ChevronRight24Regular, ChevronUp24Regular, ChevronUpDown24Regular } from '@fluentui/react-icons';

import type { SharePointSite, Skill } from '../../models';

const useStyles = makeStyles({
  table: {
    width: '100%',
    minWidth: '840px',
    borderCollapse: 'collapse'
  },
  headerCell: {
    textAlign: 'left',
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    whiteSpace: 'nowrap'
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
  actionsCell: {
    textAlign: 'right',
    whiteSpace: 'nowrap'
  },
  siteName: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  statusHas: {
    color: tokens.colorPaletteGreenForeground1
  },
  statusNone: {
    color: tokens.colorNeutralForeground3
  },
  detailsRow: {
    backgroundColor: tokens.colorNeutralBackground2
  },
  detailsCell: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`
  },
  detailsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS
  },
  skillsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS,
    marginTop: tokens.spacingVerticalS
  },
  muted: {
    color: tokens.colorNeutralForeground3
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
  const [expandedSiteIds, setExpandedSiteIds] = React.useState<Set<string>>(new Set<string>());

  const skillsForSite = React.useCallback(
    (siteId: string): Skill[] => props.skills.filter((skill: Skill) => skill.siteIds.indexOf(siteId) !== -1),
    [props.skills]
  );

  const skillCountForSite = React.useCallback((siteId: string): number => skillsForSite(siteId).length, [skillsForSite]);

  const sortIconFor = React.useCallback(
    (field: SortField) => {
      if (props.sortField !== field) {
        return <ChevronUpDown24Regular />;
      }

      return props.sortDirection === 'ascending' ? <ChevronUp24Regular /> : <ChevronDown24Regular />;
    },
    [props.sortDirection, props.sortField]
  );

  const toggleExpanded = React.useCallback((siteId: string): void => {
    setExpandedSiteIds((current: Set<string>) => {
      const next: Set<string> = new Set<string>(current);
      if (next.has(siteId)) {
        next.delete(siteId);
      } else {
        next.add(siteId);
      }
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (!props.selectedSiteId) {
      return;
    }

    setExpandedSiteIds((current: Set<string>) => {
      if (current.has(props.selectedSiteId!)) {
        return current;
      }

      const next: Set<string> = new Set<string>(current);
      next.add(props.selectedSiteId!);
      return next;
    });
  }, [props.selectedSiteId]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.headerCell}>
            <Button appearance="subtle" size="small" icon={sortIconFor('site')} onClick={() => props.onSortChange('site')}>
              Site
            </Button>
          </th>
          <th className={styles.headerCell} style={{ textAlign: 'right' }}>
            <Button appearance="subtle" size="small" icon={sortIconFor('skills')} onClick={() => props.onSortChange('skills')}>
              Skills
            </Button>
          </th>
          <th className={styles.headerCell}>Coverage</th>
          <th className={`${styles.headerCell} ${styles.actionsCell}`}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.sites.map((site: SharePointSite) => {
          const isSelected: boolean = props.selectedSiteId === site.id;
          const isExpanded: boolean = expandedSiteIds.has(site.id);
          const siteSkills: Skill[] = skillsForSite(site.id);
          const skillCount: number = skillCountForSite(site.id);
          const hasSkills: boolean = skillCount > 0;

          return (
            <React.Fragment key={site.id}>
              <tr className={`${styles.row} ${isSelected ? styles.selectedRow : ''}`} onClick={() => props.onSelectSite(site.id)}>
                <td className={styles.cell}>
                  <div className={styles.siteName}>
                    <Text weight="semibold">{site.name}</Text>
                    <Caption1>{site.webUrl || site.url}</Caption1>
                  </div>
                </td>
                <td className={styles.cell} style={{ textAlign: 'right' }}>
                  <Badge appearance="outline" color="informative">
                    {skillCount}
                  </Badge>
                </td>
                <td className={styles.cell}>
                  <Text weight="semibold" className={hasSkills ? styles.statusHas : styles.statusNone}>
                    {hasSkills ? 'Has skills' : 'No skills'}
                  </Text>
                </td>
                <td className={`${styles.cell} ${styles.actionsCell}`}>
                  <Button
                    appearance="secondary"
                    size="small"
                    icon={isExpanded ? <ChevronDown24Regular /> : <ChevronRight24Regular />}
                    iconPosition="after"
                    onClick={(event: React.MouseEvent): void => {
                      event.stopPropagation();
                      props.onSelectSite(site.id);
                      toggleExpanded(site.id);
                    }}
                    aria-label={`${isExpanded ? 'Hide' : 'View'} skills for ${site.name}`}
                  >
                    View
                  </Button>
                </td>
              </tr>
              {isExpanded ? (
                <tr className={styles.detailsRow}>
                  <td className={styles.detailsCell} colSpan={4}>
                    <div className={styles.detailsHeader}>
                      <Text weight="semibold">Skills on this site</Text>
                      <Caption1 className={styles.muted}>{siteSkills.length} matching skill{siteSkills.length === 1 ? '' : 's'}</Caption1>
                    </div>
                    {siteSkills.length ? (
                      <div className={styles.skillsWrap}>
                        {siteSkills.map((skill: Skill) => (
                          <Badge key={skill.id} appearance="filled">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <Body1 className={styles.muted}>No skills found for this site.</Body1>
                    )}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
