import * as React from 'react';
import renderer from 'react-test-renderer';

import { HelloWave } from '../HelloWave';

it(`renders correctly`, () => {
  const tree = renderer.create(<HelloWave>Snapshot test!</HelloWave>).toJSON();

  expect(tree).toMatchSnapshot();
});
