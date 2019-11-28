import React from "react";
import "./DayListItem.scss";

let classNames = require('classnames');

export default function DayListItem(props) {
  const dayClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  });

  const formatSpots = function (spots) {
    if (spots === 0) {
      return `no spots remaining`;
    }
    if (spots > 1) {
      return `${props.spots} spots remaining`;
    }
    if (spots > 0) {
      return `${props.spots} spot remaining`;
    }
  }

  return (
    <li onClick={() => props.setDay(props.name)} className= {dayClass} >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}



