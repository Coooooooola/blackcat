import { i18nContext } from '@src/contexts';
import { Paths } from '@src/share';
import React, { ChangeEvent, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import style from './Login.page.scss';
import LogoCatSvg from '@src/images/logo-cat.svg';
import UserSvg from '@src/images/user.svg';
import PasswordSvg from '@src/images/password.svg';
import cls from 'classnames';
import { fetchLogin } from '@src/fetch';

function useOnChange(setState: React.Dispatch<React.SetStateAction<string>>) {
  return function onChange({ currentTarget }: ChangeEvent<HTMLInputElement>) {
    setState(currentTarget.value);
  };
}

export function LoginPage() {
  const { login } = useContext(i18nContext);
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mailOnChange = useOnChange(setEmail);
  const passwordOnChange = useOnChange(setPassword);

  function onSignIn() {
    fetchLogin(email, password).then(({ status }) => {
      if (status === 'success') {
        history.push(Paths.Timeline);
      } else {
        setPassword('');
      }
    });
  }

  return (
    <div className={style.container}>
      <div className={style.main}>
        <div className={style.welcome}>{login.welcome}</div>
        <div className={style.name}>{login.name}</div>
        <LogoCatSvg className={style.logo} />

        <div className={cls(style.inputBox, style.emailInput)}>
          <UserSvg className={style.inputIcon} />
          <input
            className={style.input}
            value={email}
            onChange={mailOnChange}
            placeholder={login.email}
          />
        </div>
        <div className={cls(style.inputBox, style.passwordInput)}>
          <PasswordSvg className={style.inputIcon} />
          <input
            className={style.input}
            type="password"
            value={password}
            onChange={passwordOnChange}
            placeholder={login.password}
          />
        </div>
      </div>
      <div onClick={onSignIn} className={style.signIn}>
        {login.signIn}
      </div>
    </div>
  );
}
