import { useState, useEffect, useReducer } from "react";
import axios from 'axios';
axios.defaults.baseURL = "http://localhost:8001";

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function useApplicationData() {

  //after book an interview or cancel an interview, update remaining spots
  const getSpotsForDay = function(day, appointments) {
    let count = 0;

    day.appointments.forEach((appointmentId) => {
      if (!appointments[appointmentId].interview) {
        count++;
      }
    });
    return count;
  };


  const updateSpots = function(dayName, days, appointments) {

    const dayObj = days.find(day => day.name === dayName);
    const spots = getSpotsForDay(dayObj, appointments);
    const newDay = { ...dayObj };
    newDay.spots = spots;
    const newDays = days.map(day => day.name === dayName ? newDay : day);
    return newDays;
  };

  //use Reducer to set state
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const reducer = function(state, action) {
    switch (action.type) {
    case SET_DAY:
      return { ...state, "day": action.payload.day };
    case SET_APPLICATION_DATA:
      return { ...state, "days": action.payload.days, "appointments": action.payload.appointments, "interviewers": action.payload.interviewers };
    case SET_INTERVIEW: {

      //copy appointment by id and update interview
      const appointment = {
        ...state.appointments[action.payload.id],
        interview: action.payload.interview ? { ...action.payload.interview } : null
      };

      //copy appointments from states and update the appointment
      const appointments = {
        ...state.appointments,
        [action.payload.id]: appointment
      };
        //update new state for update spots function use
      const newState = { ...state, appointments };

      //find the changed day's name
      let dayName = "";
      newState.days.forEach(day => {
        day.appointments.forEach(appointmentId => {
          if (appointmentId === action.payload.id) {
            dayName = day.name;
          }
        });
      });
      //update spots and return new days obj
      const days = updateSpots(dayName, newState.days, appointments);

      return { ...newState, days };
    }

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
    }
  };

  //use Reducer
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //put all states in an object
  /* const [state, setState] = useState({
        day: "",
        days: [],
        appointments: {},
        interviewers: {}
    }); */

  //useState to set a day
  // const setDay = day => setState({ ...state, day });
  //useReduce to set a day
  const setDay = day => dispatch({ type: SET_DAY, payload: { day } });

  //use State to set application data, when first load
  /*   useEffect(() => {
      const setDays = days => setState(prev => ({ ...prev, days }));;
      const setAppointments = appointments => setState(prev => ({ ...prev, appointments }));;
      const setInterviewers = interviewers => setState(prev => ({ ...prev, interviewers }));;
  
      Promise.all([
        axios.get("http://localhost:8001/api/days"),
        axios.get(" http://localhost:8001/api/appointments"),
        axios.get(" http://localhost:8001/api/interviewers")
      ])
        .then((all) => {
          setDays(all[0].data);
          setAppointments(all[1].data);
          setInterviewers(all[2].data);
        })
    }, []); */

  //use Reducer to set application data, when first load
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
      .then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;
        const interviewers = all[2].data;
        dispatch({ type: SET_APPLICATION_DATA, payload: { days, appointments, interviewers } });
      });
  }, []);

  //set up web socket and dispatch "set_interview" action after receiving new data from API
  useEffect(() => {
    const webSocket = new WebSocket(REACT_APP_WEBSOCKET_URL);
    webSocket.addEventListener('message', (event) => {
      dispatch({
        type: JSON.parse(event.data).type,
        payload: {
          "id": JSON.parse(event.data).id,
          "interview": JSON.parse(event.data).interview
        }
      });
    });
  }, []);


  const bookInterview = function(id, interview) {

    //put the new interview to API databsae, and set state.
    //make bookInterview a promise
    return axios.put(`/api/appointments/${id} `, { interview })
    //use State hook to set a new interview
    /*  .then(() => setState({ ...state, appointments, days })); */

      //use Reducer to set a new interview
      .then(() => {
        dispatch({ type: SET_INTERVIEW, payload: { id, interview } });
      });
  };


  //delete an interview
  const cancelInterview = function(id) {

    return axios.delete(`/api/appointments/${id}`)
    //use State hook to set an interview to null
    /*   .then(() => setState({ ...state, appointments, days })) */

      //use Reducer to set an interview to null
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview: null } }));
  };


  return { state, setDay, bookInterview, cancelInterview };
}
