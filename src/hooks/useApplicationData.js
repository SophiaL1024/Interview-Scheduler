import { useState, useEffect, useReducer } from "react";
import axios from 'axios';

export default function useApplicationData() {

  //use Reducer to set state
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, "day": action.payload.day }
      case SET_APPLICATION_DATA:
        return { ...state, "days": action.payload.days, "appointments": action.payload.appointments, "interviewers": action.payload.interviewers }
      case SET_INTERVIEW: {

        //copy appointment by id and update interview
        const appointment = {
          ...state.appointments[action.payload.id],
          interview: { ...action.payload.interview }
        };

        //copy appointments from states and update the appointment
        const appointments = {
          ...state.appointments,
          [action.payload.id]: appointment
        };
        return {...state,appointments}
      }
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  //put all states in an object
  /* const [state, setState] = useState({
        day: "",
        days: [],
        appointments: {},
        interviewers: {}
    }); */


  //use Reducer
  const [state, dispatch] = useReducer(reducer, {
    day: "",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //define a function to set day 
  // const setDay = day => setState({ ...state, day });  //useState to set a day
  const setDay = day => dispatch({ type: SET_DAY, payload: { day } }); //useReduce to set a day

  //define functions to set days, set appointments and set interviewers
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

  //use Reducer to set application data
  useEffect(() => {

    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get(" http://localhost:8001/api/appointments"),
      axios.get(" http://localhost:8001/api/interviewers")
    ])
      .then((all) => {
        const days = all[0].data;
        const appointments = all[1].data;
        const interviewers = all[2].data;
        dispatch({ type: SET_APPLICATION_DATA, payload: { days, appointments, interviewers } });
      })

  }, [])


  const updateSpots = function(id, appointments) {
    const copyDays = state.days.map(element => {
      return { ...element }
    });
    let count = 0;
    for (let key = (Math.floor(id / 5) + 1) * 1; key <= (Math.floor(id / 5) + 1) * 5; key++) {
      if (!appointments[key].interview) {
        count++;
      }
    }
    copyDays[Math.floor(id / 5)].spots = count;

    return copyDays;
  }


  const bookInterview = function(id, interview) {

    //copy appointment by id and update interview to useState
    /*     const appointment = {
          ...state.appointments[id],
          interview: { ...interview }
        }; */

    //copy appointments from states and update the appointment to useState
    /*     const appointments = {
          ...state.appointments,
          [id]: appointment
        }; */
    //copy days from states and update the spots
    /*    const days = updateSpots(id, appointments); */

    //put the new interview to API databsae, and set state.
    //make bookInterview a promise
    return axios.put(`http://localhost:8001/api/appointments/${id} `, { interview })
      //use State hook to set a new interview
      /*  .then(() => setState({ ...state, appointments, days })); */

      //use Reducer to set a new interview
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview } }))

  }


  //delete an interview
  const cancelInterview = function(id) {

    /*     const appointment = {
          ...state.appointments[id],
          interview: null
        };
        const appointments = {
          ...state.appointments,
          [id]: appointment
        };
    
        const days = updateSpots(id, appointments); */

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      //use State hook to set an interview to null
      /*   .then(() => setState({ ...state, appointments, days })) */

      //use Reducer to set an interview to null
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview: null } }))
  }


  return { state, setDay, bookInterview, cancelInterview };
}