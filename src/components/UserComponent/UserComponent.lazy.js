import React, { lazy, Suspense } from 'react';

const LazyUserComponent = lazy(() => import('./UserComponent'));

const UserComponent = props => (
  <Suspense fallback={null}>
    <LazyUserComponent {...props} />
  </Suspense>
);

export default UserComponent;
