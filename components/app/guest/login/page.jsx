/** @format */

"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../api-services/authService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import ToastyModal from "@components/UI/ToastyModal/ToastModal";
import Form from "@components/Form";
import Image from "next/image";
import { MiniLoading } from "@components/UI/miniLoading";
import React from "react";
const Login = () => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaRef = React.createRef();

  const createData = async (e) => {
    e.preventDefault();
    recaptchaRef.current.execute();
    setIsSubmitting(true);
  };

  const onReCAPTCHAChange = async (captchaCode) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      alert(`Recaptcha Fail`);
      return;
    }
    // Else reCAPTCHA was executed successfully so proceed with the
    // alert
    // alert(`Recaptcha Success`);
    // if (!captchaCode) {
    //   return;
    // }
    else {
      try {
        setLoading(true);
        const { response } = await login(
          userData.email,
          userData.password,
          captchaCode
        );
        console.log("RES", response.status);
        if (response === "OK") {
          router.replace("/user/home");
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        } else if (response.status === 400) {
          setError(response.data);
          setLoading(false);
        } else if (response.status === 401) {
          setError("Invalid user name or password");
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
      // alert(`Hey, capthacha}`);
      // recaptchaRef.current.reset();
    }
    // Reset the reCAPTCHA so that it can be executed again if user
    // submits another email.
  };

  const handleModalClose = () => {
    setViewModal(false);
  };

  const LoginSuccessMsg = (
    <div className="font-bold flex justify-center items-center">
      Successfully Login
    </div>
  );

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

      {/* <div className="uppointer">
        <Image
          src="/assets/images/uppointer.svg"
          alt="logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div> */}

      <Form
        type="Login"
        data={userData}
        setData={setUserData}
        submitting={submitting}
        handleSubmit={createData}
        error={error}
        recaptchaRef={recaptchaRef}
        onReCAPTCHAChange={onReCAPTCHAChange}
      />

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
