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
import CreateWebhookForm from '../CreateWebhookForm';
import { submit, change } from '../../../../helpers/testUtils';

const webhook = { key: '1', name: 'foo', url: 'http://foo.bar' };

it('should render correctly when creating a new webhook', () => {
  expect(getWrapper()).toMatchSnapshot();
});

it('should render correctly when updating a webhook', () => {
  expect(getWrapper({ webhook })).toMatchSnapshot();
});

it('should correctly call onDone and onClose after submit', async () => {
  const onClose = jest.fn();
  const onDone = jest.fn(() => Promise.resolve());
  const wrapper = getWrapper({ onClose, onDone, webhook });
  submit(wrapper.find('form'));
  expect(wrapper).toMatchSnapshot();

  await new Promise(setImmediate);
  expect(onDone).toHaveBeenCalledWith({ name: webhook.name, url: webhook.url });
  expect(onClose).toHaveBeenCalled();
});

it('should prevent from calling onDone when the url is not valid', async () => {
  const onDone = jest.fn(() => Promise.resolve());
  const wrapper = getWrapper({ onDone });
  change(
    wrapper
      .find('ModalValidationField[description="webhooks.url.description"]')
      .dive()
      .find('input'),
    'www.foo.com'
  );
  submit(wrapper.find('form'));

  await new Promise(setImmediate);
  expect(onDone).not.toHaveBeenCalled();
});

function getWrapper(props = {}) {
  return shallow(
    <CreateWebhookForm onClose={jest.fn()} onDone={jest.fn(() => Promise.resolve())} {...props} />
  ).dive();
}
