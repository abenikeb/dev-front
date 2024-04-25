"use client"

import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import ToastyModal from "@components/UI/ToastyModal/ToastModal"

const withErrorHandler = (WrrapedComponent) => {
  console.log("This is an Interceptor handler")
  return (props) => {
    const [error, setError] = useState(null)
    const [viewModal, setViewModal] = useState(false);

    useEffect(() => {
      axios.interceptors.request.use((req) => {
        setError({ error: null });
        setViewModal(false);
        return req;
      });

      axios.interceptors.response.use(
        null,
        (err) => {
          console.log("Interceptors Error", err)
          const ExpectedError =
            err.response &&
            err.response.status >= 400 &&
            err.response.status < 500;

          if (!ExpectedError) {
            console.log("ERROR 500", err.message)
            setError({ error: "Something went wrong" });
            setViewModal(true);
          }

          if (err.response.status === 401) {
            console.log("ERROR 401", err.message)
            setError({ error: "Something went wrong" });
            setViewModal(true);
          }

          if (err.response.status === 404) {
            console.log("ERROR 404", err.message)
            setError({ error: "Something went wrong" });
            setViewModal(true);
          }

          return Promise.reject(err);
        }
      );
    }, [])

    const ForumModal = (
      <div>
        {error && <h3 className="font-bold text-white flex flex-row justify-center items-center">{error?.error} </h3>}
      </div>
    )

    const handleModalClose = () => {
      setViewModal(false)
    }

    return (
      <>
        {error?.error &&
          <ToastyModal status="fail" show={viewModal} closeModal={handleModalClose}>
            {ForumModal}
          </ToastyModal>}
        <WrrapedComponent {...props} />
      </>
    );
  }
};

export default withErrorHandler;
