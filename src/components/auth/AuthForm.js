import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Checkbox, FormGroup, FormControl, HelpBlock, ControlLabel } from 'react-bootstrap';

import { CONFIRM_USER, LOGIN_USER, SIGNUP_USER } from '../../actions/types';
import {
  setAuthAction,
  confirmationCodeChanged,
  emailChanged,
  passwordChanged,
  passwordConfirmationChanged,
  loginUser,
  signupUser,
  confirmUser
} from '../../actions';

import LoaderButton from '../../components/common/LoaderButton';
import './AuthForm.css';

class AuthForm extends Component {

  handleAuthActionChange = (event) => {
    const newAuthAction = event.target.checked ? LOGIN_USER : SIGNUP_USER;
    this.props.setAuthAction(newAuthAction);
  }

  onEmailChange(event) {
    this.props.emailChanged(event.target.value);
  }

  onPasswordChange(event) {
    this.props.passwordChanged(event.target.value);
  }

  onPasswordConfirmationChange(event) {
    this.props.passwordConfirmationChanged(event.target.value);
  }

  onConfirmationCodeChange(event) {
    this.props.confirmationCodeChanged(event.target.value);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { authAction, confirmationCode, email, password } = this.props;
    console.log('handleSubmit email: ', email)
    switch (authAction) {
      case SIGNUP_USER:
        this.props.signupUser({ email, password });
        break;
      case CONFIRM_USER:
        this.props.confirmUser(email, confirmationCode);
        break;
      default: // LOGIN_USER
        this.props.loginUser({ email, password });
    }
  }

  validateForm() {
    let isValid = true;
    switch (this.props.authAction) {
      case SIGNUP_USER:
        isValid = this.props.email.length > 7
          && this.props.password.length > 7
          && this.props.password === this.props.passwordConfirmation;
        break;
      case CONFIRM_USER:
        isValid = this.props.confirmationCode.length > 3;
        break;
      default: // LOGIN_USER
        isValid = this.props.email.length > 7
          && this.props.password.length > 7;
    }
    return isValid;
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId="confirmationCode" bsSize="large">
          <ControlLabel>Confirmation Code</ControlLabel>
          <FormControl autoFocus type="tel"
            value={this.props.confirmationCode}
            onChange={this.onConfirmationCodeChange.bind(this)} />
          <HelpBlock>To verify it's you who has newly signed up, please check your email for your confirmation code and enter it here.</HelpBlock>
        </FormGroup>
        <LoaderButton block type="submit" bsSize="large"
          disabled={ ! this.validateForm() } isLoading={this.props.isLoading}
          text="Confirm Signup" loadingText="Confirming…" />
          <h3>{ this.props.error }</h3>
      </form>
    );
  }

  renderSignupLoginForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Checkbox checked={this.props.isLogin}
          onChange={this.handleAuthActionChange.bind(this)}>
          I am a returning member
        </Checkbox>
        <FormGroup controlId="username" bsSize="large">
          <ControlLabel>Email</ControlLabel>
          <FormControl autoFocus type="email"
            value={this.props.email}
            onChange={this.onEmailChange.bind(this)} />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <ControlLabel>Password</ControlLabel>
          <FormControl type="password"
            value={this.props.password}
            onChange={this.onPasswordChange.bind(this)} />
        </FormGroup>
        <FormGroup controlId="passwordConfirmation" bsSize="large"
          hidden={ this.props.isLogin }>
          <ControlLabel>Password Confirmation</ControlLabel>
          <FormControl type="password"
            value={this.props.passwordConfirmation}
            onChange={this.onPasswordConfirmationChange.bind(this)} />
        </FormGroup>
        <LoaderButton block type="submit" bsSize="large"
          disabled={ ! this.validateForm() } isLoading={this.props.isLoading}
          text={ this.props.isLogin ? "Log In" : "Sign Up" }
          loadingText={ this.props.isLogin ? "Logging in..." : "Signing up..." } />
        <h3>{ this.props.error }</h3>
      </form>
    );
  }

  render() {
    if (this.props.userToken && this.props.userToken.length > 0) {
      return (
        <Redirect to="/" />
      );
    }
    return (
      <div className="AuthForm">
        { this.props.authAction === CONFIRM_USER
          ? this.renderConfirmationForm()
          : this.renderSignupLoginForm() }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { authAction, confirmationCode, email, error, isLoading, isLogin,
    newUser, password, passwordConfirmation, userToken } = state.auth;
  return { authAction, confirmationCode, email, error, isLoading, isLogin,
    newUser, password, passwordConfirmation, userToken };
};

export default withRouter(
  connect(mapStateToProps,
    {
      setAuthAction,
      emailChanged,
      passwordChanged,
      passwordConfirmationChanged,
      confirmationCodeChanged,
      loginUser,
      signupUser,
      confirmUser
    }
  )(AuthForm)
);
