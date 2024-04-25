import React from "react";
import "./select.css";

const Select = ({ label, name, options, error, value, onChange }) => {
  return (
    <div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
        <select
          className="input-style"
          name={name}
          value={value}
          onChange={onChange}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
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

export default Select;
