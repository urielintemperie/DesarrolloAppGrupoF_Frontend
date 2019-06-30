import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import i18n from '_reducers/i18n'
import account from '_reducers/account'
import event from '_reducers/event'

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  i18n,
  account,
  event
});

export default rootReducer;