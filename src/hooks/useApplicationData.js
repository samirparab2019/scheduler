
import React, { useState, useEffect } from "react";

import axios from 'axios';

import "components/Application.scss";

export default function useApplicationData() {

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

  return ({
    state, setDay, bookInterview, cancelInterview
  })
}
