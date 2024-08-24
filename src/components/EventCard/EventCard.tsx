import { IEventBrief } from '@src/types';
import React, { MouseEvent, ReactElement, useContext, useMemo } from 'react';
import { Profile } from '../Profile/Profile';
import style from './EventCard.scss';
import TimeSvg from '@src/images/time.svg';
import CheckSvg from '@src/images/check.svg';
import CheckOutlineSvg from '@src/images/check-outline.svg';
import LikeSvg from '@src/images/like.svg';
import LikeOutlineSvg from '@src/images/like-outline.svg';
import { i18nContext } from '@src/contexts';
import { useHistory } from 'react-router';
import cls from 'classnames';
import { useDispatch } from 'react-redux';
import { requestUpdateAction } from '@src/redux/actions.redux';

function useTimeText(time: number) {
  return useMemo(() => {
    const date = new Date(time);
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${date.getDate()} ${date.toLocaleString('default', {
      month: 'long',
    })} ${date.getFullYear()} ${hour < 10 ? '0' + hour : hour}:${
      minute < 10 ? '0' + minute : minute
    }`;
  }, [time]);
}

function Toggle({
  children,
  onClick,
}: {
  children: [ReactElement, string];
  onClick?(event: MouseEvent): void;
}) {
  const [icon, text] = children;
  return (
    <div onClick={onClick} className={style.toggle}>
      {icon}
      <div className={style.text}>{text}</div>
    </div>
  );
}

export function EventCard({ path, event }: { path: string; event: IEventBrief }) {
  const {
    id,
    title,
    startTime,
    endTime,
    article,
    channel,
    owner: { username, profileUrl },
    likes,
    goings,
  } = event;
  const { timeline } = useContext(i18nContext);

  const startText = useTimeText(startTime);
  const endText = useTimeText(endTime);

  const history = useHistory();

  function onClickCard() {
    history.push(`${path}/${id}`);
  }

  const dispatch = useDispatch();
  function onClickToggle(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div className={style.card} onClick={onClickCard}>
      <div className={style.firstLine}>
        <Profile className={style.profile} url={profileUrl} />
        <div className={style.username}>{username}</div>
        <div className={style.channel}>{channel}</div>
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.time}>
        <TimeSvg className={style.timeSvg} />
        <div className={style.timeText}>
          {startText} - {endText}
        </div>
      </div>
      <div className={style.article}>
        {article.length > 150 ? article.substr(0, 147) + '...' : article}
      </div>
      <div className={style.togglesLine}>
        <div className={style.toggleArea} onClick={onClickToggle}>
          <Toggle onClick={() => dispatch(requestUpdateAction(id, undefined, !goings.you))}>
            {goings.you ? (
              <CheckSvg className={cls(style.toggleIcon, style.confirmGoing)} />
            ) : (
              <CheckOutlineSvg className={cls(style.toggleIcon, style.going)} />
            )}
            {goings.you ? timeline.confirmGoing : goings.sum + ' ' + timeline.going}
          </Toggle>
          <Toggle onClick={() => dispatch(requestUpdateAction(id, !likes.you))}>
            {likes.you ? (
              <LikeSvg className={cls(style.toggleIcon, style.confirmLike)} />
            ) : (
              <LikeOutlineSvg className={cls(style.toggleIcon, style.like)} />
            )}
            {likes.you
              ? timeline.confirmLike
              : likes.sum + ' ' + (likes.sum <= 1 ? timeline.like : timeline.likes)}
          </Toggle>
        </div>
      </div>
    </div>
  );
}
