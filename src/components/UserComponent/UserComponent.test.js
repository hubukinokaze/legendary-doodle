import React from 'react';
import ReactDOM from 'react-dom';
import UserComponent from './UserComponent';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<UserComponent />, div);
  ReactDOM.unmountComponentAtNode(div);
});