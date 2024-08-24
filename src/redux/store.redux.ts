import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { assert } from '../share';
import { IComment, IEventBrief, IEventDetail, IProfile, StoreState } from '../types';

enum Actions {
  UpdateLoginStatus,
  UpdateProfile,
  UpdateChannelNames,
  UpdateEvents,
  UpdateEventDetail,
  Like,
  UndoLike,
  Going,
  UndoGoing,
  UpdateComment,
}

function makeAction<T>(type: Actions) {
  return function action(payload: T) {
    return { type, payload };
  };
}

// export const updateLoginStatus = makeAction<LoginStatus>(Actions.UpdateLoginStatus);
export const updateProfile = makeAction<IProfile | null>(Actions.UpdateProfile);
export const updateChannelNames = makeAction<string[] | null>(Actions.UpdateChannelNames);
export const updateEvents = makeAction<IEventBrief[] | null>(Actions.UpdateEvents);
export const updateEventDetail = makeAction<IEventDetail | null>(Actions.UpdateEventDetail);
export const like = makeAction<number>(Actions.Like);
export const undoLike = makeAction<number>(Actions.UndoLike);
export const going = makeAction<number>(Actions.Going);
export const UndoGoing = makeAction<number>(Actions.UndoGoing);
export const updateComment = makeAction<IComment>(Actions.UpdateComment);

const initialState: StoreState = {
  // loginStatus: LoginStatus.Pending,
  profile: null,
  channelNames: null,
  events: null,
  eventDetail: null,
};

function reducer(
  state = initialState,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { type, payload }: { type: number | string; payload: any },
): StoreState {
  switch (type) {
    // case Actions.UpdateLoginStatus:
    //   return { ...state, LoginStatus: payload };
    case Actions.UpdateProfile:
      return { ...state, profile: payload };
    case Actions.UpdateChannelNames:
      return { ...state, channelNames: payload };
    case Actions.UpdateEvents:
      return { ...state, events: payload };
    case Actions.UpdateEventDetail:
      return { ...state, eventDetail: payload };
    case Actions.UndoLike:
    case Actions.Like: {
      const isLike = type === Actions.Like;

      const { profile, eventDetail, events } = state;
      assert(profile && events);
      const index = events.findIndex(e => e.id === payload);
      assert(index !== -1);
      const event = events[index];

      const nextEvents = events.slice();
      nextEvents[index] = {
        ...event,
        likes: { you: isLike, sum: event.likes.sum + (isLike ? 1 : -1) },
      };

      let nextEventDetail: IEventDetail | null;
      if (!eventDetail) {
        nextEventDetail = eventDetail;
      } else {
        const likes = eventDetail.likes.slice();
        if (isLike) {
          likes.push(profile);
        } else {
          likes.splice(
            likes.findIndex(user => user.id === profile.id),
            1,
          );
        }
        nextEventDetail = { ...eventDetail, likes };
      }

      return { ...state, events: nextEvents, eventDetail: nextEventDetail };
    }
    case Actions.Going:
    case Actions.UndoGoing: {
      const isGoing = type === Actions.Going;

      const { profile, eventDetail, events } = state;
      assert(profile && events);
      const index = events.findIndex(e => e.id === payload);
      assert(index !== -1);
      const event = events[index];

      const nextEvents = events.slice();
      nextEvents[index] = {
        ...event,
        goings: { you: isGoing, sum: event.goings.sum + (isGoing ? 1 : -1) },
      };

      let nextEventDetail: IEventDetail | null;
      if (!eventDetail) {
        nextEventDetail = eventDetail;
      } else {
        const goings = eventDetail.goings.slice();
        if (isGoing) {
          goings.push(profile);
        } else {
          goings.splice(
            goings.findIndex(user => user.id === profile.id),
            1,
          );
        }
        nextEventDetail = { ...eventDetail, goings };
      }

      return { ...state, events: nextEvents, eventDetail: nextEventDetail };
    }
    case Actions.UpdateComment: {
      const comment = payload;
      let nextEventDetail = state.eventDetail;
      if (nextEventDetail) {
        const nextComments = nextEventDetail.comments.slice();
        nextComments.push(comment);
        nextEventDetail = { ...nextEventDetail, comments: nextComments };
      }
      return { ...state, eventDetail: nextEventDetail };
    }
  }
  return state;
}

export const store = createStore(reducer, applyMiddleware(thunk));
