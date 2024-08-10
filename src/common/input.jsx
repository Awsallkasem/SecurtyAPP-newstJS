import React from "react";
const Input = (props) => {
  const { name, label, value, onChange, error } = props;
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        autoFocus
        value={value}
        name={name}
        onChange={onChange}
        ref={this.userName}
        id={name}
        type="text"
        className="form-control"
      />
     {error&&  <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
