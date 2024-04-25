/** @format */

"use client";

import Link from "next/link";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData, login } from "../../api-services/authService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import ToastyModal from "@components/UI/ToastyModal/ToastModal";
import Form from "@components/Form";
import Image from "next/image";
import { MiniLoading } from "@components/UI/miniLoading";
import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { redirect } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = React.createRef();

  function atStartUp() {
    const userInfo = getUserData();
    const user_id = userInfo?.id;
    if (user_id) return router.push("/user/home");
  }

  useEffect(() => {
    atStartUp();
  }, []);

  const createData = async (e) => {
    e.preventDefault();
    // console.log("e", e);
    // await recaptchaRef.current.execute();
    handleRecaptchaResolved("captchaCode");
  };

  const handleRecaptchaResolved = async (captchaCode) => {
    try {
      setLoading(true);

      // if (!captchaCode || captchaCode === null) {
      //   setLoading(false);
      //   return;
      // }

      const { response } = await login(
        userData.email,
        userData.password,
        captchaCode
      );

      console.log("RES", response.status);
      if (response === "OK") {
        router.push("/user/home");
        setLoading(false);
      } else if (response.status === 400) {
        setError(response.data);
        setLoading(false);
      } else if (response.status === 401) {
        setError("Invalid user name or password");
        recaptchaRef.current.reset();
        setLoading(false);
      } else if (response.status === 423) {
        setError("User not Verified");
        recaptchaRef.current.reset();
        setLoading(false);
      }
    } catch (err) {
      console.log("ERROR", err);
      setLoading(false);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setViewModal(false);
  };

  const LoginSuccessMsg = (
    <div className="font-bold flex justify-center items-center">
      Successfully Login
    </div>
  );

  function showLoading() {
    var button = document.getElementById("loadingButton");
    button.classList.add("loading");

    setTimeout(function () {
      button.classList.remove("loading");
    }, 3000);
  }

  return (
    <>
      <nav className="flex fixed top-0 left-0 right-0 bg-transparent md:bg-lime-500 text-white justify-between items-center z-auto h-20 border-b-0 md:border-b-2 border-lime-500 shadow-sm">
        {/* Logo section */}
        <div className="w-64 sm:h-full bg-white rounded-tr-3xl flex justify-center items-center">
          <Link href="/">
            <Image
              src="/assets/images/et-logo-2.svg"
              alt="logo"
              width={160}
              height={150}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div />

        <div className="w-64 h-full bg-white rounded-tl-3xl flex justify-center items-center">
          <Link href="/" className="flex gap-2 ">
            <Image
              src="/assets/images/telebirr-logo-color.svg"
              alt="logo"
              width={160}
              height={160}
              className="object-contain"
            />
          </Link>
        </div>
      </nav>
      <div className="downpointer">
        <Image
          src="/assets/images/downpointer.svg"
          alt="logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
      <div className="w-full">
        <Form
          type="LOGIN"
          data={userData}
          setData={setUserData}
          submitting={submitting}
          handleSubmit={createData}
          error={error}
        />

        <div className="mt-4 p-8 text-black text-center">
          <p className="text-sm">
            Copyright 1894-2024 © Ethio telecom. All rights reserved.
          </p>
        </div>
      </div>

      {/* <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6LcrqWgpAAAAANLxKIdQYcY6Cd2rp_Rsx20k6e1O"
        onChange={handleRecaptchaResolved}
      /> */}

      {/* <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey="6LcrqWgpAAAAANLxKIdQYcY6Cd2rp_Rsx20k6e1O"
        onChange={handleRecaptchaResolved}
      /> */}
      <MiniLoading isLoading={loading} />
      <ToastyModal
        status="success"
        show={viewModal}
        closeModal={handleModalClose}
      >
        {LoginSuccessMsg}
      </ToastyModal>
    </>
  );
};

export default withErrorHandler(Login);
