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
  Spinner,
  makeStyles,
  tokens
} from '@fluentui/react-components';

const useStyles = makeStyles({
  error: {
    color: tokens.colorPaletteRedForeground1
  }
});

export interface IActivateAgentAssetsDialogProps {
  open: boolean;
  siteUrl?: string;
  isActivating: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ActivateAgentAssetsDialog(props: IActivateAgentAssetsDialogProps): React.ReactElement {
  const styles = useStyles();

  return (
    <Dialog open={props.open} onOpenChange={(_, data) => { if (!data.open && !props.isActivating) { props.onCancel(); } }}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Agent Assets library not found</DialogTitle>
          <DialogContent>
            <Body1>
              The Agent Assets library was not found on {props.siteUrl || 'the selected site'}. Would you like to activate the
              Agent Assets feature on that site collection now?
            </Body1>
            {props.isActivating ? <Spinner label="Activating feature…" /> : null}
            {props.error ? <Body1 className={styles.error}>{props.error}</Body1> : null}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" disabled={props.isActivating} onClick={props.onCancel}>
              Cancel
            </Button>
            <Button appearance="primary" disabled={props.isActivating} onClick={props.onConfirm}>
              {props.isActivating ? 'Activating…' : 'Activate feature'}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
}
