import React from "react";
import classNames from "classnames";
import "components/DayLIstItem.scss";
export default function DayListItem(props) {

  const itemClass=classNames("day-list__item",{
    "day-list__item--selected":props.selected,"day-list__item--full":props.spots===0
  });

  const formatSpots=()=>{
    if(props.spots===1){
      return "1 spot remaining"
    }
    return props.spots? props.spots+" spots remaining":"no spots remaining"
  };

  return (
    <li onClick={props.setDay} className={itemClass}>
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots()}</h3>
    </li>
  );
}