import React from "react";
import DayListItem from "./DayListItem";
export default function DayList(props) {
  const { days, day, setDay } = props;
  const listItem = days.map((e) => {
    return <DayListItem
      key={e.id}
      name={e.name}
      spots={e.spots}
      selected={e.name === day}
      setDay={evant=>{setDay(e.name)} }/>
  })
  return (
    <ul>
      {listItem}
    </ul>
  )
}