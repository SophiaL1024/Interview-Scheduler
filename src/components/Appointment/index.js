import React from "react";
import "./index.scss"
import Header from "./Header"
import Show from "./Show"
import Empty from "./Empty"
import Form from "./Form"
import Status from "./Status"
import useVisualMode from "../../hooks/useVisualMode"

const Appointment = (props) => {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

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
    transition(SAVING);

    props.bookInterview(props.id,interview);

    //after save the new interview, transite to SHOW mode
    transition(SHOW);
  }

  return <article className="appointment">
    <Header time={props.time} />

    {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    )}
    {mode=== CREATE && <Form interviewers={props.interviewers} save={save} onCancel={()=>transition(EMPTY)}/>}
    {mode===SAVING && <Status />}

  </article>;
}

export default Appointment;

