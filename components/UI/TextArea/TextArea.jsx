import React from "react";
import "./TextArea.css";

const TextArea = ({ label, name, value, error, onChange, type = "" }) => {
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
          placeholder="Type here"
          className="text-area-style"
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

export default TextArea;
