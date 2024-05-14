"use client";
import http from "@app/api-services/httpService";
import { useState } from "react";
import { message } from "antd";
import Link from "next/link";
import { API_END_POINT } from "@app/api-services/httpConstant";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      if (!email || email.trim() === "") {
        message.error("email is required");
        return;
      }

      const response = await http.post(
        `${API_END_POINT}/user/forgot-password`,
        {
          email,
        }
      );

      //console.log({ response });
      if (response.status === 200) {
        setSuccess(true);
        message.success(
          "Password reset instructions sent to your email. Please check your inbox"
        );
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred, User not found"
      );
      message.error(
        error.response?.data?.message || "An error occurred, User not found"
      );
    }
  };

  return (
    <div className="w-[40%] mx-auto mt-28 p-6 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-semibold  mb-4">Forgot Password</h1>
      <form onSubmit={handleForgotPassword}>
        <div className="relative mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        <button
          className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 px-4 rounded-md transition duration-300"
          type="submit"
        >
          Send Reset Instructions
        </button>
      </form>
      {/* Return To Sign In and Sign Up for Free options */}

      <div className="mt-4 flex flex-col gap-y-2 justify-center items-center">
        <Link href="/guest/login" className="text-green font-semibold">
          Return To Sign In
        </Link>
        <p>
          <small> Don't Have An Account?</small>
          <Link href="/guest/signUp" className="text-green font-semibold">
            {" "}
            Sign Up for Free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
