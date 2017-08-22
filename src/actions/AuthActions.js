import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js';

import AWS from 'aws-sdk';
import config from '../awsconfig.js';

import {
  SET_AUTH_ACTION,
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  PASSWORD_CONFIRMATION_CHANGED,
  CONFIRMATION_CODE_CHANGED,
  SIGNUP_USER,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  CONFIRM_USER,
  CONFIRM_USER_SUCCESS,
  CONFIRM_USER_FAIL,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGOUT_USER,
  RENEW_USER_TOKEN,
  RENEW_USER_TOKEN_SUCCESS,
  RENEW_USER_TOKEN_FAIL
} from './types';

export const setAuthAction = (newAuthAction) => {
  return {
    type: SET_AUTH_ACTION,
    payload: newAuthAction
  };
};

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};

export const passwordConfirmationChanged = (text) => {
  return {
    type: PASSWORD_CONFIRMATION_CHANGED,
    payload: text
  };
};

export const confirmationCodeChanged = (text) => {
  return {
    type: CONFIRMATION_CODE_CHANGED,
    payload: text
  };
};

export const signupUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({ type: SIGNUP_USER });

    try {
      const newUser = await signup(email, password);
      signupSuccess(dispatch, newUser);
    }
    catch(e) {
      dispatch({
        type: SIGNUP_USER_FAIL,
        payload: e.message
      });
    }
  };
};

function signup(username, password) {
  const userPool = getUserPool();
  const attributeEmail = new CognitoUserAttribute({
    Name : 'email',
    Value : username
  });

  return new Promise((resolve, reject) => (
    userPool.signUp(username, password, [attributeEmail], null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result.user);
    })
  ));
}

const signupSuccess = (dispatch, newUser) => {
  dispatch({
    type: SIGNUP_USER_SUCCESS,
    payload: newUser
  });
  // Following a successful signup, get confirmation code
  dispatch({
    type: SET_AUTH_ACTION,
    payload: CONFIRM_USER
  });
};

export const confirmUser = (username, confirmationCode) => {
  return async (dispatch) => {
    dispatch({ type: CONFIRM_USER });
    try {
      const newUser = getUser(username);
      await confirm(newUser, confirmationCode);
      confirmSuccess(dispatch, newUser);
    }
    catch(e) {
      dispatch({
        type: CONFIRM_USER_FAIL,
        payload: e.message
      });
    }
  };
};

function confirm(user, confirmationCode) {
  return new Promise((resolve, reject) => (
    user.confirmRegistration(confirmationCode, true, function(err, result) {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    })
  ));
}

const confirmSuccess = (dispatch, newUser) => {
  dispatch({
    type: CONFIRM_USER_SUCCESS,
    payload: newUser
  });
  // Following successful confirmation, login (TODO: Do this automatically)
  dispatch({
    type: SET_AUTH_ACTION,
    payload: LOGIN_USER
  });
};

export const loginUser = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_USER });

    try {
      const userToken = await authenticate(email, password);
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: userToken
      });
    }
    catch(e) {
      authenticateFail(dispatch, e.message);
    }
  };
};

function authenticate(username, password) {
  const user = getUser(username);
  const authenticationData = {
    Username: username,
    Password: password
  };

  const authenticationDetails = new AuthenticationDetails(authenticationData);

  return new Promise((resolve, reject) => (
    user.authenticateUser(authenticationDetails, {
      onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
      onFailure: (err) => reject(err),
    })
  ));
}

const authenticateFail = (dispatch, error) => {
  //console.log('auth fail: ', error);
  switch (error) {
    case 'User is not confirmed.':
      dispatch({
        type: SET_AUTH_ACTION,
        payload: CONFIRM_USER
      });
      break;
    default:
      dispatch({
        type: LOGIN_USER_FAIL,
        payload: error
      });
  }
};

export const logoutUser = () => {
  const currentUser = getCurrentUser();
  if (currentUser !== null) {
    currentUser.signOut();
  }
  if (AWS.config.credentials) {
    AWS.config.credentials.clearCachedId();
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({ });
  }
  return { type: LOGOUT_USER };
};

export const renewUserToken = () => {
  return async (dispatch) => {
    try {
      const currentUser = getCurrentUser();
      if (currentUser !== null) {
        dispatch({ type: RENEW_USER_TOKEN });
        const userToken = await getUserToken(currentUser);
        dispatch({
          type: RENEW_USER_TOKEN_SUCCESS,
          payload: userToken
        });
      }
    }
    catch(e) {
      alert(e);
      dispatch({
        type: RENEW_USER_TOKEN_FAIL,
        payload: e.message
      });
    }
  };
};

function getUserToken(currentUser) {
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

function getUserPool() {
  return new CognitoUserPool({
    UserPoolId: config.cognito.USER_POOL_ID,
    ClientId: config.cognito.APP_CLIENT_ID
  });
}

function getCurrentUser() {
  const userPool = getUserPool();
  return userPool.getCurrentUser();
}

function getUser(username) {
  console.log('getUser: ', username)
  const userPool = getUserPool();
  return new CognitoUser({ Username: username, Pool: userPool });
}
