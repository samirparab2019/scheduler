// Returns the Appointments for a given day (ex: Monday)
export function getAppointmentsForDay(state, day) {
  let result = [];
  const filteredDays = state.days.filter(itemId => itemId.name === day);

  if (filteredDays.length === 0) {
    return filteredDays;
  }

  filteredDays[0].appointments.forEach(itemId => {
    result.push(state.appointments[itemId]);
  });

  return result;
}

export function getInterview (state, interview) {
  if (interview) {
    let result = { student: interview.student };
    // console.log("heremmmmmmmmmmmmmmmmmmmmmmmm", state.interviewers)
    for (const key in state.interviewers) {
      if (interview.interviewer === Number(key)) {
        //console.log("aaaaaaaaaaaa", state.interviewers[key])
        result = { ...result, interviewer: {...state.interviewers[key]} };
      }
    }
    // console.log("bbbbbbbbbbb", result)
    return result;
  }
  return null;
};

