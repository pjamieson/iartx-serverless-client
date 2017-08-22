import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Nav, Navbar, NavItem } from 'react-bootstrap';

import { logoutUser, renewUserToken } from '../actions';
import RouteNavItem from './common/RouteNavItem';
import './NavBar.css';

class NavBar extends Component {

  componentDidMount() {
    this.props.renewUserToken();
  }

  logoutUser() {
    this.props.logoutUser();
    this.props.history.push('/login');
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleLogout = (event) => {
    this.logoutUser();
  }

  render() {
    return (
      <Navbar className="NavBar" fluid collapseOnSelect>
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
              Collection Notes
            </RouteNavItem>
            <RouteNavItem onClick={this.handleNavLink} href="/about">
              About
            </RouteNavItem>
            <RouteNavItem onClick={this.handleNavLink} href="/contact">
              Contact
            </RouteNavItem>
          </Nav>
          <Nav pullRight>
            { this.props.userToken && this.props.userToken.length > 0 ?
              [
                <RouteNavItem key={1} onClick={this.handleNavLink}
                  href="/profile">Profile</RouteNavItem>,
                <NavItem key={2} onClick={this.handleLogout}>Logout</NavItem>
              ]
              :
              <RouteNavItem onClick={this.handleNavLink} href="/login">
                { this.props.isLogin ? 'Login' : 'Signup' }
              </RouteNavItem>
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  const { isLogin, userToken } = state.auth;
  return { isLogin, userToken };
};

export default withRouter(
  connect(mapStateToProps, { logoutUser, renewUserToken })(NavBar)
);
