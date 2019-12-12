import React, { useState } from "react";
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

const Appointment = ({ props, id, time, interview, interviewers, bookInterview, cancelInterview, editInterview }) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

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
    transition(SAVING, true);
    bookInterview(id, interview)
    .then(res => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }
  function edit(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    editInterview(id, interview)
    .then(res => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
  }
  const onConfirm = () => {
    transition(DELETING, true);
    cancelInterview(id)
    .then(res => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
      
  };
  return (
    <article className='appointment' data-testid="appointment">
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
          name={interview.student}
          student={interview.student}
          interviewer={interview['interviewer']["id"]}
          interviewers={interviewers}
          onSave={edit}      
          onCancel={onCancel}
          onDelete={onDelete}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Cannot not cancel appointment." onClose={onCancel} />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Cannot not book appointment." onClose={onCancel} />
      )}
    </article>
  );
};
export default Appointment;