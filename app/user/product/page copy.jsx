/** @format */
"use client";
import "@styles/user.css";
import { useState } from "react";
import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { MiniLoading } from "@components/UI/miniLoading";
import userSession from "@lib/hooks/userSession";
// import { authCheckState } from "@app/api-services/authService";
import { getUserData } from "../../api-services/authService";
import { checkUserStatus, getappCubeUser } from "@app/api-services/userService";
import CardWithButton from "@components/CardWithButton";
import RegisterModal from "@components/RegisterModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { Modal } from "antd";
import JoinTeamModal from "./../team/JoinTeamModal";
import http from "@app/api-services/httpService";
import { Carousel } from "antd";
import { API_END_POINT } from "@app/api-services/httpConstant";

const merchantUrl = `${API_END_POINT}/merchant-info`;
// const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info";
// export const appcube_base_url = "https://196.188.120.4:32000";
export const appcube_base_url =
  "https://telebirrminiappmanagement.ethiotelecom.et:32000";
// const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info";

// authCheckState();

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

const Product = () => {
  // authCheckState();
  // const session = userSession();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(1);
  // if (session === null) return router.replace("guest/login");
  const [currentMiniAppStep, setCurrentMiniAppStep] = useState(1);
  const [currentPaymentStep, setCurrentPaymentStep] = useState(1);
  const [incompletePopup, setIncompletePopup] = useState(false);
  const [incompletePopupModal, setIncompletePopupModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);
  const [teamUserInfo, setTeamUserInfo] = useState(null);
  const [completeStatus, setCompleteStatus] = useState();
  const [merchant, setMerchant] = useState(null);
  const [userId, setUserId] = useState();
  const [user, setUser] = useState(null);

  const base_url = `${API_END_POINT}`;

  const returnInstanceUrl = () => {
    const instanceUrl =
      merchant?.instanceUrl ||
      (teamUserInfo &&
        teamUserInfo.status === "active" &&
        teamUserInfo.instanceUrl);

    if (instanceUrl) {
      let updatedUrl = instanceUrl.replace(
        "https://pub-za.appcubecloud.com",
        "https://telebirrminiapp.ethiotelecom.et"
      );

      updatedUrl = updatedUrl.replace(
        "redirect=https://pub-za.appcubecloud.com/lowcode/home.html",
        "redirect=/lowcode/home.html"
      );

      return updatedUrl;
    } else {
      return "";
    }
  };

  const MiniAppSteps = [
    {
      id: 1,
      name: "How to Convert Existing Web Applicaiton to Mini APP",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Convert",
    },
    {
      id: 2,
      name: "Develop Mini App on Clouds",
      options: {
        option1: {
          name: "vscode(Macle)",
          href: "https://developer.ethiotelecom.et/docs/category/mini-app-devlopment-guide",
        },
        option2: {
          name: "Low Code Platform(Sandbox)",
          href: returnInstanceUrl(),
        },
      },
    },

    {
      id: 3,
      name: "Debugging",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Debugging",
    },
    {
      id: 4,
      name: "Packaging",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Packing",
    },
    {
      id: 5,
      name: "Joint commissioning",
      href: "https://developer.ethiotelecom.et/docs/Mini%20App%20Devlopment%20Guide/Commisioning",
    },
    {
      id: 6,
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
      name: "Check credientials",
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
  ];

  const handleTabChange = (id) => {
    setCurrentTab(id);
    const currentPage = document.querySelector(".tab-content.active");
    const nextPage = document.getElementById(id);
    currentPage.classList.remove("active");
    nextPage.classList.add("active");
  };

  const handleMiniAppStepClick = (id) => {
    //console.log(id);
    setCurrentMiniAppStep(id);
  };

  const handlePaymentStepClick = (id) => {
    //console.log(id);
    setCurrentPaymentStep(id);
  };

  const checkCurentMerchantStatus = async (user_id) => {
    try {
      const response = await checkUserStatus(user_id);
      let status = response.data.status;

      const { data } = await http.get(`${base_url}/user/${user_id}`);
      if (data.userId) {
        status = data.status;
      }
      //console.log({ data, status, user_id });
      if (data && status === "active") {
        setCompleteStatus("pending");
        setTeamUserInfo({
          status: "active",
          tenantId: data.appcube_tenant_Id,
          instanceUrl: data.instanceUrl,
        });
        return;
      }

      setCompleteStatus(status);
      //console.log("complete status " + status);
    } catch (ex) {
      console.error(`Error:`, ex);
    }
  };

  const atStartUp = async () => {
    try {
      const userInfo = getUserData();
      const user_id = userInfo?.id;
      //console.log({ userInfo, email: userInfo?.emai, user_id });
      if (!user_id) return router.push("/guest/login");
      setIsModalVisible(true);
      setUser(userInfo);
      setUserId(user_id);

      const headers = {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      };

      const response = await http.get(
        `${merchantUrl}/check-status?id=${user_id}`,
        {
          headers,
        }
      );

      const merchantData = response.data;
      setMerchant(merchantData);

      // checkMerchantStatus(user_id);
      //console.log({ merchantData });
    } catch (error) {
      throw new Error(error);
      // console.error("Something went wrong", error);
    }
  };

  useEffect(() => {
    atStartUp();
  }, []);

  useEffect(() => {
    const userInfo = getUserData();
    if (userInfo?.id) {
      checkCurentMerchantStatus(userInfo.id);
    }
  }, [userId, completeStatus]);

  async function redirectSSOToManagementConsole() {
    try {
      if (merchant) {
        if (
          teamUserInfo &&
          teamUserInfo.status === "active" &&
          typeof merchant?.tenant_Id !== "string"
        ) {
          const { siteId = "6c2144f86dae4d6cb26d46bad6fb740e", tenant_Id } =
            teamUserInfo;
          const url = `${appcube_base_url}/miniprogram/admin/login.html?__siteId=${siteId}&__tenantId=${tenant_Id}`;

          window.open(url, "_blank");
          return;
        }
        const { siteId = "6c2144f86dae4d6cb26d46bad6fb740e", tenant_Id } =
          merchant;
        const url = `${appcube_base_url}/miniprogram/admin/login.html?__siteId=${siteId}&__tenantId=${tenant_Id}`;

        window.open(url, "_blank");
      } else {
        throw new Error("Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("Error opening management console:", error.message);
      alert("Something went wrong, please try again.");
    }
  }

  const handleRouting = () => {
    //console.log({ completeStatus });
    if (completeStatus === "pending" || completeStatus === "completed") {
      setIncompletePopup(false);
      redirectSSOToManagementConsole();
    } else if (typeof completeStatus === "undefined") {
      setIncompletePopup(true);
    }
  };

  const handleAppCubeRoute = (path) => {
    const token = Cookies.get("token");

    //console.log({ token, path });

    if (!token || token === "") {
      router.push("/guest/login");
    } else {
      window.open(path, "_blank");
    }
  };

  const showSuccessToast = () => {
    toast.success("Company Registered Successfuly. Please wait for Approval.");
  };

  const handleCloseIncompleteModal = () => {
    setIncompletePopupModal(false);
  };

  const handleCreateTeam = () => {
    setIncompletePopupModal(true);
  };

  const handleOpenJoinTeam = () => {
    setJoinTeamModalVisible(true);
  };

  const handleJoinTeam = (searchTerm) => {
    //console.log(`Joining team with searchTerm: ${searchTerm}`);
    setJoinTeamModalVisible(false);
  };

  const handleCancelJoinTeamModal = () => {
    setJoinTeamModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ToastContainer />
      {/* Banner */}
      <div className="w-3/4 md:w-1/2 mx-auto">
        <Carousel autoplay>
          <div className="w-full flex-center">
            <img
              className="rounded-lg"
              src="/assets/images/newBanner.jpeg"
              alt="Banner 1"
            />
          </div>
          <div className="w-full flex-center">
            <img
              className="rounded-lg"
              src="/assets/images/newBanner.jpeg"
              alt="Banner 1"
            />
          </div>
        </Carousel>
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
      <div className="tab-content" id="2">
        <CardWithButton
          title="Payment"
          description={`telebirr is a mobile financial services platform that allows individuals and businesses to make and receive payments, buy airtime, and access a range of financial services. \n The platform offers four integration options that make it easy for developers to integrate telebirr's payment gateway into their applications.\n When your mini APP needs to support payment via telebirr, it should follow the guide step by step to integrate.`}
        />
        <div className="w-full flex flex-col md:flex-row">
          {/* left card */}
          <div className="card w-full mx-auto md:w-[46%] bg-base-100 shadow-xs border-none">
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
          <div className="card w-full mx-auto md:w-[46%] bg-base-100 shadow-xs border-none">
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
                <div className="flex space-x-3  pt-4 pb-4">
                  <img src="/assets/icons/download.svg" className="h-5 w-5" />
                  <a
                    className="link link-success"
                    href="https://developer.ethiotelecom.et/developer_tools/static/download/AndroidSDK_demo.zip"
                  >
                    InApp SDK Integration
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
        <div className="w-full flex flex-col md:flex-row">
          <div className="card w-full mx-auto md:w-[46%] bg-base-100 shadow-xs border-none">
            <div className="card-body">
              <h2 className="card-title flex-center">
                Mini App Development Tour
              </h2>
              <ul className="steps steps-vertical">
                {MiniAppSteps.map((MiniAppStep) => (
                  <li
                    key={MiniAppStep.id}
                    className={`step ${
                      MiniAppStep.id === currentMiniAppStep
                        ? "step-secondary"
                        : ""
                    }`}
                    onClick={() => handleMiniAppStepClick(MiniAppStep.id)}
                  >
                    <a
                      href={MiniAppStep.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {MiniAppStep?.name}
                    </a>
                    {MiniAppStep.options && (
                      <div className="flex space-x-4 w-[30rem]">
                        <a
                          href={MiniAppStep.options.option1.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline w-1/2"
                        >
                          Option1: {MiniAppStep.options.option1.name}
                        </a>
                        <button
                          onClick={() =>
                            handleAppCubeRoute(MiniAppStep.options.option2.href)
                          }
                          className="text-blue-500 hover:underline"
                        >
                          Option2: {MiniAppStep.options.option2.name}
                        </button>
                        {/* <a
                          href={MiniAppStep.options.option2.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Option2: {MiniAppStep.options.option2.name}
                        </a> */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* right card */}
          <div className="card w-full mx-auto md:w-[46%] bg-base-100 shadow-xs border-none">
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

      {incompletePopup === true && (
        <Modal
          title=""
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <p className="mb-4 text-2xl font-bold text-center">
            You have no team yet.
          </p>
          <p className="mb-10 text-lg">
            To get started, create a new team or join an existing one.
          </p>
          <div className="flex flex-wrap justify-center items-center space-x-4 text-center">
            <button
              onClick={handleCreateTeam}
              className="btn btn-sm bg-lime-500 text-white text-sm hover:bg-lime-600"
            >
              Create New Team
            </button>

            <button
              onClick={handleOpenJoinTeam}
              className="btn btn-sm bg-white text-lime-500 border border-lime-500 text-sm hover:border-lime-600 hover:text-lime-600"
            >
              Join a Team
            </button>
          </div>
        </Modal>
      )}

      {incompletePopupModal && (
        <RegisterModal
          user_id={userId}
          showPopup={incompletePopupModal}
          successMessage={showSuccessToast}
          onCloseModal={handleCloseIncompleteModal}
        />
      )}
      <JoinTeamModal
        visible={joinTeamModalVisible}
        handleJoinTeam={handleJoinTeam}
        handleCancel={handleCancelJoinTeamModal}
      />
    </>
  );
};
export default Product;
