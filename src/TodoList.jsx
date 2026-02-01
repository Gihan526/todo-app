import React from "react";

function TodoView(props) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      <p>Status: {props.status}</p>
      <p>Due Date: {props.due_data}</p>
      <p>User ID: {props.userid}</p>
      <p>Todo ID: {props.todoid}</p>
    </div>
  );
}

export default TodoView;