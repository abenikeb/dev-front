/** @format */

"use client";

import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import { register } from "../../api-services/userService";
import { loginWithJwt } from "../../api-services/authService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import { MiniLoading } from "@components/UI/miniLoading";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Joi from "joi-browser";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { setCredential } from "@app/api-services/configService";
import SignUp from "@components/SignUp";

const Sign_Up = () => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState(null);
  const recaptchaRef = React.createRef();

  let schema = {
    firstName: Joi.string().min(3).max(50).required().label("First Name"),
    lastName: Joi.string().min(3).max(50).required().label("Last Name"),
    tel: Joi.number().required().label("Phone Number"),
    email: Joi.string().required(),
    password: Joi.string().min(6).required().label("Password"),
  };

  const validate = () => {
    setErrors(null);
    const options = { abortEarly: false };
    const { error } = Joi.validate(userData, schema, options);
    return error != null ? error : {};
  };

  const handleInputChange = ({ currentTarget: input }) => {
    setUserData({ ...userData, [input.name]: input.value })
    setError(null);
  }

  const createUser = async (e) => {
    e.preventDefault();
    recaptchaRef.current.execute();
    setIsSubmitting(true);
  };

  const onReCAPTCHAChange = async (captchaCode) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      // alert(`Recaptcha Fail`);
      setIsSubmitting(false);
      return;
    }

    // Else reCAPTCHA was executed successfully so proceed with the
    // alert
    // alert(`Recaptcha Success`);
    let errors = {};
    const error = validate();
    const errCount = Object.keys(error).length;

    if (errCount > 0) {
      for (let err of error.details) {
        errors[err.path[0]] = err.message;
      }
    }

    if (errCount > 0) {
      setErrors(Object.values(error)[2][0].message || {});
      setIsSubmitting(false);
      return;
    }

    try {
      const { firstName, lastName, tel, email, password } = userData;

      const response = await register(
        firstName,
        lastName,
        tel,
        email,
        password
        // captchaCode
      );

      if (response.status === 201) {
        loginWithJwt(response.headers["authorization"]);
        toast.success("User Registered Successfuly")
        setTimeout(() => {
          router.push("/user/home");

          // Cookies.get(user)
          setIsSubmitting(false);
          setErrors(null);
        }, 2000)
      }
    } catch (ex) {
      if (ex.response.status === 400) {
        console.log("EX", ex);
        setError(ex?.response?.data);
        setIsSubmitting(false);
      } else {
        setError("Something went wrong.");
        setIsSubmitting(false);
      }
    } finally {
      setIsSubmitting(false);
      setErrors(null);
      // recaptchaRef.current.reset();
    }
    // Reset the reCAPTCHA so that it can be executed again if user
    // submits another email.
  };

  return (
    <>
      {error && toast.error(error)}
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
          <img src="/assets/images/signup-cover.jpg" alt="signup-cover" className="w-[500px] h-[500px]" />
          {/* <Image
            src="/assets/images/signup-cover.jpg"
            width={500}
            height={500}
            alt="Image"
          /> */}
        </div>

        <div className="shrink-0 w-full md:w-1/2 h-full bg-white">
          <SignUp
            type="SignUp"
            data={userData}
            setData={setUserData}
            submitting={submitting}
            handleSubmit={createUser}
            onChange={handleInputChange}
            error={error}
            errors={errors}
            recaptchaRef={recaptchaRef}
            onReCAPTCHAChange={onReCAPTCHAChange}
          />
        </div>

      </section>
      <MiniLoading isLoading={submitting} />
      <ToastContainer />
    </>
  );
};

export default withErrorHandler(Sign_Up);
