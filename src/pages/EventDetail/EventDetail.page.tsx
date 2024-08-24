import { Profile } from '@src/components/Profile/Profile';
import { fetchEventDetail } from '@src/fetch';
import { updateEventDetail } from '@src/redux/store.redux';
import { IComment, IEventDetail, IProfile, StoreState } from '@src/types';
import React, {
  cloneElement,
  createRef,
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
  RefObject,
  UIEvent,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import style from './EventDetail.page.scss';
import cls from 'classnames';
import { emptyFunction } from '@src/share';
import CommentSvg from '@src/images/comment.svg';
import CommentOutlineSvg from '@src/images/comment-outline.svg';
import InfoSvg from '@src/images/info.svg';
import InfoOutlineSvg from '@src/images/info-outline.svg';
import PeopleSvg from '@src/images/people.svg';
import PeopleOutlineSvg from '@src/images/people-outline.svg';
import ReplySvg from '@src/images/reply.svg';
import CheckSvg from '@src/images/check.svg';
import CheckOutlineSvg from '@src/images/check-outline.svg';
import LikeSvg from '@src/images/like.svg';
import LikeOutlineSvg from '@src/images/like-outline.svg';
import CommentSingleSvg from '@src/images/comment-single.svg';
import DateFromSvg from '@src/images/date-from.svg';
import DateToSvg from '@src/images/date-to.svg';
import gmapPngUrl from '@src/images/gmap.png';
import { requestUpdateAction } from '@src/redux/actions.redux';
import { BottomComment } from './ButtonComment/ButtonComment';

function useDays(time: number) {
  return useMemo(() => {
    const now = Date.now();
    return Math.round((now - time) / (1000 * 3600 * 24));
  }, [time]);
}

function useEventDetail() {
  const id = +useParams<{ eventId: string }>().eventId;
  const dispatch = useDispatch();
  const eventDetail = useSelector<StoreState, IEventDetail | null>(state => state.eventDetail);
  useEffect(() => {
    fetchEventDetail(id).then(({ event }) => {
      if (event) {
        dispatch(updateEventDetail(event));
      }
    });
  }, [dispatch, id]);

  return eventDetail;
}

function Header({ eventDetail }: { eventDetail: IEventDetail }) {
  const {
    channel,
    title,
    owner: { username, profileUrl },
    time,
  } = eventDetail;
  const days = useDays(time);
  return (
    <div className={style.header}>
      <div className={style.channelLine}>
        <div className={style.channel}>{channel}</div>
      </div>
      <div className={style.titleLine}>{title}</div>
      <div className={style.profileLine}>
        <Profile className={style.profile} url={profileUrl} />
        <div className={style.textBox}>
          <div className={style.username}>{username}</div>
          <div className={style.date}>Published {days} days age</div>
        </div>
      </div>
    </div>
  );
}

interface AbstractTabProps {
  active?: boolean;
  activate?(scroll?: boolean): void;
}

interface TabProps extends AbstractTabProps {
  text: string;
  children: [ReactElement<{ className?: string }>, ReactElement<{ className?: string }>];
}

function Tab({ children, text, active = false, activate = emptyFunction }: TabProps) {
  const [defaultElement, activeElement] = children;
  return (
    <div className={cls(style.tab, active && style.active)} onClick={() => activate(true)}>
      {cloneElement(active ? activeElement : defaultElement, { className: style.icon })}
      {text}
    </div>
  );
}

interface TabNavigationProps {
  scrollerRef: RefObject<HTMLDivElement>;
  children: { tab: ReactElement<AbstractTabProps>; content: ReactElement }[];
}

function useInject(
  scrollerRef: RefObject<HTMLDivElement | null>,
  items: TabNavigationProps['children'],
) {
  const [activeIndex, setActiveIndex] = useState(0);
  return items.map(({ tab, content }, i) => {
    const ref = createRef<HTMLDivElement>();
    const activate = (scroll = false) => {
      setActiveIndex(i);
      const scroller = scrollerRef.current;
      const div = ref.current;
      if (scroller && scroll && activeIndex !== i && div) {
        scroller.scrollTop = div.offsetTop - 47;
      }
    };
    const clonedContent = cloneElement(content, { key: i, ref });
    const clonedTab = cloneElement(tab, {
      key: i,
      active: activeIndex === i,
      activate,
    });

    return {
      ref,
      activate,
      tab: clonedTab,
      content: clonedContent,
    };
  });
}

const TabNavigation = forwardRef(function TabNavigation(
  { scrollerRef, children }: TabNavigationProps,
  ref: ForwardedRef<{ onScroll(event: UIEvent): void }>,
) {
  const injectedItems = useInject(scrollerRef, children);

  useImperativeHandle(
    ref,
    () => ({
      onScroll({ currentTarget: { scrollTop } }) {
        for (const item of injectedItems) {
          const div = item.ref.current;
          if (div && div.offsetTop + div.offsetHeight > scrollTop + 47) {
            item.activate();
            break;
          }
        }
      },
    }),
    [injectedItems],
  );

  const tabs = injectedItems.map(({ tab }) => tab);
  const dividedTabs = tabs.slice(0, 1);
  for (let i = 1; i < tabs.length; i++) {
    dividedTabs.push(<div key={'.' + i} className={style.divider} />);
    dividedTabs.push(tabs[i]);
  }

  const contents = injectedItems.map(({ content }) => content);
  return (
    <div>
      <div className={style.tabs}>{dividedTabs}</div>
      <div>{contents}</div>
    </div>
  );
});

function Box({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cls(style.box, className)}>{children}</div>;
}

function SubTitle({ children }: { children: string }) {
  return (
    <div className={style.subTitle}>
      <div className={style.notice} />
      {children}
    </div>
  );
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function TimeDisplay({ icon, time }: { icon: ReactElement; time: number }) {
  const { dateText, hours, minutesText, ampm } = useMemo(() => {
    const date = new Date(time);
    const dateText = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
    let hours = date.getHours();
    hours = hours % 12;
    hours = hours || 12;
    const minutes = date.getMinutes();
    const minutesText = minutes < 10 ? '0' + minutes : '' + minutes;
    const ampm = hours >= 12 ? 'pm' : 'am';
    return { dateText, hours, ampm, minutesText };
  }, [time]);
  return (
    <div className={style.display}>
      <div className={style.timeDate}>
        {cloneElement(icon, { className: style.timeDateSvg })}
        {dateText}
      </div>
      <div>
        <span className={style.bigTime}>
          {hours}:{minutesText}
        </span>{' '}
        <span className={style.ampm}>{ampm}</span>
      </div>
    </div>
  );
}

const DetailsSection = forwardRef(function DetailsSection(
  { eventDetail }: { eventDetail: IEventDetail },
  ref: ForwardedRef<HTMLDivElement | null>,
) {
  const divRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => divRef.current);
  const { article, imageUrls, address, addressDetail, startTime, endTime } = eventDetail;
  const images = useMemo(() => {
    return imageUrls.map((url, i) => <img key={i} src={url} className={style.image} />);
  }, [imageUrls]);
  return (
    <div ref={divRef} className={style.section}>
      <Box>
        <div className={style.gallery}>{images}</div>
        <div className={style.article}>{article}</div>
      </Box>
      <div className={style.subDivider} />
      <Box>
        <div>
          <SubTitle>When</SubTitle>
          <div className={style.when}>
            <TimeDisplay icon={<DateFromSvg />} time={startTime} />
            <div className={style.timeDivider} />
            <TimeDisplay icon={<DateToSvg />} time={endTime} />
          </div>
        </div>
      </Box>
      <div className={style.subDivider} />
      <Box>
        <div>
          <SubTitle>Where</SubTitle>
          <div className={style.address}>{address}</div>
          <div className={style.addressDetail}>{addressDetail}</div>
          <img className={style.map} src={gmapPngUrl} />
        </div>
      </Box>
    </div>
  );
});

function Left({ text, icon }: { text: string; icon: ReactElement }) {
  return (
    <div className={style.participantLeft}>
      {icon}
      {text}
    </div>
  );
}

function Participants({ left, children }: { left: ReactElement; children: ReactElement[] }) {
  return (
    <Box className={style.participantBox}>
      {left}
      <div className={style.participantProfiles}>{children}</div>
    </Box>
  );
}

const ParticipantsSection = forwardRef(function ParticipantsSection(
  {
    profile,
    eventDetail,
  }: {
    profile: IProfile;
    eventDetail: IEventDetail;
  },
  ref: ForwardedRef<HTMLDivElement | null>,
) {
  const { goings, likes } = eventDetail;
  const youGoing = !!goings.find(going => going.id === profile.id);
  const youLike = !!likes.find(like => like.id === profile.id);
  const divRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => divRef.current);
  return (
    <div ref={divRef} className={style.section}>
      <Participants
        left={
          <Left
            icon={
              youGoing ? (
                <CheckSvg className={cls(style.participantSvg, style.goingSvg, style.active)} />
              ) : (
                <CheckOutlineSvg className={style.participantSvg} />
              )
            }
            text={goings.length + ' going'}
          />
        }>
        {goings.map(going => (
          <Profile className={style.participantProfile} key={going.id} url={going.profileUrl} />
        ))}
      </Participants>
      <div className={style.subDivider} />
      <Participants
        left={
          <Left
            icon={
              youLike ? (
                <LikeSvg className={cls(style.participantSvg, style.likeSvg, style.active)} />
              ) : (
                <LikeOutlineSvg className={style.participantSvg} />
              )
            }
            text={likes.length + ' like' + (likes.length <= 1 ? '' : 's')}
          />
        }>
        {likes.map(like => (
          <Profile className={style.participantProfile} key={like.id} url={like.profileUrl} />
        ))}
      </Participants>
    </div>
  );
});

