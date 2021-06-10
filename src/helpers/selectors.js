
const getAppointmentsForDay = function(state, day) {

  //... returns an array of appointments for that day
  const specificDay = state.days.filter((element) => day === element.name);


  const result = [];
  specificDay.forEach(element => {
    element.appointments.forEach((e) => {
      result.push(state.appointments[e]);

    })
  });
  return result;

};

const getInterview = function(state, interview) {
  if (!interview) {
    return null;
  }
  const result = {};
  result.student = interview.student;
  result.interviewer = state.interviewers[interview.interviewer];
  console.log(result);
  return result;

};

export { getAppointmentsForDay, getInterview }