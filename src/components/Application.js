import DayList from "./DayList";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"
import "components/Application.scss";
import useApplicationData from 'hooks/useApplicationData';

export default function Application(props) {
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    editInterview
  } = useApplicationData();

  const appointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
  
  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        editInterview={editInterview}
      />
    );
  });

  return (
    <React.Fragment>
      <main className="layout">
        <section className="sidebar">
          {/* Replace this with the sidebar elements during the "Environment Setup" activity. */}
          <img
            className="sidebar--centered"
            src="images/logo.png"
            alt="Interview Scheduler"
          />
          <hr className="sidebar__separator sidebar--centered" />
          <nav className="sidebar__menu">
            <DayList
              days={state.days} day={state.day} setDay={setDay}
            />
          </nav>
          <img
            className="sidebar__lhl sidebar--centered"
            src="images/lhl.png"
            alt="Lighthouse Labs"
          />
        </section>
        <section className="schedule">
          {schedule}
          {/* {appointments.map((appointment) => 
          <Appointment key={appointment.id} {...appointment} />)}
          <Appointment key="last" time="5pm" /> */}
          <Appointment key="last" time="5pm" />
        </section>
      </main>
    </React.Fragment>
  );
}