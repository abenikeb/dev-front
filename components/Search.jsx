/** @format */

import React from "react";
import { FaSearch } from "react-icons/fa";

function SearchBar(props) {
  return (
    <div
      className="search-bar bg-white flex items-center rounded-sm py-1 m-7 w-3/5 sm:w-3/4"
      style={{
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        borderRadius: "5px",
        border: "1px solid #000",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <input
        type="text"
        placeholder="Search"
        className="ml-2"
        style={{ border: "none", outline: "none", flex: 1 }}
      />
      <FaSearch
        style={{
          margin: "10px",
          color: "8EC640",
          fontSize: "20px",
          fontWeight: "normal",
        }}
      />
    </div>
  );
}

export default SearchBar;
