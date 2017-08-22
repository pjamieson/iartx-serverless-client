import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';

import { LOGIN_USER_SUCCESS, LOGOUT_USER } from '../actions/types';

const INITIAL_NAV_STATE = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Login')
);

export default (state = INITIAL_NAV_STATE, action) => {
  let nextState;
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Main' }),
        state
      );
      break;
    case LOGOUT_USER:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }
  return nextState || state;
};
