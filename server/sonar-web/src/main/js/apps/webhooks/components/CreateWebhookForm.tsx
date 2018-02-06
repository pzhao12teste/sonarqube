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
import DeferredSpinner from '../../../components/common/DeferredSpinner';
import SimpleModal from '../../../components/controls/SimpleModal';
import ModalValidationField from '../../../components/controls/ModalValidationField';
import { Webhook } from '../../../app/types';
import { translate } from '../../../helpers/l10n';

interface Props {
  onClose: () => void;
  onDone: (data: { name: string; url: string }) => Promise<void>;
  webhook?: Webhook;
}

interface State {
  name: string;
  nameError?: string;
  url: string;
  urlError?: string;
}

export default class CreateWebhookForm extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { webhook } = props;
    const name = webhook ? webhook.name : '';
    const url = webhook ? webhook.url : '';
    this.state = {
      name,
      nameError: this.validateName(name),
      url,
      urlError: this.validateUrl(url)
    };
  }

  handleNameChange = (name: string) => {
    this.setState({ name, nameError: this.validateName(name) });
  };

  handleUrlChange = (url: string) => {
    this.setState({ url, urlError: this.validateUrl(url) });
  };

  handleSubmit = () => {
    if (!this.isValid()) {
      return undefined;
    }
    return this.props
      .onDone({ name: this.state.name, url: this.state.url })
      .then(this.props.onClose);
  };

  isValid = () => {
    return !this.state.nameError && !this.state.urlError;
  };

  validateName = (name: string) => {
    if (!name.trim()) {
      return translate('webhooks.name.required');
    }
    return undefined;
  };

  validateUrl = (url: string) => {
    if (!url.trim()) {
      return translate('webhooks.url.required');
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return translate('webhooks.url.bad_protocol');
    }
    if (url.indexOf(':', 6) > 0 && url.indexOf('@') <= 0) {
      return translate('webhooks.url.bad_auth');
    }
    return undefined;
  };

  render() {
    const isUpdate = !!this.props.webhook;
    const modalHeader = isUpdate ? translate('webhooks.update') : translate('webhooks.create');

    return (
      <SimpleModal header={modalHeader} onClose={this.props.onClose} onSubmit={this.handleSubmit}>
        {({ onCloseClick, onFormSubmit, submitting }) => (
          <form onSubmit={onFormSubmit}>
            <div className="modal-head">
              <h2>{modalHeader}</h2>
            </div>

            <div className="modal-body">
              <ModalValidationField
                error={this.state.nameError}
                label={
                  <label htmlFor="webhook-name">
                    {translate('webhooks.name')}
                    <em className="mandatory">*</em>
                  </label>
                }
                onChange={this.handleNameChange}
                value={this.state.name}>
                {({ className, onBlur, onChange, onFocus, value }) => (
                  <input
                    autoFocus={true}
                    className={className}
                    disabled={submitting}
                    id="webhook-name"
                    name="name"
                    onBlur={onBlur}
                    onChange={onChange}
                    onFocus={onFocus}
                    type="text"
                    value={value}
                  />
                )}
              </ModalValidationField>

              <ModalValidationField
                description={translate('webhooks.url.description')}
                error={this.state.urlError}
                label={
                  <label htmlFor="webhook-url">
                    {translate('webhooks.url')}
                    <em className="mandatory">*</em>
                  </label>
                }
                onChange={this.handleUrlChange}
                value={this.state.url}>
                {({ className, onBlur, onChange, onFocus, value }) => (
                  <input
                    className={className}
                    disabled={submitting}
                    id="webhook-url"
                    name="url"
                    onBlur={onBlur}
                    onChange={onChange}
                    onFocus={onFocus}
                    type="text"
                    value={value}
                  />
                )}
              </ModalValidationField>
            </div>

            <footer className="modal-foot">
              <DeferredSpinner className="spacer-right" loading={submitting} />
              <button disabled={submitting || !this.isValid()} type="submit">
                {isUpdate ? translate('update_verb') : translate('create')}
              </button>
              <button
                className="button-link"
                disabled={submitting}
                onClick={onCloseClick}
                type="reset">
                {translate('cancel')}
              </button>
            </footer>
          </form>
        )}
      </SimpleModal>
    );
  }
}
