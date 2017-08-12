import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default ({ component: C, props: cProps, ...rest }) => (
  <Route {...rest} render={props => (
    cProps.userToken !== null
      ? <C {...props} {...cProps} />
      : <Redirect to={`/login?redirect=${props.location.pathname}${props.location.search}`} />
  )}/>
);

/*
We look at the props that are passed in to check if there is a user token. If a user
token is set, then we simply render the passed in component. And if the user token is
not set, then we use the Redirect React Rotuer v4 component to redirect the user to
the login page. We also pass in the current path to the login page (redirect in the
querystring). We will use this later to redirect us back after the user logs in.
*/
