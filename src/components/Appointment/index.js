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


const Appointment = ({ props, time, interview }) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  );

  const onAdd = () => transition(CREATE);
  // const onSave = () => transition(SHOW);
  const onCancel = () =>  back();

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => {
      transition(SHOW);
    });
  }
  return (
    <article className='appointment'>
      <Header time={time} />

      {mode === EMPTY && <Empty onAdd={onAdd} />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          />
      )}
      {mode === CREATE && (
        <Form 
        interviewers={[]} 
        onCancel={onCancel} 
        onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      







    </article>
  );
};
export default Appointment;