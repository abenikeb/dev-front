/** @format */
"use client";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import ApiCard from "@components/Card";
import { getUserData } from "@app/api-services/authService";
// import { authCheckState } from "@app/api-services/authService";
import { useRouter } from "next/navigation";

const APIs = () => {
  const router = useRouter();
  // authCheckState();
  function atStartUp() {
    const userInfo = getUserData();
    const user_id = userInfo?.id;
    if (!user_id) return router.push("/guest/login");
  }

  useEffect(() => {
    atStartUp();
  }, []);
  return (
    <div className="">
      <div>
        <div className="my-4">
          <p className="font-bold md:font-semibold text-xl ml-2">
            H5 Integration
          </p>
          <div className="md:flex border-gray-800">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Web Payment H5"
              // description="Web Payment H5"
            />
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="B2C Web Checkout"
              // description="B2C Web Checkout"
            />
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="B2B Web Checkout"
              // description="B2B Web Checkout"
            />
          </div>
        </div>
        <div className="my-4">
          <p className="font-bold md:font-semibold text-xl ml-2">
            Mini App Integration
          </p>
          <div className="md:flex">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="MiniApp(Macle)"
              // description="MiniApp(Macle)"
            />
            {/* <ApiCard
              logo="/assets/images/query.svg"
              title="Query Order"
              description="Query Order"
            /> */}
          </div>
        </div>
        <div className="my-4">
          <p className="font-bold md:font-semibold text-xl ml-2">
            Subscription Payment Integration
          </p>
          <div className="md:flex border-gray-800">
            <ApiCard
              logo="/assets/images/create-order.svg"
              title="Subscription Payment"
              // description="Subscription Payment"
            />
          </div>
        </div>
        <div className="my-4">
          <p className="font-bold md:font-semibold text-xl ml-2">
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
