import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Paths } from '@src/share';
import { LoginPage } from '../Login/Login.page';
import { TimelinePage } from '../Timeline/Timeline.page';
import { IndexPage } from '../Index/Index.page';
import style from './App.page.scss';

export function AppPage() {
  return (
    <div className={style.app}>
      <BrowserRouter>
        <Switch>
          <Route path={Paths.Login}>
            <LoginPage />
          </Route>
          <Route path={Paths.Timeline}>
            <TimelinePage />
          </Route>
          <Route exact path={Paths.Index}>
            <IndexPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}