function Comment({
  comment,
  commentReply,
}: {
  comment: IComment;
  commentReply(username: string): void;
}) {
  const {
    date,
    content,
    user: { username, profileUrl },
  } = comment;
  const days = useDays(date);
  return (
    <div className={style.comment}>
      <Profile url={profileUrl} className={style.commentProfile} />
      <div className={style.commentMiddle}>
        <div className={style.commentBrief}>
          <div className={style.commentUsername}>{username}</div>
          <div className={style.commentDate}>{days + ' day' + (days <= 1 ? '' : 's')} ago</div>
        </div>
        <div className={style.commentContent}>{content}</div>
      </div>
      <ReplySvg
        className={style.replySvg}
        onMouseDown={(event: MouseEvent) => {
          event.preventDefault();
        }}
        onClick={() => commentReply(username)}
      />
    </div>
  );
}

const CommentsSection = forwardRef(function CommentsSection(
  {
    eventDetail,
    commentReply,
  }: {
    eventDetail: IEventDetail;
    commentReply(username: string): void;
  },
  ref: ForwardedRef<HTMLDivElement | null>,
) {
  const divRef = useRef<HTMLDivElement>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => divRef.current);
  const comments = useMemo(() => {
    return eventDetail.comments
      .map(comment => <Comment key={comment.id} comment={comment} commentReply={commentReply} />)
      .reverse();
  }, [commentReply, eventDetail.comments]);
  return (
    <div ref={divRef} className={style.section}>
      <Box>{comments}</Box>
    </div>
  );
});

