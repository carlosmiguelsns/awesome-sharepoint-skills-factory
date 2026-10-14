import * as React from 'react';

import { Body1, Text, makeStyles, tokens } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';

import type { SharePointSite, Skill } from '../../models';
import type { ICreateSkillRequest, ICreateSkillResult } from '../../services/TenantSharePointDataService';
import CreateSkillForm from '../CreateSkillForm';
import InlineSkillsList from './InlineSkillsList';
import SuggestedPromptPills, { type ISuggestedPrompt } from './SuggestedPromptPills';

export type InlineViewMode = 'list' | 'create';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    padding: tokens.spacingHorizontalM
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS
  },
  headerIconTile: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    flexShrink: 0
  },
  headerText: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS
  },
  helper: {
    color: tokens.colorNeutralForeground3
  },
  empty: {
    color: tokens.colorNeutralForeground3
  }
});

export interface IInlineSkillsViewProps {
  mode: InlineViewMode;
  skills: Skill[];
  totalMySkillsCount: number;
  skillLimit: number | 'all';
  currentUserName: string;
  sites: SharePointSite[];
  onSelectSkill: (skillId: string) => void;
  onShowTopSkills: (count: number) => void;
  onShowAllSkills: () => void;
  onStartCreateSkill: () => void;
  onCancelCreateSkill: () => void;
  onCreateSkill: (request: ICreateSkillRequest) => Promise<ICreateSkillResult>;
  onActivateAgentAssetsFeature: (siteUrl: string) => Promise<void>;
  onSkillCreated: () => void;
}

function describeVisibleSkills(visibleCount: number, totalCount: number, limit: number | 'all'): string {
  if (totalCount === 0) {
    return "You don't own any skills yet — try creating one.";
  }

  if (limit === 'all' || visibleCount >= totalCount) {
    return `Showing all ${totalCount} skill${totalCount === 1 ? '' : 's'} you own.`;
  }

  return `Showing your top ${visibleCount} of ${totalCount} skills, ranked by usage.`;
}

export default function InlineSkillsView(props: IInlineSkillsViewProps): React.ReactElement {
  const styles = useStyles();

  const prompts: ISuggestedPrompt[] = [
    { key: 'top-5', label: 'Show my top 5 skills', isActive: props.mode === 'list' && props.skillLimit === 5, onClick: () => props.onShowTopSkills(5) },
    { key: 'all', label: 'Show all my skills', isActive: props.mode === 'list' && props.skillLimit === 'all', onClick: props.onShowAllSkills },
    { key: 'create', label: 'Create a new skill', isActive: props.mode === 'create', onClick: props.onStartCreateSkill }
  ];

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <span className={styles.headerIconTile} aria-hidden="true">
          <Sparkle24Regular />
        </span>
        <div className={styles.headerText}>
          <Text size={500} weight="semibold">My Skills</Text>
          <Body1 className={styles.helper}>
            {props.mode === 'create' ? 'Create a new skill folder and SKILL.md in a selected site.' : describeVisibleSkills(props.skills.length, props.totalMySkillsCount, props.skillLimit)}
          </Body1>
        </div>
      </div>

      <SuggestedPromptPills prompts={prompts} />

      {props.mode === 'create' ? (
        <CreateSkillForm
          sites={props.sites}
          onCreateSkill={props.onCreateSkill}
          onActivateAgentAssetsFeature={props.onActivateAgentAssetsFeature}
          onCreated={props.onSkillCreated}
          onCancel={props.onCancelCreateSkill}
        />
      ) : props.skills.length ? (
        <InlineSkillsList skills={props.skills} currentUserName={props.currentUserName} onSelectSkill={props.onSelectSkill} />
      ) : (
        <Body1 className={styles.empty}>No skills to show yet. Try “Create a new skill” to get started.</Body1>
      )}
    </div>
  );
}
