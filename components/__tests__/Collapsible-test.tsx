import * as React from 'react';
import renderer from 'react-test-renderer';

import { Collapsible } from '../Collapsible';

it(`renders correctly`, () => {
  const tree = renderer.create(<Collapsible>Snapshot test!</Collapsible>).toJSON();

  expect(tree).toMatchSnapshot();
});