function BottomToolbar({
  profile,
  eventDetail,
  closeToolbar,
}: {
  profile: IProfile;
  eventDetail: IEventDetail;
  closeToolbar(): void;
}) {
  const dispatch = useDispatch();
  const youLike = !!eventDetail.likes.find(like => like.id === profile.id);
  const youGoing = !!eventDetail.goings.find(going => going.id === profile.id);
  return (
    <>
      <div className={style.bottomLeft}>
        <div className={style.bottomClickable} onClick={() => closeToolbar()}>
          <CommentSingleSvg className={style.bottomSvg} />
        </div>
        <div
          className={style.bottomClickable}
          onClick={() => dispatch(requestUpdateAction(eventDetail.id, !youLike))}>
          {youLike ? (
            <LikeSvg className={cls(style.bottomSvg, style.likeSvg, style.active)} />
          ) : (
            <LikeOutlineSvg className={style.bottomSvg} />
          )}
        </div>
      </div>
      <div
        className={cls(style.bottomRight, youGoing && style.active)}
        onClick={() => dispatch(requestUpdateAction(eventDetail.id, undefined, !youGoing))}>
        {youGoing ? (
          <CheckSvg className={cls(style.bottomSvg, style.goingSvg, style.active)} />
        ) : (
          <CheckOutlineSvg className={cls(style.bottomSvg, style.goingSvg)} />
        )}
        {youGoing ? 'I am going' : 'Join'}
      </div>
    </>
  );
}

export function EventDetailPage() {
  const profile = useSelector<StoreState, IProfile | null>(state => state.profile);
  const eventDetail = useEventDetail();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ref = useRef({ onScroll(_event: UIEvent) {} });
  const [placeholder, setPlaceholder] = useState('');
  const [toggleBottom, setToggleBottom] = useState(true);
  if (!eventDetail || !profile) {
    return null;
  }
  return (
    <div className={style.container}>
      <div
        ref={scrollerRef}
        className={style.scroller}
        onScroll={event => ref.current.onScroll(event)}>
        <Header eventDetail={eventDetail} />
        <TabNavigation scrollerRef={scrollerRef} ref={ref}>
          {[
            {
              tab: (
                <Tab text="Details">
                  <InfoOutlineSvg />
                  <InfoSvg />
                </Tab>
              ),
              content: <DetailsSection eventDetail={eventDetail} />,
            },
            {
              tab: (
                <Tab text="Participants">
                  <PeopleOutlineSvg />
                  <PeopleSvg />
                </Tab>
              ),
              content: <ParticipantsSection profile={profile} eventDetail={eventDetail} />,
            },
            {
              tab: (
                <Tab text="Comments">
                  <CommentOutlineSvg />
                  <CommentSvg />
                </Tab>
              ),
              content: (
                <CommentsSection
                  eventDetail={eventDetail}
                  commentReply={username => {
                    setPlaceholder('@' + username);
                    setToggleBottom(false);
                  }}
                />
              ),
            },
          ]}
        </TabNavigation>
      </div>
      <div className={style.bottom}>
        {toggleBottom ? (
          <BottomToolbar
            eventDetail={eventDetail}
            profile={profile}
            closeToolbar={() => setToggleBottom(false)}
          />
        ) : (
          <BottomComment
            eventId={eventDetail.id}
            closeComment={() => setToggleBottom(true)}
            placeholder={placeholder}
            setPlaceholder={setPlaceholder}
          />
        )}
      </div>
    </div>
  );
}
