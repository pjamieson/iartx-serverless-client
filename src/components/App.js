import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import AWS from 'aws-sdk';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';

import config from '../awsconfig.js';
import Routes from '../Routes';
import RouteNavItem from './common/RouteNavItem';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true
    };
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({isLoadingUserToken: false});
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
    }
    catch(e) {
      alert(e);
    }

    this.setState({isLoadingUserToken: false});
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken: userToken
    });
  }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession(function(err, session) {
        if (err) {
            reject(err);
            return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    // Clear credentials from local storage in case another user uses that machine
    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({ });
    }

    this.updateUserToken(null);
    this.props.history.push('/login');
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
    };

    return !this.state.isLoadingUserToken &&
    (
      <div className="App container">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">iArtX</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <RouteNavItem onClick={this.handleNavLink} href="/">
                Home
              </RouteNavItem>
              <RouteNavItem onClick={this.handleNavLink} href="/notes">
                Art Collection Notes
              </RouteNavItem>
              <RouteNavItem onClick={this.handleNavLink} href="/about">
                About
              </RouteNavItem>
              <RouteNavItem onClick={this.handleNavLink} href="/contact">
                Contact
              </RouteNavItem>
            </Nav>
            <Nav pullRight>
              { this.state.userToken ?
                [
                  <RouteNavItem key={1} onClick={this.handleNavLink}
                    href="/profile">Profile</RouteNavItem>,
                  <NavItem key={2} onClick={this.handleLogout}>Logout</NavItem>
                ]
                :
                [
                  <RouteNavItem key={1} onClick={this.handleNavLink}
                    href="/signup">Signup</RouteNavItem>,
                  <RouteNavItem key={2} onClick={this.handleNavLink}
                    href="/login">Login</RouteNavItem>
                ]
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
