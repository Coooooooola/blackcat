export interface IProfile {
  id: number;
  username: string;
  email: string;
  profileUrl: string;
}

export interface User {
  id: number;
  username: string;
  profileUrl: string;
}

export interface UserDetail extends User {
  email: string;
}

export interface IComment {
  id: number;
  user: User;
  date: number;
  content: string;
}

export interface IEventBrief {
  id: number;
  title: string;
  startTime: number;
  endTime: number;
  article: string;
  channel: string;
  owner: User;
  likes: { sum: number; you: boolean };
  goings: { sum: number; you: boolean };
}

export interface IEventDetail {
  id: number;
  title: string;
  time: number;
  startTime: number;
  endTime: number;
  article: string;
  channel: string;
  imageUrls: string[];
  address: string;
  addressDetail: string;
  owner: User;
  likes: User[];
  goings: User[];
  comments: IComment[];
}

export interface StoreState {
  profile: IProfile | null;
  channelNames: string[] | null;
  events: IEventBrief[] | null;
  eventDetail: IEventDetail | null;
}
