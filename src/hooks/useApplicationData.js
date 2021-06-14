import { useState, useEffect, useReducer } from "react";
import axios from 'axios';

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

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
          interview: action.payload.interview ? { ...action.payload.interview } : null
        };

        //copy appointments from states and update the appointment
        const appointments = {
          ...state.appointments,
          [action.payload.id]: appointment
        };

        return { ...state, appointments, "days": action.payload.days }
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

  //after book an interview or cancel an interview, update remaining spots
  const updateSpots = function(id, interview) {
    const copyDays = state.days.map(element => {
      return { ...element }
    });
    //copy appointment by id and update interview 
    const appointment = {
      ...state.appointments[id],
      interview: interview ? { ...interview } : null
    };

    //copy appointments from states and update the appointment 
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    //count interviews which is null
    let count = 0;
    const start = (id % 5) ? Math.floor(id / 5) * 5 + 1 : id - 4;
    const end = (id % 5) ? Math.floor(id / 5) * 5 + 5 : id;
    console.log("span:",start,end);
    for (let key = start; key <= end; key++) {
      console.log("appointments[key]:",appointments[key]);
      if (!appointments[key].interview) {
        count++;
      }
    }
    console.log(appointments);
    //update remaining spots
    copyDays[(id % 5) ? Math.floor(id / 5) : (id / 5 - 1)].spots = count;

    return copyDays;
  };

  //define a function to set day 
  //useState to set a day
  // const setDay = day => setState({ ...state, day });  
  //useReduce to set a day
  const setDay = day => dispatch({ type: SET_DAY, payload: { day } });

  //use State to set days, set appointments and set interviewers
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
      });


    const webSocket = new WebSocket(REACT_APP_WEBSOCKET_URL);

    webSocket.addEventListener('message', (event) => {
      // console.log(JSON.parse(event.data).type);
/*       console.log("JSON.parse(event.data).interview:", JSON.parse(event.data).interview);
      console.log("JSON.parse(event.data).id:", JSON.parse(event.data).id);
      dispatch({
        type: JSON.parse(event.data).type,
        payload: {
          "id": JSON.parse(event.data).id,
          "interview": JSON.parse(event.data).interview,
          "days": updateSpots(JSON.parse(event.data).id, JSON.parse(event.data).interview)
        }
      }); */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const bookInterview = function(id, interview) {

    //put the new interview to API databsae, and set state.
    //make bookInterview a promise
    return axios.put(`http://localhost:8001/api/appointments/${id} `, { interview })
      //use State hook to set a new interview
      /*  .then(() => setState({ ...state, appointments, days })); */

      //use Reducer to set a new interview
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview, "days": updateSpots(id, interview) } }))


  }


  //delete an interview
  const cancelInterview = function(id) {

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
      //use State hook to set an interview to null
      /*   .then(() => setState({ ...state, appointments, days })) */

      //use Reducer to set an interview to null
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview: null, "days": updateSpots(id, null) } }))

  }


  return { state, setDay, bookInterview, cancelInterview };
}
