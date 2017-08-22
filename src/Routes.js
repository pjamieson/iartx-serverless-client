import React from 'react';
import { Route, Switch } from 'react-router-dom';

//import AppliedRoute from './components/common/AppliedRoute';
import AuthenticatedRoute from './components/common/AuthenticatedRoute';
//import UnauthenticatedRoute from './components/common/UnauthenticatedRoute';

import Home from './components/Home';
//import Signup from './components/auth/Signup';
import AuthForm from './components/auth/AuthForm';
import ArtistCreate from './components/artists/ArtistCreate';
import PaintingCreate from './components/paintings/PaintingCreate';
import PaintingDetail from './components/paintings/PaintingDetail';
import NotFound from './components/common/NotFound';

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={AuthForm} />
    <AuthenticatedRoute path="/artists/new" exact component={ArtistCreate} />
    <AuthenticatedRoute path="/paintings/new" exact component={PaintingCreate} />
    <AuthenticatedRoute path="/paintings/:id" exact component={PaintingDetail} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>
);
