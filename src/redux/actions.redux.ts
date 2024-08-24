import { unstable_batchedUpdates } from 'react-dom';
import { Dispatch } from 'redux';
import { fetchUpdateAction, fetchUpdateComment } from '../fetch';
import { going, like, UndoGoing, undoLike, updateComment } from './store.redux';

export function requestUpdateAction(eventId: number, isLike?: boolean, isGoing?: boolean) {
  return (dispatch: Dispatch) => {
    fetchUpdateAction(eventId, isLike, isGoing).then(({ success }) => {
      if (success) {
        unstable_batchedUpdates(() => {
          if (isLike !== undefined) {
            dispatch(isLike ? like(eventId) : undoLike(eventId));
          }
          if (isGoing !== undefined) {
            dispatch(isGoing ? going(eventId) : UndoGoing(eventId));
          }
        });
      }
    });
  };
}

export function requestUpdateComment(id: number, comment: string) {
  return (dispatch: Dispatch) => {
    fetchUpdateComment(id, comment).then(({ comment }) => {
      dispatch(updateComment(comment));
    });
  };
}
