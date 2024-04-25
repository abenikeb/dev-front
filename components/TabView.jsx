import React from "react";
import BigCard from "@components/BigCard";
const TabView = ({ title, description }) => {
  return (
    <>
      <div className="card w-full bg-base-100 shadow-xs border-none">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {/*bottom card*/}
      <BigCard
        title={title}
        title_left="Content Title"
        description="content goes here"
        title_right="Content Title"
        content_right="content goes here"
      />
    </>
  );
};
export default TabView;
