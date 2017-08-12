import React from 'react';
import { Route } from 'react-router-dom';

/* This simple component creates a Route where the child component that it renders
 contains the passed in props.
*/
export default ({ component: C, props: cProps, ...rest }) => (
  <Route {...rest} render={ props => <C {...props} {...cProps} /> } />
);
