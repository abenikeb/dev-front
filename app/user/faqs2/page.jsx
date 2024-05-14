/** @format */

// import React, { useState } from 'react';
"use client";
import SearchBar from "@components/Search";
import { Collapse } from "antd";
const { Panel } = Collapse;
const text = (
  <p
    className="font-normal"
    style={{
      paddingLeft: 24,
      color: "#8EC640",
    }}
  >
    Your FAQ section should be seen as a constantly expanding source of value
    provided to your audience. It is a place where their ever-changing and
    growing requirements are not only met but anticipated and exceeded
    frequently.
  </p>
);
const FAQ = () => (
  <>
    <center>
      <p className="2xl:text-3xl sm:text-3xl font-bold">Search FAQ</p>
      <SearchBar />
    </center>
    <div>
      <Collapse bordered={false} defaultActiveKey={["1"]} className="mx-1">
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="Why telebirr"
          key="1"
        >
          {text}
        </Panel>
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="What types of businesses are eligible to engage with telebirr?"
          key="2"
        >
          {text}
        </Panel>
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="What is the price to integrate with telebirr?"
          key="3"
        >
          {text}
        </Panel>
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="Does telebirr accept currencies other than Birr?"
          key="4"
        >
          {text}
        </Panel>
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="Does telebirr offer any sort of discounts?"
          key="5"
        >
          {text}
        </Panel>
        <Panel
          className="bg-white mb-1.5 mx-1 font-bold"
          header="How can i get a shortcode on telebirr?"
          key="6"
        >
          {text}
        </Panel>
      </Collapse>
    </div>
  </>
);
export default FAQ;
