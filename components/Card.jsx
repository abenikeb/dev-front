/** @format */

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@app/api-services/authService";
import { checkUserStatus } from "@app/api-services/userService";
import Modal from "@components/Modal";
import RegisterModal from "@components/RegisterModal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import http from "@app/api-services/httpService";
import { API_END_POINT } from "@app/api-services/httpConstant";

const base_url = `${API_END_POINT}`;

const ApiCard = (props) => {
  const router = useRouter();
  const [incompletePopup, setIncompletePopup] = useState(false);
  const [modalPopup, setModalPopup] = useState(false);
  const [completeStatus, setCompleteStatus] = useState();
  const [userId, setUserId] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkMerchantStatus = async (user_id) => {
    try {
      const [userStatusResponse, userDataResponse] = await Promise.all([
        checkUserStatus(user_id),
        http.get(`${base_url}/user/${user_id}`),
      ]);

      const userStatus = userStatusResponse.data.status;
      const userData = userDataResponse.data;

      const status = userData.userId ? userData.status : userStatus;

      if (
        (userData.userId && status === "active") ||
        (userData.userId && status === "approved")
      ) {
        setCompleteStatus("completed");
      } else {
        setCompleteStatus(status);
      }
    } catch (ex) {
      console.error(`Error:`, ex);
    }
  };

  const atStartUp = async () => {
    try {
      const userInfo = getUserData();
      let user_id;

      if (userInfo.role === "admin" || userInfo.role === "Admin") {
        user_id = userInfo.id;
      } else if (userInfo.role === "Developer") {
        user_id = userInfo.userId;
      }

      if (!user_id) {
        return router.push("/guest/login");
      }

      setIsModalVisible(true);
      setUser(userInfo);
      setUserId(user_id);
    } catch (error) {
      console.error("An error occurred during startup:", error);
    }
  };

  useEffect(() => {
    atStartUp();
  }, []);

  useEffect(() => {
    const userInfo = getUserData();
    if (userInfo?.id) {
      checkMerchantStatus(userInfo.id);
    }
  }, [userId, completeStatus]);

  const handleRouting = () => {
    if (completeStatus === "completed") {
      setIncompletePopup(false);
      setModalPopup(false);
      setLoading(true);
      router.push("/user/dashboard");
      setLoading(false);
    } else if (completeStatus === "pending") {
      setModalPopup(true);
    } else if (completeStatus === undefined) {
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
  };
  return (
    <>
      <div className="bg-white md:border-solid md:border-2 md:rounded-sms mx-3 md:my-3 w-11/12 md:w-1/6 drop-shadow-lg my-1">
        <div
          className="flex md:flex-col p-5 items-center"
          onClick={handleRouting}
        >
          <Image
            src={props.logo}
            // src="/assets/images/create-order.svg"
            alt="logo"
            width={10}
            height={10}
            className="w-10 md:w-max self-start mt-2 md:mt-0 md:self-center"
          />
          {/* <a href="/user/dashboard">
            
          </a> */}
          <div className="flex self-start mx-2 md:mx-0 md:self-center md:items-center justify-center flex-col ml-3 md:ml-0 md:border-none w-auto">
            <p className="card__title mt-4 mb-4 text-base">{props.title}</p>
            {/* <p className="card__description">
              <a href="/user/dashboard">{props.description}</a>
            </p> */}
          </div>
          {/* <a href="/user/dashboard" className='card_button'>Run</a> */}
          {completeStatus === undefined ? (
            <button
              className="card__button hidden md:flex"
              onClick={handleRouting}
            >
              Create
            </button>
          ) : (
            <button
              className="card__button hidden md:flex"
              onClick={handleRouting}
            >
              Run
            </button>
          )}
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

export default ApiCard;
