import React, { useEffect } from "react";
import "../Appointment/styles.scss";
import Show from "./Show";
import Header from "./Header";
import Empty from "./Empty";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";
import Application  from "../Application";


const Appointment = ({ props, id, time, interview, interviewers, bookInterview, cancelInterview }) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  );

  const onAdd = () => transition(CREATE);
  const onEdit = () => transition(EDIT);
  const onDelete = () => transition(CONFIRM);
  
  
  const onCancel = () =>  back();

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    bookInterview(id, interview)
    .then(res => 
      transition(SHOW)
    );
  }
  const onConfirm = () => {
    transition(DELETING, true);
    cancelInterview(id)
      .then(res => 
        transition(EMPTY)
      )
      
  };
  return (
    <article className='appointment'>
      <Header time={time} />

      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={onDelete}
          onEdit={onEdit}
          />
      )}
      {mode === CREATE && (
        <Form 
        interviewers={interviewers} 
        onCancel={onCancel} 
        onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === CONFIRM && (
        <Confirm
          message="Delete the appointment?"
          onConfirm={onConfirm}
          onCancel={onCancel}
          
        />
      )}
      {mode === EDIT && (
        <Form
          student={interview.student}
          interviewer={interview.interviewer}
          interviewers={interviewers}
          onSave={save}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}


    </article>
  );
};
export default Appointment;