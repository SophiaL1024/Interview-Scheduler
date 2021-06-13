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
    // setState({...state,copyDays})
    // console.log("appointmnets in update spots", appointments);

    return copyDays;
  }


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
    //copy days from states and update the spots
    const days = updateSpots(id, appointments);

    //put the new interview to API databsae, and set state.
    //make bookInterview a promise
    return axios.put(`http://localhost:8001/api/appointments/${id} `, { interview })
      .then(() => setState({ ...state, appointments, days }))
    // .then(() => updateSpots(id,appointments) )
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

    const days = updateSpots(id, appointments);

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => setState({ ...state, appointments,days }))
  }


  return { state, setDay, bookInterview, cancelInterview };
}