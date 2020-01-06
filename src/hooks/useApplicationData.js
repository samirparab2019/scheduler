
import { useEffect, useReducer } from "react";
import axios from 'axios';
import "components/Application.scss";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW,
  SPOTS_REMAINING
} from "../reducers/application";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  function bookInterview(id, interview) {
    const selectedDay = state.days[Math.floor(id / 5)];
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = { ...state.appointments, [id]: appointment };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        
          dispatch({ type: SPOTS_REMAINING, id: id, spots: selectedDay.spots - 1 });
        
        dispatch({ type: SET_INTERVIEW, appointments });
      });
  }

  function editInterview(id, interview) {
    const selectedDay = state.days[Math.floor(id / 5)];
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = { ...state.appointments, [id]: appointment };

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => {
        
          dispatch({ type: SPOTS_REMAINING, id: id, spots: selectedDay.spots });
        
        dispatch({ type: SET_INTERVIEW, appointments });
      });
  }

  

  function cancelInterview(id, interview) {
    const selectedDay = state.days[Math.floor(id / 5)];
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        dispatch({ type: SPOTS_REMAINING, id: id, spots: selectedDay.spots + 1 });
        dispatch({ type: SET_INTERVIEW, appointments: appointments });
      })
  }

  useEffect(() => {
    Promise.all([

      axios.get('/api/days')
        .then(res => {
          return res.data;
        }),

      axios.get('/api/appointments')
        .then(res => {
          return res.data;
        }),

      axios.get('/api/interviewers')
        .then(res => {
          return res.data;
        }),

    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0], appointments: all[1], interviewers: all[2] });
    });
    // eslint-disable-next-line
  }, []);

  return ({
    state, setDay, bookInterview, cancelInterview, editInterview
  })
}