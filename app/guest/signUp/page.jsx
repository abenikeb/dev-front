/** @format */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  register,
  sendEmailVerification,
} from "../../api-services/userService";
import { loginWithJwt } from "../../api-services/authService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import { MiniLoading } from "@components/UI/miniLoading";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SignUp from "@components/SignUp";
import ReCAPTCHA from "react-google-recaptcha";
import { message } from "antd";
import { validateForm, validateEmailVerification } from "./validation";

const Sign_Up = () => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const [recaptchaUpToken, setRecaptchaUpToken] = useState("");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailVerification: "",
  });
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(null);
  const [emailVerificationError, setEmailVerificationError] = useState(null);
  const recaptchaRef = React.createRef();

  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0); // 1 minutes in seconds
  const [isEmailVerificationSend, setIsEmailVerificationSend] = useState(false); // 5 minutes in seconds

  const startCountdown = () => {
    setCountdown(60); // Reset the countdown
  };

  useEffect(() => {
    let timer;

    if (countdown > 0 && !isSending) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [countdown, isSending]);

  const handleInputChange = ({ currentTarget: input }) => {
    setUserData({ ...userData, [input.name]: input.value });
    setError(null);
  };

  async function doSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setError(null);
    const { error } = validateForm(userData);
    if (error) {
      handleValidationErrors(error);
      return;
    }
    // await recaptchaRef.current.execute();
    // createUser(token);
    createUser();
  }

  // function handleRecaptchaResolved(token) {
  //   setRecaptchaUpToken(token);
  //   createUser(token);
  // }

  const createUser = async () => {
    try {
      // if (recaptchaToken === "") {
      //   handleSubmissionRegistrationError("Recaptcha tokens are missing.");
      //   return;
      // }

      const { firstName, lastName, tel, email, password, emailVerification } =
        userData;

      const response = await register(
        firstName,
        lastName,
        tel,
        email,
        password,
        emailVerification,
        "recaptchaToken"
      );

      if (response.status === 201) {
        handleRegistrationSuccess(response);
      }
    } catch (ex) {
      handleApiError(ex);
    } finally {
      handleFinalization();
    }
  };

  // Helper functions:

  const handleSubmissionError = (errorMessage) => {
    console.error(errorMessage);
    setIsSubmitting(false);
  };

  const handleValidationErrors = (error) => {
    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.context.key] = detail.message;
    });
    setErrors(JSON.stringify(newErrors));
    setIsSubmitting(false);
  };

  const handleEmailVerification = async (event) => {
    event.preventDefault();
    const { password, confirmPassword, emailVerification, ...newUserData } =
      userData;
    const { error } = validateEmailVerification(newUserData);

    if (!isSending && countdown === 0) {
      if (error) {
        handleValidationErrors(error);
        return;
      } else {
        setEmailVerificationError(null);
        // Call your backend service to send email verification
        setIsSending(true);
        const response = await sendEmailVerification(userData.email);

        setIsSending(false);
        startCountdown();
      }
    }
  };

  const handleRegistrationSuccess = (response) => {
    loginWithJwt(response.headers["authorization"]);
    message.success("Registration Successful!.");
    router.push("/user/home");
    setIsSubmitting(false);
    setErrors(null);
    // recaptchaRef.current.reset();
  };

  const handleApiError = (ex) => {
    let errorMessage = "";
    if (ex.response && ex.response.data && ex.response.status === 400) {
      if (typeof ex.response.data === "string" && ex.response.data !== "") {
        errorMessage = ex.response.data;
      } else {
        errorMessage = ex.response.data?.message[0];
      }
      setError(errorMessage);
    } else {
      // setError("An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleFinalization = () => {
    setIsSubmitting(false);
    // recaptchaRef?.current?.reset();
    setIsEmailVerificationSend(false);
  };

  return (
    <>
      <nav className="sm:hidden flex fixed top-0 left-0 right-0 text-black items-center h-20 border-b-0 md:border-b-2 border-lime-500 shadow-sm z-auto">
        {/* Logo section */}
        <div className="w-full sm:h-full bg-white rounded-tr-3xl flex justify-between items-center px-3">
          <Link href="/">
            <Image
              src="/assets/images/et-logo-2.svg"
              alt="logo"
              width={160}
              height={150}
              className="object-contain"
            />
          </Link>
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
        <div />
      </nav>

      <section className="md:flex w-full">
        <div className="hidden sm:flex w-full md:w-1/2 bg-lime-500 flex-center">
          <Image
            src="/assets/images/signup-cover.svg"
            width={500}
            height={500}
            alt="Image"
            className="mt-20"
          />
        </div>

        <div className="shrink-0 w-full md:w-1/2 h-full bg-white">
          <SignUp
            type="SignUp"
            data={userData}
            setData={setUserData}
            submitting={submitting}
            handleSubmit={doSubmit}
            onChange={handleInputChange}
            errors={errors}
            error={error}
            countdown={countdown}
            isSending={isSending}
            handleEmailVerification={handleEmailVerification}
            emailVerificationError={emailVerificationError}
          />

          {/* <ReCAPTCHA
            ref={recaptchaRef}
            size="invisible"
            sitekey="6LcrqWgpAAAAANLxKIdQYcY6Cd2rp_Rsx20k6e1O"
            onChange={handleRecaptchaResolved}
          /> */}
        </div>
      </section>
      <MiniLoading isLoading={submitting} />
      <ToastContainer />
    </>
  );
};

export default withErrorHandler(Sign_Up);
