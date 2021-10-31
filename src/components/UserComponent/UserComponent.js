import React from 'react';
import { useState, useEffect } from "react";
import './UserComponent.scss';

const UserComponent = (props) => {
  var bigData = props.bigData;
  var [listItems, setListItems] = useState([]);

  useEffect(() => {
    if(listItems.length == 0 && bigData.wordBank.length > 0) {
      const tempList = bigData.wordBank.map((word, i) => <li key={i}>{word}</li>);
      setListItems(tempList);
    } else {
      // console.log(2, 'old', listItems.length, bigData.wordBank.length)
    }
  }, [bigData.wordBank]);

  

  return(
    <div className='UserComponent'>
      <div>
        <div>Word bank:</div> 
        <ul className='list_style'>{listItems}</ul>
      </div>
    </div>
    
  )
};

UserComponent.propTypes = {};

UserComponent.defaultProps = {};

export default UserComponent;
