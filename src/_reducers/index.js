import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { alert } from './alert.reducer';
import i18n from '_reducers/i18n'

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  alert,
  i18n,
});

export default rootReducer;