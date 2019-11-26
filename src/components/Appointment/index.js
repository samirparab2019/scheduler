import React from 'react';
import "./styles.scss";
import Show from "./Show";
import Header from "./Header";
import Empty from "./Empty";

export default function Appointment(props) {
  return (props.interview ? <Show /> : <Empty />);
}

