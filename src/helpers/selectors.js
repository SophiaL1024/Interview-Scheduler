
export function getAppointmentsForDay(state, day) {

  //... returns an array of appointments for that day
  const specificDay = state.days.filter((element) => day=== element.name);

  console.log(specificDay);
  
  const result = [];
  specificDay.forEach(element => {
    element.appointments.forEach((e)=>{
      result.push(state.appointments[e]);

    })
  });
  return result;

};

