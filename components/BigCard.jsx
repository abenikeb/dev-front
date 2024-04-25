import React from "react";

const BigCard = (props) => {
  return (
    <>
      <div className="card w-auto bg-base-100 shadow-xs border-none">
        <div className="card-body">
          <h2 className="card-title flex-center">{props.title} </h2>
          <p>{props.description}</p>
        </div>
      </div>
    </>
  );
};
export default BigCard;
