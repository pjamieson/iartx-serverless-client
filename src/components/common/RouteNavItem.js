import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { NavItem } from 'react-bootstrap';

// Set the NavItem's active prop for styling
class RouteNavItem extends Component {
  render() {
    // Strip off props unknown to <NavItem> to avoid warning
    const { match, location, history, staticContext, ...rest } = this.props;
    return (
      <Route path={this.props.href} exact children={({ match }) => (
        <NavItem {...rest} active={ match ? true : false }>
          { this.props.children }
        </NavItem>
      )}/>
    );
  }
}

export default withRouter(RouteNavItem);
