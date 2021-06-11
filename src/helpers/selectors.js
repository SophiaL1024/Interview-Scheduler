
const getAppointmentsForDay = function(state, day) {

  const result = [];

  state.days.forEach(dayObj => {
    if (dayObj.name === day) {

      dayObj.appointments.forEach((appointment) => {
        result.push(state.appointments[appointment])
      })
    }
  })
  return result;
 
};

const getInterview = function(state, interview) {

  if (!interview) {
    return null;
  }
  const result = {};
  result.student = interview.student;
  result.interviewer = state.interviewers[interview.interviewer];

  return result;

};

const getInterviewersForDay = function(state, day) {

  const result = [];

  state.days.forEach(dayObj => {
    if (dayObj.name === day) {   
         
      dayObj.interviewers.forEach((interviewer) => {
        result.push(state.interviewers[interviewer])
      })
    }
  })
  return result;
}

export { getAppointmentsForDay, getInterview, getInterviewersForDay }