/** @format */
"use client";
import React from "react";
import Image from "next/image";
import ApiCard from "@components/Card";
import { authCheckState } from "@app/api-services/authService";

const APIs = () => {
  authCheckState()
  return (
    <div className="">
      <div>
        <div className="my-2">
          <p className="font-bold md:font-semibold text-2xl ml-2">
            H5 Integration
          </p>
          <div className="md:flex border-gray-800">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Create Order"
              description="Creates an Order."
            />
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Payment"
              description="Notify Payment"
            />
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Query Order"
              description="Query Order"
            />
          </div>
        </div>
        <div className="my-2">
          <p className="font-bold md:font-semibold text-2xl ml-2">
            Mini App Integration
          </p>
          <div className="md:flex">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="CreateOrder"
              description="Creates an Order."
            />
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Query Order"
              description="Query Order"
            />
          </div>
        </div>
        <div className="my-2">
          <p className="font-bold md:font-semibold text-2xl ml-2">
          Application Integration
          </p>
          <div className="md:flex">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="SDK Integration"
              description="SDK Integration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIs;
