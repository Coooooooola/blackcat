import { User } from './user';

export class IComment {
  constructor(public id: number, public user: User, public date: number, public content: string) {}

  toJSON<T>(mapper: { userMapper(user: User): T }) {
    const { id, user, date, content } = this;
    const { userMapper } = mapper;
    return {
      id,
      user: userMapper(user),
      date,
      content,
    };
  }
}
