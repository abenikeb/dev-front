/** @format */

import Link from "next/link";
// import Button from "./UI/Button/Button";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "antd";
import React from "react";

const Form = ({
  type,
  data,
  setData,
  submitting,
  handleSubmit,
  error,
  errors,
}) => {
  // const recaptchaRef = React.createRef();
  return (
    <section className="w-11/12 md:w-2/5 h-full md:h-2/6 flex flex-col justify-center mt-24 md:mt-48 border border-gray-200 md:border-gray-200 bg-gray-50 rounded-lg shadow-lg md:shadow mx-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-7 px-6 md:px-12 pt-10 pb-52 mb:pb-3 md:py-10"
      >
        <div>
          <h3 className="text-2xl font-semibold font-satoshi">Welcome</h3>
          <p className="font-semibold">Login to your account!</p>
        </div>
        <label>
          <span className="font-satoshi font-bold text-sm text-gray-700">
            Email
          </span>
          <input
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            type="email"
            placeholder="email"
            required
            className="form_input border-2"
          />
        </label>

        <label>
          <span className="font-satoshi font-bold text-sm text-gray-700">
            Password
          </span>
          <input
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            type="password"
            placeholder="Password"
            required
            className="form_input border-2"
          />
        </label>

        <Link
          href="/guest/ForgotPassword"
          className="text-left text-green font-normal"
        >
          forget your password?
        </Link>

        <div className="flex flex-col mb-5 gap-4">
          <Button
            type="primary"
            htmlType="submit"
            block
            className="h-12"
            style={{ backgroundColor: "#84cc16" }}
            disabled={submitting}
          >
            {submitting ? `${type}ing...` : type}
          </Button>

          {/* <Button
            disabled={submitting}
            btn_class="btn-filled"
            label={submitting ? `${type}ing...` : type}
          /> */}

          {error && (
            <div className="text-base text-center text-red-500">{error}</div>
          )}

          {errors && (
            <div className="text-base text-center text-red-500">
              {Object.values(error)[2][0].message}
            </div>
          )}
        </div>

        {/* Login Only */}
        <div className="flex jusify-center mb-5 pl-6 md:pl-32 gap-4">
          <div>
            Don't have an account?
            <Link href="/guest/signUp" className="text-green font-semibold">
              {" "}
              Sign Up for Free
            </Link>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Form;
