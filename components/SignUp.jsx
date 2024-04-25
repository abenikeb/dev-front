/** @format */
"use client";
import { useState } from "react";
import Link from "next/link";
// import Button from "./UI/Button/Button";
import { Button } from "antd";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";

import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaMobile,
  FaKey,
  FaPaperPlane,
  FaPhone,
  FaFlag,
} from "react-icons/fa";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import React from "react";

const SignUpForm = ({
  type,
  data,
  setData,
  submitting,
  handleSubmit,
  onChange,
  error,
  errors,
  handleEmailVerification,
  countdown,
  isSending,
  emailVerificationError,
}) => {
  const objError = JSON.parse(errors);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="flex-center flex-col">
      <form onSubmit={handleSubmit} className="sign-up-form">
        <h1 className="text-left font-semibold font-satoshi text-xl">
          Create Your Account
        </h1>

        <label className="flex flex-col">
          <div className="form_input_wrap">
            <FaUser className="form_input_icon" />
            <input
              name="firstName"
              onChange={onChange}
              value={data.firstName}
              type="text"
              placeholder="First Name *"
              required
              className="form_input_inline"
            />
          </div>
          <small className="block">
            {objError && objError.firstName && (
              <span style={{ color: "red" }}>{objError.firstName}</span>
            )}
          </small>
        </label>

        <label className="flex flex-col">
          <div className="form_input_wrap">
            <FaUser className="form_input_icon" />
            <input
              name="lastName"
              onChange={onChange}
              value={data.lastName}
              type="text"
              placeholder="Father Name *"
              className="form_input_inline"
            />
          </div>
          <small className="block">
            {objError && objError.lastName && (
              <span style={{ color: "red" }}>{objError.lastName}</span>
            )}
          </small>
        </label>

        <label className="flex flex-col relative">
          <div className="form_input_wrap">
            <div className="flex items-center absolute left-7 top-[0.58rem]">
              <span className="bg-gray-50 text-black rounded-md p-1 text-sm">
                +251
              </span>
            </div>
            <FaPhone className="form_input_icon" />
            <input
              name="tel"
              onChange={onChange}
              value={data.tel}
              type="tel"
              placeholder="Phone Number *"
              required
              className="pl-[4.2rem] py-3 w-full rounded-lg border-gray-400 border-2" // Added padding for the icon
            />
          </div>
          <small className="block">
            {objError && objError.tel && (
              <span style={{ color: "red" }}>{objError.tel}</span>
            )}
          </small>
        </label>

        <label className="flex flex-col">
          <div className="form_input_wrap">
            <FaEnvelope className="form_input_icon" />
            <input
              name="email"
              onChange={onChange}
              value={data.email}
              type="email"
              placeholder="email *"
              required
              className="form_input_inline"
            />
          </div>
          <small className="block">
            {objError && objError.email && (
              <span style={{ color: "red" }}>{objError.email}</span>
            )}
          </small>
        </label>

        {/* Email Verification Code Input */}
        <div className="flex justify-start items-center gap-2">
          <div className="w-2/3 form_input_wrap">
            <FaEnvelope className="form_input_icon" />
            <input
              name="emailVerification"
              onChange={onChange}
              value={data.emailVerification}
              type="text"
              placeholder="Enter Verification Code *"
              className="form_input_inline"
            />
          </div>

          <button
            onClick={handleEmailVerification}
            type="button"
            disabled={isSending || countdown > 0}
            className={
              countdown > 0
                ? "w-1/3 rounded-md border border-gray-50 bg-lime-500 py-3 px-5 text-white transition-all hover:bg-lime-300 hover:text-black text-center text-sm font-inter flex items-center justify-center;"
                : "w-1/3 rounded-md border border-gray-50 bg-lime-500 py-3 px-5 text-white transition-all hover:bg-lime-300 hover:text-black text-center text-sm font-inter flex items-center justify-center cursor-pointer"
            }
          >
            {isSending
              ? "Sending..."
              : countdown > 0
              ? `Resend in ${Math.floor(countdown / 60)}:${countdown % 60}`
              : "Send"}
          </button>
        </div>
        <small>
          {emailVerificationError && (
            <span style={{ color: "red" }}>{emailVerificationError}</span>
          )}
        </small>

        {countdown > 0 && (
          <small>
            <span style={{ color: "green" }}>
              Please verify the code sent to your email.
            </span>
          </small>
        )}

        <label className="flex flex-col">
          <div className="form_input_wrap">
            <FaKey className="form_input_icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              name="password"
              onChange={onChange}
              value={data.password}
              className="form_input_inline"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          </div>
          <small className="block">
            {objError && objError.password && (
              <span style={{ color: "red" }}>{objError.password}</span>
            )}
          </small>
        </label>

        <label className="flex flex-col">
          <div className="form_input_wrap">
            <FaKey className="form_input_icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password *"
              name="confirmPassword"
              onChange={onChange}
              value={data.confirmPassword}
              className="form_input_inline"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
            <br />
          </div>
          <small>
            {objError && objError.confirmPassword && (
              <span style={{ color: "red" }}>{objError.confirmPassword}</span>
            )}
          </small>
        </label>

        <div className="flex flex-col mb-5 gap-4 mt-2">
          <Button
            type="primary"
            htmlType="submit"
            block
            className="h-12"
            style={{ backgroundColor: "#84cc16" }}
            disabled={submitting}
          >
            {submitting ? `Creating new Account...` : "Create My Account"}
          </Button>
        </div>

        {error && (
          <div className="text-base text-center text-red-500">{error}</div>
        )}

        {/* Signup Only */}
        <div className="flex jusify-center self-center my-5 gap-4">
          <div>
            Aleardy have an account ?
            <Link href="/guest/login" className="text-green">
              {" "}
              Login
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default withErrorHandler(SignUpForm);
