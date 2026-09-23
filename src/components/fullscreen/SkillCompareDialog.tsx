import * as React from 'react';

import {
  Body1,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  makeStyles,
  tokens
} from '@fluentui/react-components';
import ReactDiffViewer from 'react-diff-viewer-continued';

import type { SharePointSite, Skill, SkillSiteRevision } from '../../models';

const useStyles = makeStyles({
  surface: {
    maxWidth: '90vw',
    width: 'min(1100px, 90vw)'
  },
  viewer: {
    maxHeight: '65vh',
    overflow: 'auto',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium
  },
  empty: {
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalM
  }
});

export interface ISkillCompareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill: Skill;
  siteA: SharePointSite;
  siteB: SharePointSite;
}

export default function SkillCompareDialog(props: ISkillCompareDialogProps): React.ReactElement {
  const styles = useStyles();

  const revisionFor = React.useCallback(
    (siteId: string): SkillSiteRevision | undefined => (props.skill.siteRevisions || []).find((revision: SkillSiteRevision) => revision.siteId === siteId),
    [props.skill.siteRevisions]
  );

  const revisionA: SkillSiteRevision | undefined = revisionFor(props.siteA.id);
  const revisionB: SkillSiteRevision | undefined = revisionFor(props.siteB.id);

  return (
    <Dialog open={props.open} onOpenChange={(_, data) => props.onOpenChange(data.open)}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>
            Compare: {props.siteA.name} vs {props.siteB.name}
          </DialogTitle>
          <DialogContent>
            {revisionA && revisionB ? (
              <div className={styles.viewer}>
                <ReactDiffViewer
                  oldValue={revisionA.rawContent}
                  newValue={revisionB.rawContent}
                  splitView={true}
                  disableWorker={true}
                  showDiffOnly={false}
                  leftTitle={props.siteA.name}
                  rightTitle={props.siteB.name}
                />
              </div>
            ) : (
              <Body1 className={styles.empty}>No content was captured for one or both of the selected sites, so a comparison isn&apos;t available.</Body1>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={() => props.onOpenChange(false)}>
              Close
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
