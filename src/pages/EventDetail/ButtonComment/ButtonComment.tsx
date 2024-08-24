import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import style from './ButtonComment.scss';
import SendSvg from '@src/images/send.svg';
import CrossSvg from '@src/images/cross.svg';
import { requestUpdateComment } from '@src/redux/actions.redux';

export function BottomComment({
  eventId,
  closeComment,
  placeholder,
  setPlaceholder,
}: {
  eventId: number;
  closeComment(): void;
  placeholder: string;
  setPlaceholder(text: string): void;
}) {
  const [text, setText] = useState('');
  const dispatch = useDispatch();
  return (
    <>
      <div className={style.inputBox}>
        <CrossSvg className={style.crossSvg} onClick={() => closeComment()} />
        <input
          className={style.input}
          autoFocus
          placeholder={placeholder}
          value={text}
          onChange={({ currentTarget: { value } }) => setText(value)}
        />
      </div>
      <div
        className={style.send}
        onClick={() => {
          if (text) {
            dispatch(requestUpdateComment(eventId, placeholder + ' ' + text));
            setPlaceholder('');
            closeComment();
          }
        }}>
        <SendSvg className={style.sendSvg} />
      </div>
    </>
  );
}
