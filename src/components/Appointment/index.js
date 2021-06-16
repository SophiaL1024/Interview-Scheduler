import React, { useEffect } from "react";
import "./index.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "../../hooks/useVisualMode";

const Appointment = (props) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR = "ERROR";
  // const ERROR_DELETE = "ERROR";


  //according to if there is an interview, switch mode between Empty and Show
  const { mode, transition, back, } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  //save an interview, pass it to Application component
  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    //show saving status while updating in progress
    transition(SAVING);

    // after save the new interview, transite to SHOW mode
    // transition(SHOW) must wait until the bookInterview executed successfully, or transition(SHOW) will run before new state setted.
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      // switch to ERROR mode, and replace the last mode which is SAVING, so when we go back, we will go to CREATE(<Form />)
      .catch(() => {
        transition(ERROR, true);
      });
  };

  const onDelete = function() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      })
      // switch to ERROR mode, and replace the last mode which is DELETE, so of we go back, we can go to CREATE(<Form />)
      .catch(() => transition(ERROR, true));
  };


  const onCancel = function() {
    back();
  };

  //conditionally switch mode after the client receiving data from webSocket to fix the stale state bug.
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);


  return <article data-testid="appointment" className="appointment">
    <Header time={props.time} />

    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && props.interview && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={() => transition(CONFIRM)}
        onEdit={() => transition(EDIT)}
      />
    )}
    {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={() => onCancel()} />}
    {mode === SAVING && <Status message="Saving" />}
    {mode === DELETING && <Status message="Deleting" />}
    {mode === CONFIRM && <Confirm message="Are you sure you would like to delete?" onCancel={() => onCancel()} onConfirm={() => onDelete()} />}
    {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} onSave={save} onCancel={() => back()} />}

    {mode === ERROR && <Error onCancel={() => onCancel()} />}
  </article>;
};

export default Appointment;

