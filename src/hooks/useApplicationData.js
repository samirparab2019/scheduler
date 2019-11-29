
import React, { useState, useEffect, useReducer } from "react";
import axios from 'axios';
import "components/Application.scss";
export default function useApplicationData() {

  
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
        case SET_APPLICATION_DATA: 
          return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
        
          case SET_INTERVIEW: {
          return { ...state, appointments: action.appointments }
          }
          default:
            throw new Error(
              `Tried to reduce with unsupported action type: ${action.type}`
              );
            }
          }
          
          const [state, dispatch] = useReducer(reducer, {
            day: "Monday",
            days: [],
            appointments: {},
            interviewers: {}
          });

  const setDay = day => dispatch({ type: SET_DAY, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {...state.appointments, [id]: appointment};

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
    .then(() => {
      dispatch({ type: SET_INTERVIEW, appointments });
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {...state.appointments, [id]: appointment};
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(() => {
      dispatch({ type: SET_INTERVIEW, appointments: appointments });
    })
  }

  useEffect(() => {
    Promise.all([
      Promise.resolve(
        axios.get('http://localhost:8001/api/days')
        .then(res => {
          return res.data;
        })
      ),
      Promise.resolve(
        axios.get('http://localhost:8001/api/appointments')
        .then(res => {
          return res.data;
        })
      ),
      Promise.resolve(
        axios.get('http://localhost:8001/api/interviewers')
        .then(res => {
          return res.data;
        })
      ),
    ]).then((all) => {      
      dispatch({ type: SET_APPLICATION_DATA, days: all[0], appointments: all[1], interviewers: all[2] });
    });
    // eslint-disable-next-line
  }, []);

  return ({
    state, setDay, bookInterview, cancelInterview
  })
}