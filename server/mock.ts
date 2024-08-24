import faker from 'faker';
import { IComment } from './model/comment.interface';
import { IEvent } from './model/event.interface';
import { ServerManager } from './model/server-manager';
import { User } from './model/user';
import { randomInt } from './utils';

function emptySet<T>() {
  return new Set<T>();
}

const emptyUser = new User('', NaN, '', '', '', emptySet(), emptySet(), emptySet());

function mockComment(): IComment {
  return new IComment(randomInt(), emptyUser, faker.date.recent().getTime(), faker.lorem.words());
}

function mockIEvent(channelName: string): IEvent {
  return new IEvent(
    randomInt(),
    emptyUser,
    channelName,
    faker.name.title(),
    faker.date.recent().getTime(),
    faker.date.recent().getTime(),
    faker.date.recent().getTime(),
    emptySet(),
    emptySet(),
    faker.lorem.paragraphs(),
    [
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
      faker.image.imageUrl() + '?a=' + Math.random(),
    ],
    faker.address.streetName(),
    faker.address.streetAddress(),
    emptySet(),
  );
}

function mockUser(id?: number, email?: string, password?: string): User {
  return new User(
    password == null ? faker.internet.password() : password,
    id == null ? randomInt() : id,
    email == null ? faker.internet.email() : email,
    faker.internet.userName(),
    faker.image.avatar(),
    emptySet(),
    emptySet(),
    emptySet(),
  );
}

function randomUserIndex(size: number) {
  return Array.from(
    new Set(
      new Array(faker.datatype.number(size * 1.5))
        .fill(null)
        .map(() => faker.datatype.number(size - 1)),
    ),
  );
}

export function mock(size: number) {
  const eventTimes = 100;
  const commentsTimes = 20;
  const channelNames = new Array(9).fill(null).map(() => faker.lorem.word());

  const users = new Array(size).fill(null).map(() => mockUser());
  // users[0] = mockUser(0, 'fe@shopee.com', '1');
  users[0] = mockUser(0, '', '');

  const events = new Array(size * eventTimes)
    .fill(null)
    .map(() => mockIEvent(channelNames[faker.datatype.number(7)]));

  const comments = new Array(size * eventTimes * commentsTimes).fill(null).map(() => mockComment());
  for (let i = 0; i < comments.length; i++) {
    comments[i].user = users[i % size];
  }

  for (let i = 0; i < size; i++) {
    const user = users[i];

    for (let j = i * eventTimes; j < (i + 1) * eventTimes; j++) {
      const event = events[j];

      user.events.add(event);
      event.owner = user;

      for (let k = j * commentsTimes; k < (j + 1) * commentsTimes; k++) {
        const comment = comments[k];

        event.comments.add(comment);
      }

      for (const index of randomUserIndex(size)) {
        const user = users[index];
        event.likes.add(user);
        user.likeEvents.add(event);
      }
      for (const index of randomUserIndex(size)) {
        const user = users[index];
        event.goings.add(user);
        user.goingEvents.add(event);
      }
    }
  }

  return {
    serverManager: new ServerManager(users, events),
  };
}
