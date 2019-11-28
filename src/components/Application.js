
import DayList from "./DayList";
import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import axios from 'axios';
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors"
import "components/Application.scss";


export default function Application(props) {
  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState("Monday");

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then(() => {
      setState({ ...state, appointments });
    });
  }

  function cancelInterview(id) {
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      setState(state => ({...state, id, interview: null }));
    })
  }
  useEffect(() => {
    Promise.all([
      Promise.resolve(
        axios.get('http://localhost:8001/api/days')
        .then(res => {
          //console.log(res.data);
           return res.data;
        })

      ),
      Promise.resolve(
        axios.get('http://localhost:8001/api/appointments')
        .then(res => {
          //console.log(res.data);
          return res.data;
        })

      ),
      Promise.resolve(
        axios.get('http://localhost:8001/api/interviewers')

          .then(res => {
            //console.log(res.data);
            return res.data;
          })

      ),
    ]).then((all) => {
      //console.log("here=======>",all)
      setState(prev => ({ ...prev, days: all[0], appointments: all[1], interviewers: all[2] }));
    });
    // eslint-disable-next-line
  }, []);

  const appointments = getAppointmentsForDay(state, state.day);
  //console.log("hehehehehehehhehehhe", appointments)

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
        </section>
      </main>
    </React.Fragment>
  );
}