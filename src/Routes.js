import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AppliedRoute from './components/common/AppliedRoute';
import AuthenticatedRoute from './components/common/AuthenticatedRoute';
import UnauthenticatedRoute from './components/common/UnauthenticatedRoute';

import Home from './components/Home';
import Signup from './components/auth/Signup';
import Login from './components/auth/Login';
import PaintingCreate from './components/paintings/PaintingCreate';
import PaintingDetail from './components/paintings/PaintingDetail';
import NotFound from './components/common/NotFound';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <UnauthenticatedRoute path="/signup" exact component={Signup} props={childProps} />
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps} />
    <AuthenticatedRoute path="/paintings/new" exact component={PaintingCreate} props={childProps} />
    <AuthenticatedRoute path="/paintings/:id" exact component={PaintingDetail} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
);
