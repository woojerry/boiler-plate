import { combineReducers } from 'redux'; // reducer들을 하나로 합쳐주는
import user from './user_reducer';

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
