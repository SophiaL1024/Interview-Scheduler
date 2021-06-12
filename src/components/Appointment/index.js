import React from "react";
import "./index.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import Status from "./Status"
import Confirm from "./Confirm"
import useVisualMode from "../../hooks/useVisualMode"

const Appointment = (props) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETE = "DELETE";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";

  //according to if there is an interview, switch mode between Empty and Show
  const { mode, transition, back } = useVisualMode(
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
      .then(() => { transition(SHOW) })
  }

  const onDelete = function(id) {

    // transition(CONFIRM);

    // transition(DELETE);

    props.cancelInterview(id)
    // transition(EMPTY) 

    // .then(()=>{ transition(EMPTY) })
  }

  const onEdit = function() {

    transition(EDIT);
  }

  return <article className="appointment">
    <Header time={props.time} />

    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={onDelete}
        appointmentId={props.id}
        onEdit={onEdit}
      />
    )}
    {mode === CREATE && <Form interviewers={props.interviewers} save={save} onCancel={() => back()} />}
    {mode === SAVING && <Status message="Saving" />}
    {mode === DELETE && <Status message="Deleting" />}
    {/* {mode === CONFIRM && <Confirm  message="Are you sure you would like to delete?" onCancel={() => back()} onConfirm={() => {}} />} */}
    {mode === EDIT && <Form name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers} save={save} onCancel={() => back()} />}
  </article>;
}

export default Appointment;

