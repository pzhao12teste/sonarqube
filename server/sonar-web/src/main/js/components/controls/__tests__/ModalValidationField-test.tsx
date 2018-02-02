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
import { shallow } from 'enzyme';
import ModalValidationField from '../ModalValidationField';
import { change } from '../../../helpers/testUtils';

it('should display the field without any error/validation', () => {
  expect(getWrapper({ description: 'Describe Foo.' })).toMatchSnapshot();
});

it('should display the field as valid', () => {
  expect(getWrapper({ error: undefined })).toMatchSnapshot();
});

it('should display the field with an error after edition', () => {
  const onChange = jest.fn();
  const wrapper = getWrapper({ error: 'Wrong format', onChange });
  expect(wrapper.find('text-danger')).toHaveLength(0);
  change(wrapper.find('input'), 'foo');
  expect(onChange).toBeCalledWith('foo');
  expect(wrapper).toMatchSnapshot();
});

function getWrapper(props = {}) {
  return shallow(
    <ModalValidationField
      error="Is required"
      label={<label>Foo</label>}
      onChange={jest.fn()}
      value=""
      {...props}>
      {({ className, onBlur, onChange, onFocus, value }) => (
        <input
          className={className}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          type="text"
          value={value}
        />
      )}
    </ModalValidationField>
  );
}
