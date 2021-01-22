import { LOGIN_USER, REGISTER_USER } from '../_actions/types';

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, loginSuccess: action.payload }; // response를 action.payload로 넣어준다.
      break;

    case REGISTER_USER:
      return { ...state, register: action.payload }; // response를 action.payload로 넣어준다.
      break;

    default:
      return state;
  }
}
