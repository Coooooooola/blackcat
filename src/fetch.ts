import { IComment, IEventBrief, IEventDetail, IProfile } from './types';

enum Urls {
  Login = '/api/login',
  QueryProfile = '/api/query/profile',
  QueryChannelNames = '/api/query/channel-names',
  QueryEvents = '/api/query/events',
  QueryEvent = '/api/query/event',
  UpdateAction = '/api/update/action',
  UpdateComment = '/api/update/comment',
}

function safeToJson<T>() {
  return (res: Response) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json() as Promise<T>;
  };
}

export function fetchLogin(email: string, password: string) {
  return fetch(Urls.Login, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then(safeToJson<{ status: 'fail' | 'success' }>());
}

export function fetchQueryProfile() {
  return fetch(Urls.QueryProfile).then(safeToJson<IProfile | null>());
}

export function fetchQueryChannelNames() {
  return fetch(Urls.QueryChannelNames).then(safeToJson<{ channelNames: string[] }>());
}

export function fetchQueryEvents(startDate: number, endDate: number, channels: true | string[]) {
  return fetch(Urls.QueryEvents, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ startDate, endDate, channels }),
  }).then(safeToJson<{ events: IEventBrief[] }>());
}

export function fetchEventDetail(id: number) {
  return fetch(Urls.QueryEvent + '/' + id).then(safeToJson<{ event: IEventDetail | null }>());
}

export function fetchUpdateAction(eventId: number, like?: boolean, going?: boolean) {
  return fetch(Urls.UpdateAction, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventId, like, going }),
  }).then(safeToJson<{ success: boolean }>());
}

export function fetchUpdateComment(id: number, comment: string) {
  return fetch(Urls.UpdateComment, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, comment }),
  }).then(safeToJson<{ comment: IComment }>());
}
