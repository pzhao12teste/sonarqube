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
import * as classNames from 'classnames';

type ValidateElement = HTMLInputElement | HTMLTextAreaElement;

interface Props {
  children: (
    props: {
      className?: string;
      onBlur: () => void;
      onChange: (evt: React.SyntheticEvent<ValidateElement>) => void;
      onFocus: () => void;
      value: string;
    }
  ) => React.ReactNode;
  description?: string;
  error: string | undefined;
  label?: React.ReactNode;
  onChange: (value: string) => void;
  value: string;
}

interface State {
  editing: boolean;
  touched: boolean;
}

export default class ModalValidationField extends React.PureComponent<Props, State> {
  state: State = { editing: false, touched: false };

  handleBlur = () => this.setState({ editing: false });

  handleChange = (evt: React.SyntheticEvent<ValidateElement>) => {
    if (!this.state.touched) {
      this.setState({ touched: true });
    }
    this.props.onChange(evt.currentTarget.value);
  };

  handleFocus = () => this.setState({ editing: true });

  render() {
    const { description, error, value } = this.props;
    const { editing, touched } = this.state;
    const isValid = error === undefined;
    const showError = touched && !editing && error !== undefined;
    return (
      <div className="modal-validation-field">
        {this.props.label}
        {this.props.children({
          className: classNames({
            'has-error': showError,
            'is-valid': isValid
          }),
          onBlur: this.handleBlur,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          value
        })}
        {showError && <i className="text-danger little-spacer-left icon-alert-error" />}
        {isValid && <i className="text-success little-spacer-left icon-alert-ok" />}
        {showError && <p className="text-danger">{error}</p>}
        {description && <div className="modal-field-description">{description}</div>}
      </div>
    );
  }
}
