import { IEvent } from './event.interface';

export const enum UserBit {
  Id = 1 << 0,
  Email = 1 << 1,
  Username = 1 << 2,
  ProfileUrl = 1 << 3,
  Following = 1 << 4,
  // Events = 1 << 5,
  // LikeEvents = 1 << 6,
  // GoingEvents = 1 << 7,
}

export class User {
  constructor(
    private password: string,
    public id: number,
    public email: string,
    public username: string,
    public profileUrl: string,
    public events: Set<IEvent>,
    public likeEvents: Set<IEvent>,
    public goingEvents: Set<IEvent>,
  ) {}

  toJSON<T, K, U>(
    bits: number,
    mapper?: {
      eventsMapper?(events: Set<IEvent>): T;
      likeEventsMapper?(event: Set<IEvent>): K;
      goingEventsMapper?(event: Set<IEvent>): U;
    },
  ) {
    const { id, email, username, profileUrl, events, likeEvents, goingEvents } = this;
    const { eventsMapper, likeEventsMapper, goingEventsMapper } = mapper || {};
    // assert(!!(bits & UserBit.Events) === !!eventMapper);
    // assert(!!(bits & UserBit.LikeEvents) === !!likeEventMapper);
    // assert(!!(bits & UserBit.GoingEvents) === !!goingEventMapper);

    return {
      id: bits & UserBit.Id ? id : undefined,
      email: bits & UserBit.Email ? email : undefined,
      username: bits & UserBit.Username ? username : undefined,
      profileUrl: bits & UserBit.ProfileUrl ? profileUrl : undefined,
      events: eventsMapper && eventsMapper(events),
      likeEvents: likeEventsMapper && likeEventsMapper(likeEvents),
      goingEvents: goingEventsMapper && goingEventsMapper(goingEvents),
    };
  }

  static login(emailToUser: Map<string, User>, email: string, password: string) {
    const user = emailToUser.get(email);
    return user && user.password === password ? user : null;
  }
}
