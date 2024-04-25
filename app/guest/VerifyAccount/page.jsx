/** @format */

"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../components/app/api-services/authService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import ToastyModal from "@components/UI/ToastyModal/ToastModal";
import Form from "@components/Form";
import Image from "next/image";
import { MiniLoading } from "@components/UI/miniLoading";
import React from "react";
import axios from "axios";
import http from "@app/api-services/httpService";
import { Button } from "antd";

const Verify = () => {
  const router = useRouter();
  const [submitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleModalClose = () => {
    setViewModal(false);
  };

  const LoginSuccessMsg = (
    <div className="font-bold flex justify-center items-center">
      Successfully Account Verified
    </div>
  );

  const handleVerify = async (e) => {
    try {
      e.preventDefault();
      const response = await http.post(
        "https://developer.ethiotelecom.et/v2/user/verify",
        { email, otp }
      );
      if (response.data) {
        setVerificationMessage("Verification successful!");
        router.push("/guest/login");
      } else {
        setVerificationMessage("Verification failed. Please check your OTP.");
      }
    } catch (error) {
      setVerificationMessage("Error during verification. Please try again.");
    }
  };

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

      <form
        onSubmit={handleVerify}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-6">Verify Your Account</h2>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-600"
            >
              OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            onClick={handleVerify}
            className="w-full bg-lime-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Verify
          </button>
          {verificationMessage && (
            <p className="mt-4 text-sm text-center text-gray-600">
              {verificationMessage}
            </p>
          )}
        </div>
      </form>

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

export default withErrorHandler(Verify);
