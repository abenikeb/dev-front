import React from "react";
import "./Inputs.css";

const Input = ({ label, name, value, error, onChange, type = "text" }) => {
  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder="Type here"
          className="input-style"
        />
        <label className="label">
          {error && (
            <span className="label-text bg-red-400 text-white rounded-md w-full h-8 flex justify-center items-center">
              {error}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};

export default Input;
