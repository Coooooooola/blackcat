import React, { ReactElement } from 'react';
import LogoCatSvg from '@src/images/logo-cat.svg';
import { User } from '@src/types';
import style from './Navigation.scss';
import { Profile } from '../Profile/Profile';

export function Navigation({
  profile: { profileUrl },
  children,
}: {
  profile: User;
  children: [ReactElement, ReactElement];
}) {
  const [menuButton, mainPage] = children;
  return (
    <div className={style.container}>
      <div className={style.nav}>
        <div className={style.menuBtn}>{menuButton}</div>
        <LogoCatSvg className={style.logo} />
        <Profile className={style.profile} url={profileUrl} />
      </div>
      <div className={style.main}>{mainPage}</div>
    </div>
  );
}
