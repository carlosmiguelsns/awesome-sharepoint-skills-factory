import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { BaseCopilotComponent } from '@microsoft/sp-copilot-component';
import type { ICopilotComponentHostContext } from '@microsoft/sp-copilot-component';
import type { MSGraphClientFactory, SPHttpClient } from '@microsoft/sp-http';

import type { ISharePointSkillsFactoryCopilotComponentProperties } from './SharePointSkillsFactoryCopilotComponentProperties';
import SkillsFactoryApp from './components/SkillsFactoryApp';

export default class SharePointSkillsFactoryCopilotComponent extends BaseCopilotComponent<ISharePointSkillsFactoryCopilotComponentProperties> {
  protected override render(): void {
    const currentUserName: string = this.context.pageContext.user?.displayName || '';
    const currentUserEmail: string = this.context.pageContext.user?.email || this.context.pageContext.user?.loginName || '';

    ReactDOM.render(
      React.createElement(SkillsFactoryApp, {
        hostContext: this.hostContext,
        spHttpClient: this.context.spHttpClient as SPHttpClient,
        msGraphClientFactory: this.context.msGraphClientFactory as MSGraphClientFactory,
        siteUrl: this.context.pageContext.web.absoluteUrl,
        currentUserName,
        currentUserEmail,
        targetDocument: this.context.domElement.ownerDocument,
        inputQuery: this.properties.inputQuery,
        onRequestFullscreen: async (): Promise<void> => {
          await this.requestDisplayModeAsync('fullscreen');
        },
        onRequestInline: async (): Promise<void> => {
          await this.requestDisplayModeAsync('inline');
        }
      }),
      this.context.domElement
    );
  }

  protected override onHostContextChanged(_diff: Partial<ICopilotComponentHostContext>): void {
    // The React tree re-renders automatically with the updated host context.
  }

  protected override async onTeardown(): Promise<void> {
    ReactDOM.unmountComponentAtNode(this.context.domElement);
  }
}
