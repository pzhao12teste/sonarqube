/*
 * SonarQube
 * Copyright (C) 2009-2018 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import ActionsDropdown, {
  ActionsDropdownItem,
  ActionsDropdownDivider
} from '../../../components/controls/ActionsDropdown';
import ConfirmButton from '../../../components/controls/ConfirmButton';
import CreateWebhookForm from './CreateWebhookForm';
import { translate, translateWithParameters } from '../../../helpers/l10n';
import { Webhook } from '../../../app/types';
import { deleteWebhook, updateWebhook } from '../../../api/webhooks';

interface Props {
  refreshWebhooks: () => Promise<void>;
  webhook: Webhook;
}

interface State {
  updating: boolean;
}

export default class WebhookActions extends React.PureComponent<Props, State> {
  mounted: boolean;
  state: State = { updating: false };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleDelete = () =>
    deleteWebhook({ key: this.props.webhook.key }).then(this.props.refreshWebhooks);

  handleUpdate = (data: { name: string; url: string }) =>
    updateWebhook({ ...data, key: this.props.webhook.key }).then(
      this.props.refreshWebhooks,
      () => {}
    );

  handleUpdateClick = () => this.setState({ updating: true });

  handleUpdatingStop = () => this.setState({ updating: false });

  render() {
    const { webhook } = this.props;

    return (
      <>
        <ActionsDropdown className="ig-spacer-left">
          <ActionsDropdownItem className="js-webhook-update" onClick={this.handleUpdateClick}>
            {translate('update_verb')}
          </ActionsDropdownItem>
          <ActionsDropdownDivider />
          <ConfirmButton
            confirmButtonText={translate('delete')}
            isDestructive={true}
            modalBody={translateWithParameters('webhooks.delete.confirm', webhook.name)}
            modalHeader={translate('webhooks.delete')}
            onConfirm={this.handleDelete}>
            {({ onClick }) => (
              <ActionsDropdownItem
                className="js-webhook-delete"
                destructive={true}
                onClick={onClick}>
                {translate('delete')}
              </ActionsDropdownItem>
            )}
          </ConfirmButton>
        </ActionsDropdown>

        {this.state.updating && (
          <CreateWebhookForm
            onClose={this.handleUpdatingStop}
            onDone={this.handleUpdate}
            webhook={webhook}
          />
        )}
      </>
    );
  }
}
