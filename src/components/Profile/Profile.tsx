import React, { useState } from 'react';
import UserIconSvg from '@src/images/user.svg';
import style from './Profile.scss';

export function Profile({ url, className }: { url: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={className}>
      <img
        className={style.profileImg}
        src={url}
        style={{ display: loaded ? undefined : 'none' }}
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <UserIconSvg className={style.profileSvg} />}
    </div>
  );
}
