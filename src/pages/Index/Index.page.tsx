import { Paths } from '@src/share';
import React, { memo } from 'react';
import { useCookies } from 'react-cookie';
import { Redirect } from 'react-router-dom';

export const IndexPage = memo(function IndexPage() {
  const [{ id }] = useCookies(['id']);
  return <Redirect to={id != null ? Paths.Timeline : Paths.Login} />;
});
