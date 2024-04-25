import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { options, data } from "../../../plugins/BarChart";
import { DoughuntData } from "../../../plugins/DoughnutChart";

import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";

import "./LargeCard.css";

const LargeCard = ({ cardInfo }) => {
  let chart = <Bar options={options} data={data} width={270} height={300} />;
  if (cardInfo.title === "Customer Relations") {
    chart = <Doughnut data={DoughuntData} />;
  }
  return (
    <div className="card w-full shadow-sm rounded-sm bg-gray-100 p-4">
      <h1 className="large-card-title">{cardInfo.title}</h1>
      <div className="card-body-wrap">
        <section>
          <h2>Total</h2>
          <div className="sales-wrap">
            <FontAwesomeIcon
              icon="fa-solid fa-users"
              className="text-gray-400 text-2xl"
            />
            <p>{cardInfo.total}</p>
          </div>
          <p className="text-sm text-gray-600">{cardInfo.sub_title}</p>
          <p className="text-sm text-gray-500 mt-8">{cardInfo.description}</p>
        </section>

        <section>{chart}</section>
      </div>
    </div>
  );
};
export default LargeCard;
