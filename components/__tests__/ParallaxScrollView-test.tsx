import * as React from 'react';
import renderer from 'react-test-renderer';

import { Parallax } from '../ParallaxScrollView';

it(`renders correctly`, () => {
  const tree = renderer.create(<Parallax>Snapshot test!</Parallax>).toJSON();

  expect(tree).toMatchSnapshot();
});
