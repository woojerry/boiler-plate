import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null) {
  // null   => 아무나 출입이 가능한 페이지
  // true   => 로그인한 유저만 출입이 가능한 페이지
  // false  => 로그인한 유저는 출입이 불가능한 페이지

  function AuthenticationCheck(props) {
    const dispatch = useDispatch();

    // 페이지가 이동할 때마다 dispatch해서 backend에 request 준다.
    useEffect(() => {
      // axios.get('/api/users/auth');
      dispatch(auth()).then((response) => {
        console.log(response);

        // 로그인 하지 않은 상태
        if (!response.payload.isAuth) {
          if (option === true) {
            props.history.push('/login');
          }
        } else {
          // 로그인한 상태
          if (adminRoute === true && !response.payload.isAdmin) {
            props.history.push('/');
          } else {
            if (option === false) props.history.push('/');
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
