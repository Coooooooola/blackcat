import { IEvent } from './event.interface';
import { User } from './user';

export class Manager {
  protected idToUser = new Map<number, User>();
  protected emailToUser = new Map<string, User>();

  protected idToEvent = new Map<number, IEvent>();

  protected channelNames: string[];

  constructor(protected users: User[], protected events: IEvent[]) {
    for (const user of users) {
      const { id, email } = user;
      this.idToUser.set(id, user);
      this.emailToUser.set(email, user);
    }

    events.sort((a, b) => a.time - b.time);
    this.channelNames = Array.from(new Set(events.map(event => event.channel)));
    for (const event of events) {
      this.idToEvent.set(event.id, event);
    }
  }

  protected getChannelNames() {
    return this.channelNames;
  }

  protected getEvents(startTime: number, endTime: number, channelNames: true | string[]) {
    const { events } = this;
    const ret: IEvent[] = [];
    const startIndex = events.findIndex(event => event.time >= startTime);
    if (startIndex === -1) {
      return ret;
    }

    for (let i = startIndex; i < events.length && events[i].time <= endTime; i++) {
      if (channelNames === true || channelNames.includes(events[i].channel)) {
        ret.push(events[i]);
      }
    }
    return ret;
  }

  protected getEvent(eventId: number) {
    return this.idToEvent.get(eventId) || null;
  }
}
