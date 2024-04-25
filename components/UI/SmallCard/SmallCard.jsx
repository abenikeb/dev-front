import React from "react";
import "./smallCard.css";

const SmallCard = ({ cardInfo }) => {
  return (
    <div className="card w-96 shadow-sm rounded-sm bg-gray-100">
      <div className="card-body">
        <article className="card-actions justify-end">
          <button class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
              ></path>
            </svg>
          </button>
        </article>
        <h1 className="card-title">{cardInfo.title}</h1>

        <hr />
        <p className="card-sub-title">{cardInfo.sub_title}</p>
      </div>
    </div>
  );
};
export default SmallCard;
