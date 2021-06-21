import {  useEffect, useReducer } from "react";
import axios from 'axios';
import {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/reducer";

axios.defaults.baseURL = "http://localhost:8001";

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

 
  const setDay = day => dispatch({ type: SET_DAY, payload: { day } });

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
      //use Reducer to set a new interview
      .then(() => {
        dispatch({ type: SET_INTERVIEW, payload: { id, interview } });
      });
  };


  //delete an interview
  const cancelInterview = function(id) {

    return axios.delete(`/api/appointments/${id}`)

      //use Reducer to set an interview to null
      .then(() => dispatch({ type: SET_INTERVIEW, payload: { id, interview: null } }));
  };


  return { state, setDay, bookInterview, cancelInterview };
}
