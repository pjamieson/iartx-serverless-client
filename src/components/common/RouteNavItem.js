import React from 'react';
import { Route } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

// Set the NavItem's active prop for styling
export default (props) => (
  <Route path={props.href} exact children={({ match }) => (
    <NavItem {...props} active={ match ? true : false }>
      { props.children }
    </NavItem>
  )}/>
);
