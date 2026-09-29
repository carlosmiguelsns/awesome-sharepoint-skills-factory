import * as React from 'react';

import { Body1, Button, Caption1, Field, Input, Spinner, makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

import type { SharePointSite } from '../models';
import { isAgentAssetsLibraryNotFoundError, type ICreateSkillRequest, type ICreateSkillResult } from '../services/TenantSharePointDataService';
import { isTeamOrCommunicationSiteTemplate } from '../utils/siteHelpers';
import { normalizeSkillFolderName } from '../utils/textHelpers';
import ActivateAgentAssetsDialog from './ActivateAgentAssetsDialog';

const useStyles = makeStyles({
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    // Toast UI Editor's own WYSIWYG container/content elements use z-index up to 40
    // internally (toolbar dropdowns, tooltips, popups), so this needs to clear that
    // to actually sit on top while submitting.
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colorNeutralBackground1,
    opacity: 0.9,
    borderRadius: tokens.borderRadiusMedium
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: tokens.spacingHorizontalS,
    alignItems: 'start'
  },
  fullWidth: {
    gridColumn: '1 / -1'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  select: {
    minHeight: '32px',
    borderRadius: tokens.borderRadiusMedium,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    font: 'inherit'
  },
  contentField: {
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0
  },
  contentEditor: {
    boxSizing: 'border-box',
    width: '100%',
    minWidth: 0,
    borderRadius: tokens.borderRadiusMedium,
    overflow: 'hidden'
  },
  preview: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS
  },
  statusText: {
    color: tokens.colorNeutralForeground3
  },
  statusError: {
    color: tokens.colorPaletteRedForeground1
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    justifyContent: 'flex-end'
  }
});

