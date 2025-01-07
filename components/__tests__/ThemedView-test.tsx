import * as React from 'react';
import renderer from 'react-test-renderer';

import { ThemedView } from '../ThemedView';

it(`renders correctly`, () => {
  const tree = renderer.create(<ThemedView>Snapshot test!</ThemedView>).toJSON();

  expect(tree).toMatchSnapshot();
});
