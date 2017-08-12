import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function querystring(name, url = window.location.href) {
  name = name.replace(/[[]]/g, "\\$&");

  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i");
  const results = regex.exec(url);

  if ( ! results) { return null; }
  if ( ! results[2]) { return ''; }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default ({ component: C, props: cProps, ...rest }) => {
  const redirect = querystring('redirect');
  return (
    <Route {...rest} render={props => (
      cProps.userToken === null
        ? <C {...props} {...cProps} />
        : <Redirect to={(redirect === '' || redirect === null)
            ? '/'
            : redirect} />
    )}/>
  );
};

/*
Here we are checking to ensure that the user token is not set before we render the
component that is passed in. And in the case where the user is logged in, we use the
Redirect component to simply send the user to the homepage.
*/
