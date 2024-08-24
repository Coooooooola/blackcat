import { Navigation } from '@src/components/Navigation/Navigation';
import { fetchQueryEvents, fetchQueryProfile } from '@src/fetch';
import { Paths } from '@src/share';
import { updateEvents, updateProfile } from '@src/redux/store.redux';
import { IEventBrief, IProfile, StoreState } from '@src/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Route, useHistory, useRouteMatch } from 'react-router-dom';
import SearchSvg from '@src/images/search.svg';
import HomeSvg from '@src/images/home.svg';
import { Search } from '@src/components/Search/Search';
import style from './Timeline.page.scss';
import { List } from '@src/components/List/List';
import { EventCard } from '@src/components/EventCard/EventCard';
import { EventDetailPage } from '../EventDetail/EventDetail.page';
import { ListItem } from '@src/components/List/virtual-list';

function useUserId() {
  const dispatch = useDispatch();
  const [{ id }, , removeCookie] = useCookies(['id']);
  useEffect(() => {
    let cancel = false;
    if (id != null) {
      fetchQueryProfile().then(
        user => {
          if (cancel) {
            return;
          }
          if (!user) {
            removeCookie('id');
            return;
          }
          dispatch(updateProfile(user));
        },
        () => removeCookie('id'),
      );
    }
    return () => {
      cancel = true;
    };
  }, [dispatch, id, removeCookie]);

  return id;
}

function useEvents(id: number | undefined) {
  const events = useSelector<StoreState, IEventBrief[] | null>(state => state.events);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id != null) {
      fetchQueryEvents(0, Number.MAX_SAFE_INTEGER, true).then(({ events }) => {
        dispatch(updateEvents(events));
      });
    }
  }, [dispatch, id]);
  return useMemo(() => events || [], [events]);
}

export function TimelinePage() {
  const userId = useUserId();
  const profile = useSelector<StoreState, IProfile | null>(state => state.profile);
  const [searchVisible, setSearchVisible] = useState(false);
  const { path } = useRouteMatch();
  const eventDetailPath = useMemo(() => `${path}/:eventId`, [path]);
  const match = useRouteMatch(eventDetailPath);
  const events = useEvents(userId);
  const history = useHistory();

  const listItems = useMemo(() => {
    return events.map(
      event =>
        new ListItem({
          key: `${event.id}`,
          defaultHeight: 200,
          content: <EventCard event={event} path={path} />,
        }),
    );
  }, [events, path]);

  if (userId == null) {
    return <Redirect to={Paths.Login} />;
  }

  return (
    profile && (
      <div className={style.viewport}>
        <div
          className={style.container}
          style={{ transform: searchVisible ? 'translate3d(240px, 0, 0)' : 'translateZ(0)' }}>
          <Search setVisible={setSearchVisible} />
          <Navigation profile={profile}>
            <>
              {match ? (
                <HomeSvg onClick={() => history.goBack()} />
              ) : (
                <SearchSvg onClick={() => setSearchVisible(visible => !visible)} />
              )}
              {searchVisible && (
                <div className={style.mask} onClick={() => setSearchVisible(false)} />
              )}
            </>
            <>
              <List visible={!match} listItems={listItems} buffer={200} />
              <Route path={eventDetailPath}>
                <EventDetailPage />
              </Route>
            </>
          </Navigation>
        </div>
      </div>
    )
  );
}
