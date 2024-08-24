import { IEvent, IEventBit } from './event.interface';
import { Manager } from './manager';
import { User, UserBit } from './user';
import { randomInt } from '@server/utils';
import { IComment } from './comment.interface';

const enum ServerBit {
  ProfileBit = UserBit.Id | UserBit.Username | UserBit.Email | UserBit.ProfileUrl,
  EventBrief = IEventBit.Id |
    IEventBit.Title |
    IEventBit.Channel |
    IEventBit.Time |
    IEventBit.StartTime |
    IEventBit.EndTime |
    IEventBit.ImageUrls |
    IEventBit.Article,
  EventDetail = ~0,
}

export class ServerManager extends Manager {
  private sessionToUser = new Map<number, User>();

  constructor(users: User[], events: IEvent[]) {
    super(users, events);
  }

  getUser(session: number) {
    return this.sessionToUser.get(session) || null;
  }

  login(email: string, password: string) {
    const user = User.login(this.emailToUser, email, password);
    if (user) {
      const session = randomInt();
      this.sessionToUser.set(session, user);
      return { user: user.toJSON(ServerBit.ProfileBit), session };
    }
    return null;
  }

  queryProfile(arg: number | User) {
    const user = arg instanceof User ? arg : this.idToUser.get(arg) || null;
    return user && user.toJSON(ServerBit.ProfileBit);
  }

  queryChannelNames() {
    return this.channelNames;
  }

  queryEvents(user: User, startDate: number, endDate: number, channelNames: true | string[]) {
    const events = this.getEvents(startDate, endDate, channelNames);
    return events.map(event =>
      event.toJSON(ServerBit.EventBrief, {
        ownerMapper(user) {
          return user.toJSON(~0);
        },
        likesMapper(likes) {
          return { sum: likes.size, you: likes.has(user) };
        },
        goingsMapper(goings) {
          return { sum: goings.size, you: goings.has(user) };
        },
      }),
    );
  }

  queryEvent(id: number) {
    const event = this.getEvent(id);
    return (
      event &&
      event.toJSON(ServerBit.EventDetail, {
        ownerMapper({ username, profileUrl }) {
          return { username, profileUrl };
        },
        commentsMapper(comments) {
          return Array.from(comments).map(comment =>
            comment.toJSON({
              userMapper(user) {
                return user.toJSON(~0);
              },
            }),
          );
        },
        goingsMapper(goings) {
          return Array.from(goings).map(going => {
            return going.toJSON(~0);
          });
        },
        likesMapper(likes) {
          return Array.from(likes).map(like => {
            return like.toJSON(~0);
          });
        },
      })
    );
  }

  updateAction(user: User, eventId: number, like?: boolean, going?: boolean) {
    const event = this.getEvent(eventId);
    if (!event) {
      return false;
    }

    if (typeof like === 'boolean') {
      const liked = user.likeEvents.has(event);
      if (like === true) {
        if (!liked) {
          user.likeEvents.add(event);
          event.likes.add(user);
        }
      } else {
        if (liked) {
          user.likeEvents.delete(event);
          event.likes.delete(user);
        }
      }
    }

    if (typeof going === 'boolean') {
      const goinged = user.goingEvents.has(event);
      if (going === true) {
        if (!goinged) {
          user.goingEvents.add(event);
          event.goings.add(user);
        }
      } else if (going === false) {
        if (goinged) {
          user.goingEvents.delete(event);
          event.goings.delete(user);
        }
      }
    }

    return true;
  }

  updateComment(user: User, eventId: number, commentText: string) {
    const event = this.getEvent(eventId);
    if (!event) {
      return null;
    }
    const comment = new IComment(randomInt(), user, Date.now(), commentText);
    event.comments.add(comment);
    return comment.toJSON({
      userMapper(user) {
        return user.toJSON(~0);
      },
    });
  }
}
