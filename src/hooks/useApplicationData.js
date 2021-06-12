import { useState, useEffect } from "react";
import axios from 'axios';

export default function useApplicationData() {
  //put all states in an object
  const [state, setState] = useState({
    day: "",
    days: [],
    appointments: {},
    interviewers: {}
  });

  //define a function to set day 
  const setDay = day => setState({ ...state, day });

  //define functions to set days, set appointments and set interviewers
  useEffect(() => {
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
  }, []);

  const bookInterview = function(id, interview) {

    //copy appointment by id and update interview
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    //copy appointments from states and update the appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    //put the new interview to API databsae, and set state.
    //make bookInterview a promise
    return axios.put(`http://localhost:8001/api/appointments/${id} `, { interview })
      .then(() => setState({ ...state, appointments }));

  }
  //delete an interview
  const cancelInterview = function(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => setState({ ...state, appointments }))
  }


  return { state, setDay, bookInterview, cancelInterview };
}