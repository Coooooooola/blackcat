import { IComment } from './comment.interface';
import { User } from './user';

export const enum IEventBit {
  Id = 1 << 0,
  // Owner = 1 << 1,
  Channel = 1 << 2,
  Title = 1 << 3,
  Time = 1 << 4,
  // Goings = 1 << 5,
  // Likes = 1 << 6,
  Article = 1 << 7,
  ImageUrls = 1 << 8,
  StartTime = 1 << 9,
  EndTime = 1 << 10,
  Address = 1 << 11,
  AddressDetail = 1 << 12,
}

export class IEvent {
  constructor(
    public id: number,
    public owner: User,
    public channel: string,
    public title: string,
    public time: number,
    public startTime: number,
    public endTime: number,
    public goings: Set<User>,
    public likes: Set<User>,
    public article: string,
    public imageUrls: string[],
    public address: string,
    public addressDetail: string,
    public comments: Set<IComment>,
  ) {}

  toJSON<T, K, U, P>(
    bits: number,
    mapper?: {
      ownerMapper?(owner: User): T;
      goingsMapper?(goings: Set<User>): K;
      likesMapper?(likes: Set<User>): U;
      commentsMapper?(comments: Set<IComment>): P;
    },
  ) {
    const {
      id,
      owner,
      channel,
      title,
      time,
      startTime,
      endTime,
      goings,
      likes,
      article,
      imageUrls,
      address,
      addressDetail,
      comments,
    } = this;
    const { ownerMapper, goingsMapper, likesMapper, commentsMapper } = mapper || {};

    return {
      id: bits & IEventBit.Id ? id : undefined,
      owner: ownerMapper && ownerMapper(owner),
      channel: bits & IEventBit.Channel ? channel : undefined,
      title: bits & IEventBit.Title ? title : undefined,
      time: bits & IEventBit.Time ? time : undefined,
      startTime: bits & IEventBit.StartTime ? startTime : undefined,
      endTime: bits & IEventBit.EndTime ? endTime : undefined,
      goings: goingsMapper && goingsMapper(goings),
      likes: likesMapper && likesMapper(likes),
      article: bits & IEventBit.Article ? article : undefined,
      imageUrls: bits & IEventBit.ImageUrls ? imageUrls : undefined,
      comments: commentsMapper && commentsMapper(comments),
      address: bits & IEventBit.Address ? address : undefined,
      addressDetail: bits & IEventBit.AddressDetail ? addressDetail : undefined,
    };
  }
}
