/** @format */
"use client";
import "@styles/user.css";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MiniLoading } from "@components/UI/miniLoading";
import userSession from "@lib/hooks/userSession";
import { authCheckState } from "@app/api-services/authService";
// import banner from "@public/assets/images/banner.jpg";
import BigCard from "@components/BigCard";
import { getUserData } from "../../api-services/authService";
import { checkUserStatus, getappCubeUser } from "@app/api-services/userService";
import CardWithButton from "@components/CardWithButton";
import Modal from "@components/Modal";
import RegisterModal from "@components/RegisterModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

authCheckState();
const tabs = [
  {
    id: 1,
    name: "Mini-App",
  },
  {
    id: 2,
    name: "Payment",
  },
];

export const base_url = "https://196.188.120.4:32000";

//const [pop, setPop] = useState(true);
const handlerRouting = () => {
  // setPopup(true);
};
const Product = () => {
  authCheckState();
  const session = userSession();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(1);
  if (session === null) return router.replace("guest/login");
  const [currentMiniAppStep, setCurrentMiniAppStep] = useState(1);
  const [currentPaymentStep, setCurrentPaymentStep] = useState(1);
  const [incompletePopup, setIncompletePopup] = useState(false);
  const [modalPopup, setModalPopup] = useState(false);
  const [completeStatus, setCompleteStatus] = useState();
  // const complete = completeStatus;
  const [userId, setUserId] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const MiniAppSteps = [
    {
      id: 1,
      name: "How to Convert Existing Web Applicaiton to Mini APP",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Convert",
    },
    {
      id: 2,
      name: "Develop Mini App on ",
      // href: "https://developer.ethiotelecom.et/docs/category/mini-app-devlopment-guide",
      href: "https://sg.appcubecloud.com/",
    },
    {
      id: 3,
      name: "Develop Mini App Offline",
      href: "https://developer.ethiotelecom.et/docs/category/mini-app-devlopment-guide",
    },

    {
      id: 4,
      name: "Debugging",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Debugging",
    },
    {
      id: 5,
      name: "Packaging",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Packing",
    },
    {
      id: 6,
      name: "Joint commissioning",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Commisioning",
    },
    {
      id: 7,
      name: "Go Live",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/GoLive",
    },
  ];
  const PaymentSteps = [
    {
      id: 1,
      name: "Register on developer portal",
      href: "https://developer.ethiotelecom.et/user/team",
    },
    {
      id: 2,
      name: "Check Credientials",
      href: "https://developer.ethiotelecom.et/user/dashboard",
    },
    {
      id: 3,
      name: "Understand Payment API",
      href: "https://developer.ethiotelecom.et/docs/GettingStarted",
    },
    {
      id: 4,
      name: "Payment Integration",
      href: "https://developer.ethiotelecom.et/docs/MiniApp%20Integration%20with%20Supper%20APP/Introduction",
    },
    {
      id: 5,
      name: "Explore other Payment API",
      href: "https://developer.ethiotelecom.et/docs/GettingStarted",
    },
  ]

  const checkMerchantStatus = async (user_id) => {
    try {
      const response = await checkUserStatus(user_id);
      const status = response.data.status;
      setCompleteStatus(status);
      console.log("complete status " + status);
    } catch (ex) {
      if (ex.response?.status === 400) {
        console.log("EX", ex);
      } else {
        console.log("something went wrong", ex);
      }
    } finally {
    }
  };

  const handleTabChange = (id) => {
    // alert(`Tab ${id} Is Clicked`);
    setCurrentTab(id);
    // const currentButton = document.getElementById(id);
    const currentPage = document.querySelector(".tab-content.active");
    const nextPage = document.getElementById(id);
    currentPage.classList.remove("active");
    nextPage.classList.add("active");
  };

  // const handleButtonClick = () => {
  //   console.log("clicked");
  //   handleRouting()
  // };

  const handleMiniAppStepClick = (id) => {
    console.log(id);
    setCurrentMiniAppStep(id);
  };

  const handlePaymentStepClick = (id) => {
    console.log(id);
    setCurrentPaymentStep(id);
  };

  function atStartUp() {
    const userInfo = getUserData();
    setUser(userInfo);
    const user_id = userInfo?.id;
    setUserId(user_id);
  }

  useEffect(() => {
    atStartUp();
  }, []);

  useEffect(() => {
    if (userId) {
      checkMerchantStatus(userId);
    }
  }, [userId, completeStatus]);

  async function useManagementConsole() {
    //* geting the siteId and tenatId from the cookies
    //TODO: It needs to store the credential on the DB
    console.log({ userId });
    try {
      const { data: userData } = await getappCubeUser(userId);
      console.log({ userData });
      if (userData) {
        const siteId = userData?.siteId;
        const tenantId = userData?.tenantId;

        // const url = `${base_url}/miniprogram/admin/login.html?__siteId=${siteId}&__tenantId=${tenantId}`;

        const clientName = `${tenantId}-miniprogramlogin`;
        const redirect =
          base_url + `/miniprogram/admin/index.html?__siteId=${siteId}`;
        const url = `${base_url}/baas/auth/v1.0/idp?client-name=${clientName}&redirect=${encodeURIComponent(
          redirect
        )}`;

        window.open(url, "_blank");
      } else {
        alert("Something went wrong, please try again_");
        return;
      }
    } catch (ex) {
      alert("Something went wrong, please try again*");
      return;
    }
  }

  const handleRouting = () => {
    if (completeStatus === "completed") {
      setLoading(true);

      setIncompletePopup(false);
      setModalPopup(false);
      //* When the completing the approval from SP it will redirect to mini app page
      useManagementConsole();

      // router.push("/user/dashboard");

      setLoading(false);
    } else if (completeStatus === "pending") {
      setModalPopup(true);
      // else if (completeStatus === undefined)
    } else if (typeof completeStatus === "undefined") {
      checkMerchantStatus;
      setIncompletePopup(true);
    }
  };
  const showSuccessToast = () => {
    toast.success("Company Registered Successfuly. Please wait for Approval.");
  };
  const handleCloseIncompleteModal = () => {
    setIncompletePopup(false);
  };
  const handleCloseModal = () => {
    setModalPopup(false);
    // console.log("close initiatied");
  };
  return (
    <>
      <ToastContainer />
      <div>
        <div className="carousel w-100">
          <div id="item1" className="carousel-item w-full flex-center">
            <img src="/assets/images/banner.jpg" />
          </div>
          <div id="item2" className="carousel-item w-full flex-center">
            <img src="/assets/images/banner.jpg" />
          </div>
          <div id="item3" className="carousel-item w-full flex-center">
            <img src="/assets/images/banner.jpg" />
          </div>
          <div id="item4" className="carousel-item w-full flex-center">
            <img src="/assets/images/banner.jpg" />
          </div>
        </div>
        {/* <div className="flex justify-center w-full py-2 gap-2">
          <a href="#item1" className="btn btn-xs">
            1
          </a>
          <a href="#item2" className="btn btn-xs">
            2
          </a>
          <a href="#item3" className="btn btn-xs">
            3
          </a>
          <a href="#item4" className="btn btn-xs">
            4
          </a>
        </div> */}
      </div>

      <div className="tabs mt-5 mb-0 flex-center">
        {tabs.map((tab) => (
          <a
            className={`tab tab-bordered ${
              tab.id === currentTab ? "tab-active" : ""
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab?.name}
          </a>
        ))}
      </div>
      {/* Payment Tab */}
      <div className="tab-content " id="2">
        <CardWithButton
          title="Payment"
          description={`telebirr is a mobile financial services platform that allows individuals and businesses to make and receive payments, buy airtime, and access a range of financial services. \n The platform offers four integration options that make it easy for developers to integrate telebirr's payment gateway into their applications.\n When your mini APP needs to support payment via telebirr, it should follow the guide step by step to integrate.`}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* left card */}
          <div className="card w-auto bg-base-100 shadow-xs border-none">
            <div className="card-body">
              <h2 className="card-title flex-center">Payment Details</h2>
              <ul className="steps steps-vertical">
                {PaymentSteps.map((PaymentStep) =>
                  PaymentStep.name === "Check Credientials" ? (
                    <li
                      className={`step ${
                        PaymentStep.id === currentPaymentStep
                          ? "step-secondary"
                          : ""
                      }`}
                      onClick={() => handlePaymentStepClick(PaymentStep.id)}
                    >
                      <button className="" onClick={handleRouting}>
                        {PaymentStep?.name}
                        {/* <a href={PaymentStep.href}>{PaymentStep?.name}</a> */}
                      </button>
                    </li>
                  ) : (
                    <li
                      className={`step ${
                        PaymentStep.id === currentPaymentStep
                          ? "step-secondary"
                          : ""
                      }`}
                      onClick={() => handlePaymentStepClick(PaymentStep.id)}
                    >
                      <a href={PaymentStep.href} target="_blank">
                        {PaymentStep?.name}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          {/* right card */}
          <div className="card w-auto bg-base-100 shadow-xs mr-2 border-none">
            <div className="card-body">
              <h2 className="card-title flex-center">Tools</h2>
              <div className="p-10">
                <div className="flex space-x-3 pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success text-blue-500"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/SuperAppTestBed.apk"
                  >
                    Download Host APP (teleBirr on TestBed)
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/SignTool.zip"
                  >
                    Download Sign Tool
                  </a>
                </div>
                <div className="badge ">Sample Demos</div>
                <div className="pl-5">
                  <div className="flex space-x-3  pt-4 pb-4">
                    <img src="/assets/icons/download.svg" className="h-5 w-5" />
                    <a
                      className="link link-success"
                      href="https://developer.ethiotelecom.et/developer_tools/static/download/ET_DEMO_PYTHON.zip"
                    >
                      Download Python Demo
                    </a>
                  </div>
                  <div className="flex space-x-3  pt-4 pb-4">
                    <img src="/assets/icons/download.svg" className="h-5 w-5" />
                    <a
                      className="link link-success"
                      href="https://developer.ethiotelecom.et/developer_tools/static/download/ET_DEMO_C%23.zip"
                    >
                      Download C# Demo
                    </a>
                  </div>
                  <div className="flex space-x-3  pt-4 pb-4">
                    <img src="/assets/icons/download.svg" className="h-5 w-5" />
                    <a
                      className="link link-success"
                      href="https://developer.ethiotelecom.et/developer_tools/static/download/ET_DEMO_JAVA.zip"
                    >
                      Download Java Demo
                    </a>
                  </div>
                  <div className="flex space-x-3  pt-4 pb-4">
                    <img src="/assets/icons/download.svg" className="h-5 w-5" />
                    <a
                      className="link link-success"
                      href="https://developer.ethiotelecom.et/developer_tools/static/download/ET_DEMO_NODE.zip"
                    >
                      Download Node.js Demo
                    </a>
                  </div>
                  <div className="flex space-x-3  pt-4 pb-4">
                    <img src="/assets/icons/download.svg" className="h-5 w-5" />
                    <a
                      className="link link-success"
                      href="https://developer.ethiotelecom.et/developer_tools/static/download/ET_PHP_DEMO.zip"
                    >
                      Download PHP Demo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mini-app Tab */}
      <div className="tab-content active" id="1">
        <CardWithButton
          title="Mini App"
          description="A mini app is a lightweight application that runs on a telebirr Super App."
          button_title="Manage My Mini APP"
          handleButtonClick={handleRouting}
          // handleButtonClick={useManagementConsole}
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="card w-auto bg-base-100 shadow-xs border-none">
            <div className="card-body">
              <h2 className="card-title flex-center">
                Mini App Development Tour
              </h2>
              <ul className="steps steps-vertical">
                {MiniAppSteps.map((MiniAppStep) => (
                  <li
                    className={`step ${
                      MiniAppStep.id === currentMiniAppStep
                        ? "step-secondary"
                        : ""
                    }`}
                    onClick={() => handleMiniAppStepClick(MiniAppStep.id)}
                  >
                    <a href={MiniAppStep.href} target="_blank">
                      {MiniAppStep?.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* right card */}
          <div className="card w-auto bg-base-100 shadow-xs mr-2 border-none">
            <div className="card-body">
              <h2 className="card-title flex-center">Development Tools</h2>
              <div className="p-10">
                <div className="flex space-x-3 pt-4 pb-4">
                  <img src="/assets/icons/link-two.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://code.visualstudio.com/download"
                  >
                    Get VS Code
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/Macle_23.3.0_DevSuite_IDE.zip"
                  >
                    Download Macle Development VSCode Plugin
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/Macle_23.3.0_DevSuite_Simulator_Win.zip"
                  >
                    Download Macle Simulator For Windows
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/Macle_22.12.0_DevSuite_Simulator_Mac.zip"
                  >
                    Download Macle Simulator For Mac Os
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/Shop%20MiniApp%20Demo%20Project.zip"
                  >
                    Download Demo Mini-App Project 1
                  </a>
                </div>
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/macle_demo_EN.rar"
                  >
                    Download Demo Mini-App Project 2
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {incompletePopup === true ? (
        <RegisterModal
          user_id={userId}
          showPopup={incompletePopup}
          successMessage={showSuccessToast}
          onCloseModal={handleCloseIncompleteModal}
        />
      ) : (
        ""
      )}
      {modalPopup === true ? (
        <Modal
          tshowPopup={modalPopup}
          onCloseModel={handleCloseModal}
          title="Pending"
          description="Your request has been submitted. Please wait for approval."
        />
      ) : (
        ""
      )}
    </>
  );
};
export default Product;
