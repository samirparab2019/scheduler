// Returns the Appointments for a given day (ex: Monday)
export function getAppointmentsForDay(state, day) {
  let result = [];
  const filteredDays = state.days.filter(itemId => itemId.name === day);

  if (filteredDays.length === 0) {

    return [];
  }

  filteredDays[0].appointments.forEach(itemId => {
    result.push(state.appointments[itemId]);
  });

  //console.log("wwwwwwwwwwwwwwwww", result)

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

// Returns the interviewers for a given day (ex: Monday)
export function getInterviewersForDay(state, day) {
  let result = [];
  const filteredDays = state.days.filter(itemId => itemId.name === day);
  
  if (filteredDays.length === 0) {
    return [];
  }

  for(let key in filteredDays[0].interviewers) {
    let newKey = filteredDays[0].interviewers[key];
    
    result[newKey]=state.interviewers[newKey];

  };
  const data = result.filter(el => el !== null);
 
  return data;
}



