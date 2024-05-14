/** @format */

"use client";

import "@styles/user.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MiniLoading } from "@components/UI/miniLoading";
import userSession from "@lib/hooks/userSession";
// import { authCheckState } from "@app/api-services/authService";
import RegisterModal from "@components/RegisterModal";
// import Modal from "@components/Modal";
import { checkUserStatus } from "@app/api-services/userService";

import { getUserData } from "../../api-services/authService";
import { getMerchantCredential } from "@app/api-services/configService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Modal } from "antd";
import JoinTeamModal from "./../team/JoinTeamModal";
import http from "@app/api-services/httpService";
import { API_END_POINT } from "@app/api-services/httpConstant";

const Home = () => {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const [joinTeamModalVisible, setJoinTeamModalVisible] = useState(false);

  const [incompletePopup, setIncompletePopup] = useState(false);
  const [incompletePopupModal, setIncompletePopupModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [modalPopup, setModalPopup] = useState(true);
  // authCheckState();
  const session = userSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completeStatus, setCompleteStatus] = useState();
  const complete = completeStatus;
  const [userId, setUserId] = useState();
  const [dummy, setDummy] = useState(true);
  const base_url = `${API_END_POINT}`;

  const checkMerchantStatus = async (user_id) => {
    try {
      const response = await checkUserStatus(user_id);
      //console.log({ newResponse: response.data });
      const status = response.data.status;
      const { data } = await http.get(`${base_url}/user/${user_id}`);
      //console.log({ data, status });
      if (data && data.status === "active") {
        setCompleteStatus("pending");
        setTeamUserInfo({
          status: "active",
          tenantId: data.appcube_tenant_Id,
          instanceUrl: data.instanceUrl,
        });
        return;
      }

      setCompleteStatus(status);
      if (status === undefined) {
        setIncompletePopup(true);
      }
    } catch (ex) {
      if (ex.response?.status === 400) {
        //console.log("EX", ex);
      } else {
        //console.log("something went wrong", ex);
      }
    } finally {
    }
  };

  function atStartUp() {
    const userInfo = getUserData();
    setUser(userInfo);
    const user_id = userInfo?.id;
    if (!user_id) return router.push("/guest/login");

    setUserId(user_id);
    setIsModalVisible(true);
  }

  useEffect(() => {
    atStartUp();
  }, []);

  useEffect(() => {
    if (userId) {
      checkMerchantStatus(userId);
    }
  }, [userId]);

  const handlerRouting = () => {
    setLoading(true);
    router.push("/user/product");
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleCloseIncompleteModal = () => {
    setIncompletePopup(false);
  };
  const handleCloseModal = () => {
    setModalPopup(false);
  };

  const showSuccessToast = () => {
    toast.success("Company Registered Successfuly. Please wait for Approval.");
  };

  const handleCreateTeam = () => {
    setIncompletePopupModal(true);
  };

  const handleOpenJoinTeam = () => {
    setJoinTeamModalVisible(true);
  };

  const handleJoinTeam = (searchTerm) => {
    //console.log(`Joining team with searchTerm: ${searchTerm}`);
    setJoinTeamModalVisible(false); // Close the modal
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
      <div>
        {incompletePopup === true && complete === undefined && (
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
      </div>

      <center>
        <div className="border md:border-2 border-b-gray-100 shadow-sm rounded-lg flex flex-col justify-center items-center bg-white w-11/12 md:w-3/4 h-64 md:h-60 mt-20 py-5 md:py-0 px-3 md:px-0">
          <h3 className="font-satoshi font-extrabold text-3xl md:text-5xl text-black tracking-wide my-3">
            {" "}
            Welcome {session?.user?.firstName}
          </h3>
          <h4 className="font-satoshi font-bold text-lg md:text-3xl text-black tracking-wide">
            Welcome to telebirr developer portal
          </h4>

          <div className="w-3/4 md:w-1/4 mt-7 mb-5 md:mb-0">
            <button onClick={handlerRouting} className="btn-filled">
              GET STARTED
            </button>
          </div>
        </div>
        <MiniLoading isLoading={loading} />
      </center>

      {incompletePopupModal && (
        <RegisterModal
          user_id={userId}
          showPopup={incompletePopup}
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

export default Home;
