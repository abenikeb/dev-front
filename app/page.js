/** @format */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { redirect } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Button } from "antd";
import { authCheckState, getUserData } from "./api-services/authService";
// import Button from "@components/UI/Button/Button";
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
} from "react-icons/fa";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";

const Footer = () => (
  <footer className="footer-container flex flex-col w-full">
    <div className="bg-lime-500 p-8 text-white text-center flex justify-center items-center">
      <div className="flex justify-center space-x-8">
        <a
          href="https://twitter.com/ethiotelecom/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter className="text-4xl hover:text-lime-600 transition duration-300" />
        </a>
        <a
          href="https://facebook.com/ethiotelecom/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook className="text-4xl hover:text-lime-600 transition duration-300" />
        </a>
        <a
          href="https://www.instagram.com/ethiotelecom/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="text-4xl hover:text-lime-600 transition duration-300" />
        </a>
        <a
          href="https://t.me/ethiotelecom"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTelegram className="text-4xl hover:text-lime-600 transition duration-300" />
        </a>
        <a
          href="https://www.linkedin.com/company/ethiotelecom/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedin className="text-4xl hover:text-lime-600 transition duration-300" />
        </a>
      </div>

      <div className="mt-8 ml-8">
        <p className="flex flex-row gap-2 items-center mb-2">
          <FaEnvelope /> Email:
          <a href="mailto:994@ethionet.et">994@ethionet.et</a>
        </p>
        <p className="flex flex-row gap-2 items-center mb-2">
          <FaPhone /> Phone: +251-994 / +251-980
        </p>
        <p className="flex flex-row gap-2 items-center mb-2">
          <FaMapMarker /> Address: Addis Ababa, Ethiopia
        </p>
        <p className="flex flex-row gap-2 items-center mb-2">
          <FaGlobe /> Website:
          <a
            href="https://www.ethiotelecom.et"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.ethiotelecom.et
          </a>
        </p>
      </div>
    </div>

    <div className="bg-gray-200 p-8 text-black text-center">
      <p className="text-sm">
        Copyright 1894-2024 © Ethio telecom. All rights reserved.
      </p>
    </div>
  </footer>
);

const Home = () => {
  authCheckState();
  const router = useRouter();
  const [isUserLogin, setIsUserLogin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUserData();
      if (user === null) return setIsUserLogin(false);
      return router.replace("/user/home");
    };
    checkUser();
  }, []);

  return (
    <>
      {/* Desktop Version */}
      <section className="sm:flex hidden justify-between items-center">
        <div className="portal-container" />

        <div className="get-started">
          <h3 className="head_text_line text-center w-3/4 md:w-full">
            Build, test, and play in
            <br className="max-md:hidden" />
            <span className="head_text_line text-center">
              {" "}
              a safe environment
            </span>
          </h3>

          <Link href="/guest/login" className="outline_btn_GET_STARTED z-50">
            GET STARTED
          </Link>
          <div className="materials" />
        </div>

        {/* <div className="landing-page-ellipse" /> */}

        {/* <div className="landing-shapy" /> */}

        <div className="third-dev-section">
          {/* <Link
            hidden
            href="/guest/login"
            className="text-base rounded-md md:text-4xl font-normal text-white bg-lime-500"
          >
            GET STARTED
          </Link> */}
        </div>

        <Footer />

        <div className="entire-container" />
      </section>

      {/* Mobile Version */}
      <section className="sm:hidden flex relative mt-16">
        <div className="max-w-md mx-auto overflow-hidden w-auto -mt-24 relative">
          <img
            className="h-fit w-screen object-cover"
            src="/assets/images/mobile-media/background-small.png"
            alt="bg"
          />
        </div>

        {/* Build, test, and play in a safe environment */}
        <div className="absolute top-9 left-16 w-3/4 flex flex-col justify-center items-center">
          <h3 className="text-2xl text-center font-bold leading-[1.15] bg-clip-text text-transparent bg-gradient-to-r from-gray-50 via-white to-gray-50">
            Build, test, and play in a safe environment
          </h3>
          {/* <div className="w-36 mt-4">
            <Link
              href="/guest/login"
              className="w-full rounded-md border-2 border-white bg-transparent py-2 px-4 text-white transition-all hover:bg-lime-500 hover:text-white text-center text-sm font-inter flex items-center justify-center"
            >
              GET STARTED
            </Link>
          </div> */}
        </div>

        {/* Illustration */}
        <div className="absolute top-44 w-screen flex justify-center mx-auto">
          <Image
            src="/assets/images/landing-illustration.svg"
            width={250}
            height={250}
            alt="illustrate"
          />
        </div>
        {/* Entire Container */}
        <div className="absolute top-80 flex flex-col justify-center items-center w-screen mx-auto">
          <Image
            src="/assets/images/mobile-media/entire-bg.svg"
            width={310}
            height={350}
            alt="illustrate"
          />

          <Link href="/guest/login">
            <div className="mt-4 mb-8 w-36">
              <Button
                type="primary"
                shape="round"
                className="w-2/3 h-12 md:w-full text-center text-sm md:text-lg font-inter"
                style={{
                  border: "4px solid white",
                  backgroundColor: "transparent",
                  color: "white",
                }}
                href="/guest/login"
              >
                GET STARTED
              </Button>
              {/* <Button btn_class="btn-filled" label="GET STARTED" /> */}
            </div>
          </Link>
        </div>
      </section>
    </>
  );
};

export default withErrorHandler(Home);
