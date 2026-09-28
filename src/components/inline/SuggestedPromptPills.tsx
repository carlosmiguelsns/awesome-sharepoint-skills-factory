import * as React from 'react';

import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalXS
  },
  pill: {
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalM}`,
    font: 'inherit',
    fontSize: tokens.fontSizeBase200,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '2px'
    }
  },
  pillActive: {
    border: `1px solid ${tokens.colorBrandStroke1}`,
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
    fontWeight: tokens.fontWeightSemibold
  }
});

export interface ISuggestedPrompt {
  key: string;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

export interface ISuggestedPromptPillsProps {
  prompts: ISuggestedPrompt[];
}

export default function SuggestedPromptPills(props: ISuggestedPromptPillsProps): React.ReactElement {
  const styles = useStyles();

  return (
    <div className={styles.row} role="group" aria-label="Suggested questions">
      {props.prompts.map((prompt: ISuggestedPrompt) => (
        <button
          key={prompt.key}
          type="button"
          className={`${styles.pill} ${prompt.isActive ? styles.pillActive : ''}`}
          aria-pressed={Boolean(prompt.isActive)}
          onClick={prompt.onClick}
        >
          {prompt.label}
        </button>
      ))}
    </div>
  );
}
