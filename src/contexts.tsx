import { createContext } from 'react';

export const i18nContext = createContext({
  login: {
    welcome: 'FIND THE MOST LOVED ACTIVITIES',
    name: 'BLACK CAT',
    email: 'Email',
    password: 'Password',
    signIn: 'SIGN IN',
  },
  search: {
    date: 'DATE',
    anytime: 'ANYTIME',
    today: 'TODAY',
    tomorrow: 'TOMORROW',
    thisWeek: 'THIS WEEK',
    thisMonth: 'THIS MONTH',
    later: 'LATER',

    channel: 'CHANNEL',
    all: 'All',

    search: 'SEARCH',
  },
  timeline: {
    going: 'Going',
    like: 'Like',
    likes: 'Likes',
    confirmGoing: 'I am going!',
    confirmLike: 'I like it',
  },
});
