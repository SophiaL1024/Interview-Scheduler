
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

export {
  reducer,
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
};