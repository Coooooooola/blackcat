import { i18nContext } from '@src/contexts';
import React, { Dispatch, ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import style from './Search.scss';
import SearchSvg from '@src/images/search.svg';
import cls from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '@src/types';
import { fetchQueryChannelNames, fetchQueryEvents } from '@src/fetch';
import { updateChannelNames, updateEvents } from '@src/redux/store.redux';

function SelectArea({
  className,
  title,
  children,
}: {
  className?: string;
  title: string;
  children: ReactElement[];
}) {
  return (
    <div className={cls(style.selectArea, className)}>
      <div className={style.selectTitle}>{title}</div>
      <div className={style.selectList}>{children}</div>
    </div>
  );
}

class DateOption {
  constructor(public text: string, public start: number, public end: number) {}
}

function useDateOptions() {
  const { search } = useContext(i18nContext);
  return useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const day = now.getDay();
    return [
      new DateOption(search.anytime, 0, Number.MAX_SAFE_INTEGER),
      new DateOption(
        search.today,
        new Date(year, month, date).getTime(),
        new Date(year, month, date + 1).getTime() - 1,
      ),
      // new DateOption(search.tomorrow, 0, 0),
      new DateOption(
        search.thisWeek,
        new Date(year, month, date - day + 1).getTime(),
        new Date(year, month, date + (7 - day + 1)).getTime() - 1,
      ),
      new DateOption(
        search.thisMonth,
        new Date(year, month, 1).getTime(),
        new Date(year, month + 1, 1).getTime() - 1,
      ),
      new DateOption(search.later, 0, 0),
    ];
  }, [search]);
}

function DateSelectArea({
  options,
  selectedDate,
  setSelectedDate,
}: {
  options: DateOption[];
  selectedDate: DateOption;
  setSelectedDate: Dispatch<DateOption>;
}) {
  const { search } = useContext(i18nContext);
  const items = useMemo(() => {
    return options.map((option, i) => {
      return (
        <div
          key={i}
          className={cls(style.selectText, selectedDate === option && style.active)}
          onClick={() => setSelectedDate(option)}>
          {option.text}
        </div>
      );
    });
  }, [options, selectedDate, setSelectedDate]);

  return <SelectArea title={search.date}>{items}</SelectArea>;
}

function useChannelNames() {
  const channelNames = useSelector<StoreState, string[] | null>(state => state.channelNames);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!channelNames) {
      fetchQueryChannelNames().then(({ channelNames }) => {
        dispatch(updateChannelNames(channelNames));
      });
    }
  }, [channelNames, dispatch]);
  return useMemo(() => channelNames || [], [channelNames]);
}

function ChannelSelectArea({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: true | string;
  setSelectedChannel: Dispatch<true | string>;
}) {
  const { search } = useContext(i18nContext);
  const channelNames = useChannelNames();
  const items = useMemo(() => {
    const stringItems = (channelNames || []).map((name, i) => {
      return (
        <div
          key={i}
          className={cls(style.selectChannel, selectedChannel === name && style.active)}
          onClick={() => setSelectedChannel(name)}>
          {name}
        </div>
      );
    });
    const allOption = (
      <div
        key="true"
        className={cls(style.selectChannel, selectedChannel === true && style.active)}
        onClick={() => setSelectedChannel(true)}>
        {search.all}
      </div>
    );
    return [allOption, ...stringItems];
  }, [channelNames, search.all, selectedChannel, setSelectedChannel]);

  return (
    <SelectArea className={style.channelArea} title={search.channel}>
      {items}
    </SelectArea>
  );
}

export function Search({ setVisible }: { setVisible: Dispatch<boolean> }) {
  const { search } = useContext(i18nContext);
  const dateOptions = useDateOptions();
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);
  const [selectedChannel, setSelectedChannel] = useState<true | string>(true);

  const { start, end } = selectedDate;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startDateString = `${startDate.getDate()}/${startDate.getMonth() + 1}`;
  const endDateString = `${endDate.getDate()}/${endDate.getMonth() + 1}`;
  const dispatch = useDispatch();

  function onClick() {
    fetchQueryEvents(start, end, selectedChannel === true || [selectedChannel]).then(
      ({ events }) => {
        dispatch(updateEvents(events));
        setVisible(false);
      },
    );
  }

  return (
    <div className={style.search}>
      <DateSelectArea
        options={dateOptions}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <ChannelSelectArea
        selectedChannel={selectedChannel}
        setSelectedChannel={setSelectedChannel}
      />
      <div className={style.searchBtn} onClick={onClick}>
        <div className={style.searchTextBox}>
          <div>
            <SearchSvg className={style.searchSvg} />
            {search.search}
          </div>
          <div className={style.searchHint}>
            {`${selectedChannel === true ? search.all : selectedChannel} `}
            activities
            {selectedDate !== dateOptions[0] && ` from ${startDateString} to ${endDateString}`}
          </div>
        </div>
      </div>
    </div>
  );
}
