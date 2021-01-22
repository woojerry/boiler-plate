import axios from 'axios';
import { LOGIN_USER, REGISTER_USER } from './types';

export function loginUser(dataToSubmit) {
  const request = axios // response에서 데이터 받아온 것이 request
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request, // 여기 payload가 user_reducer의 action.payload에 들어간다.
  };
}

export function registerUser(dataToSubmit) {
  const request = axios // response에서 데이터 받아온 것이 request
    .post('/api/users/register', dataToSubmit)
    .then((response) => response.data);
  return {
    type: REGISTER_USER,
    payload: request, // 여기 payload가 user_reducer의 action.payload
  };
}
