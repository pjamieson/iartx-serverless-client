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
} from '../actions/types';

const INITIAL_STATE = {
  authAction: LOGIN_USER,
  confirmationCode: '',
  email: '',
  error: '',
  isLoading: false,
  isLogin: true,
  newUser: null,
  password: '',
  passwordConfirmation: '',
  userToken: '',
  isLoadingUserToken: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH_ACTION:
      return {
        ...state,
        authAction: action.payload,
        error: '',
        isLoading: false,
        isLogin: (action.payload === LOGIN_USER)
      };
    case EMAIL_CHANGED:
      return {
        ...state,
        email: action.payload
      };
    case PASSWORD_CHANGED:
      return {
        ...state,
        password: action.payload
      };
    case PASSWORD_CONFIRMATION_CHANGED:
      return {
        ...state,
        passwordConfirmation: action.payload
      };
    case CONFIRMATION_CODE_CHANGED:
      return {
        ...state,
        confirmationCode: action.payload
      };
      case SIGNUP_USER:
      case CONFIRM_USER:
      case LOGIN_USER:
        return {
          ...state,
          error: '',
          isLoading: true
        };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        error: '',
        isLoading: false,
        newUser: action.payload
      };
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        password: '',
        passwordConfirmation: '',
        isLoading: false
      };
      case CONFIRM_USER_SUCCESS:
        return {
          ...state,
          confirmationCode: '',
          error: '',
          isLoading: false,
          newUser: action.payload
        };
      case CONFIRM_USER_FAIL:
        return {
          ...state,
          confirmationCode: '',
          error: action.payload,
          isLoading: false
        };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        error: '',
        isLoading: false,
        userToken: action.payload,
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        password: '',
        isLoading: false
      };
    case LOGOUT_USER:
      return {
        ...state,
        ...INITIAL_STATE
      };
    case RENEW_USER_TOKEN:
      return {
        ...state,
        isLoadingUserToken: true
      };
    case RENEW_USER_TOKEN_SUCCESS:
      return {
        ...state,
        isLoadingUserToken: false,
        userToken: action.payload,
      };
    case RENEW_USER_TOKEN_FAIL:
      return {
        ...state,
        isLoadingUserToken: false,
        error: action.payload
      };
    default:
      return state;
  }
};