function buildSkillMarkdownContent(normalizedSkillName: string, skillName: string, content: string): string {
  const escapedNormalizedName: string = normalizedSkillName.replace(/"/g, '\\"');
  const header: string = `---\nname: "${escapedNormalizedName}"\ndescription: ""\n---\n\n# ${skillName}\n\n\n`;
  return `${header}${content}`;
}

function compareSiteName(left: SharePointSite, right: SharePointSite): number {
  return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
}

export interface ICreateSkillFormProps {
  sites: SharePointSite[];
  onCreateSkill: (request: ICreateSkillRequest) => Promise<ICreateSkillResult>;
  onActivateAgentAssetsFeature: (siteUrl: string) => Promise<void>;
  onCreated?: (result: ICreateSkillResult) => void;
  onCancel?: () => void;
  onSubmittingChange?: (submitting: boolean) => void;
}

export default function CreateSkillForm(props: ICreateSkillFormProps): React.ReactElement {
  const styles = useStyles();
  const skillContentEditorRef = React.useRef<Editor>(null);

  const [siteId, setSiteId] = React.useState<string>('');
  const [name, setName] = React.useState<string>('');
  const [content, setContent] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');
  const [agentAssetsPromptSiteUrl, setAgentAssetsPromptSiteUrl] = React.useState<string | undefined>(undefined);
  const [isActivatingFeature, setIsActivatingFeature] = React.useState<boolean>(false);
  const [activateError, setActivateError] = React.useState<string>('');

  const creatableSites: SharePointSite[] = React.useMemo(
    () => props.sites.filter((site: SharePointSite) => isTeamOrCommunicationSiteTemplate(site.template)),
    [props.sites]
  );

  React.useEffect(() => {
    if (!siteId && creatableSites.length) {
      setSiteId(creatableSites[0].id);
    }
  }, [creatableSites, siteId]);

  React.useEffect(() => {
    props.onSubmittingChange?.(submitting);
  }, [submitting]); // eslint-disable-line react-hooks/exhaustive-deps

  const normalizedName: string = React.useMemo(() => normalizeSkillFolderName(name), [name]);
  const selectedSite: SharePointSite | undefined = React.useMemo(
    () => creatableSites.find((site: SharePointSite) => site.id === siteId),
    [creatableSites, siteId]
  );

  const handleSubmit = React.useCallback(async (): Promise<void> => {
    const trimmedName: string = name.trim();
    const site: SharePointSite | undefined = creatableSites.find((item: SharePointSite) => item.id === siteId);

    setError('');
    setStatus('');

    if (!trimmedName) {
      setError('Skill Name is required.');
      return;
    }

    if (!site) {
      setError('Site selection is required.');
      return;
    }

    const normalized: string = normalizeSkillFolderName(trimmedName);
    if (!normalized) {
      setError('Skill Name must contain at least one letter or number.');
      return;
    }

    if (!content.trim()) {
      setError('Skill Content is required.');
      return;
    }

    setSubmitting(true);
    try {
      setStatus('Creating skill folder…');
      const result: ICreateSkillResult = await props.onCreateSkill({
        siteUrl: site.url,
        skillName: trimmedName,
        skillContent: buildSkillMarkdownContent(normalized, trimmedName, content),
        onProgress: (message: string) => setStatus(message)
      });
      setStatus(`Created ${result.normalizedSkillName} successfully.`);
      setName('');
      setContent('');
      skillContentEditorRef.current?.getInstance().setMarkdown('');
      props.onCreated?.(result);
    } catch (submitError: unknown) {
      if (isAgentAssetsLibraryNotFoundError(submitError)) {
        setAgentAssetsPromptSiteUrl(submitError.siteUrl);
        setStatus('');
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Failed to create the skill.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [content, creatableSites, name, props, siteId]);

  const handleCancelActivateFeature = React.useCallback((): void => {
    setAgentAssetsPromptSiteUrl(undefined);
    setActivateError('');
  }, []);

  const handleConfirmActivateFeature = React.useCallback(async (): Promise<void> => {
    if (!agentAssetsPromptSiteUrl) {
      return;
    }

    setIsActivatingFeature(true);
    setActivateError('');
    try {
      await props.onActivateAgentAssetsFeature(agentAssetsPromptSiteUrl);
      setAgentAssetsPromptSiteUrl(undefined);
      await handleSubmit();
    } catch (activationError: unknown) {
      setActivateError(activationError instanceof Error ? activationError.message : 'Failed to activate the Agent Assets feature.');
    } finally {
      setIsActivatingFeature(false);
    }
  }, [agentAssetsPromptSiteUrl, handleSubmit, props]);

  return (
    <div className={styles.root}>
      {submitting ? (
        <div className={styles.overlay}>
          <Spinner label={status || 'Creating skill…'} />
        </div>
      ) : null}
      {error ? <Body1 className={styles.statusError}>{error}</Body1> : null}
      {status && !submitting ? <Body1 className={styles.statusText}>{status}</Body1> : null}

      <div className={styles.form}>
        <Field className={styles.field} label="Site" required>
          <select className={styles.select} value={siteId} disabled={submitting} onChange={(event) => setSiteId(event.target.value)}>
            <option value="">Select a site</option>
            {creatableSites.slice().sort(compareSiteName).map((site: SharePointSite) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </Field>

        <Field className={styles.field} label="Skill Name" required>
          <Input value={name} disabled={submitting} onChange={(_, data) => setName(data.value)} placeholder='Example: "Build HTML Dashboard!"' />
          <Caption1>Normalized folder name: {normalizedName || '—'}</Caption1>
        </Field>

        <Field className={mergeClasses(styles.field, styles.fullWidth, styles.contentField)} label="Skill Content" required>
          <div className={styles.contentEditor}>
            <Editor
              ref={skillContentEditorRef}
              initialValue={content}
              previewStyle="vertical"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              placeholder="Write the SKILL.md content…"
              onChange={() => setContent(skillContentEditorRef.current?.getInstance().getMarkdown() ?? '')}
            />
          </div>
        </Field>

        <div className={mergeClasses(styles.preview, styles.fullWidth)}>
          <Caption1>Folder path: {selectedSite ? `${selectedSite.name} / Agent Assets / skills / ${normalizedName || 'skill-name'}` : 'Select a site to preview the path.'}</Caption1>
          <Caption1>SKILL.md path: {selectedSite ? `${selectedSite.name} / Agent Assets / skills / ${normalizedName || 'skill-name'} / SKILL.md` : 'Select a site to preview the path.'}</Caption1>
        </div>

        <div className={mergeClasses(styles.actions, styles.fullWidth)}>
          {props.onCancel ? (
            <Button appearance="secondary" disabled={submitting} onClick={props.onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button appearance="primary" onClick={() => { void handleSubmit(); }} disabled={submitting || !name.trim() || !siteId}>
            {submitting ? 'Creating…' : 'Create Skill'}
          </Button>
        </div>
      </div>

      <ActivateAgentAssetsDialog
        open={Boolean(agentAssetsPromptSiteUrl)}
        siteUrl={agentAssetsPromptSiteUrl}
        isActivating={isActivatingFeature}
        error={activateError}
        onConfirm={() => { void handleConfirmActivateFeature(); }}
        onCancel={handleCancelActivateFeature}
      />
    </div>
  );
}
