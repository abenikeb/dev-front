/** @format */

"use client";

import "@styles/user.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MiniLoading } from "@components/UI/miniLoading";
import userSession from "@lib/hooks/userSession";
import { authCheckState } from "@app/api-services/authService";
import RegisterModal from "@components/RegisterModal";
import Modal from "@components/Modal";
import { checkUserStatus } from "@app/api-services/userService";

import { getUserData } from "../../api-services/authService";
import { getMerchantCredential } from "@app/api-services/configService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Home = () => {
  // New Mod
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);
  // End-New Mod
  const [incompletePopup, setIncompletePopup] = useState(false);
  const [modalPopup, setModalPopup] = useState(true);
  authCheckState();
  const session = userSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [completeStatus, setCompleteStatus] = useState();
  const complete = completeStatus;
  const [userId, setUserId] = useState();
  const [dummy, setDummy] = useState(true);

  const checkMerchantStatus = async (user_id) => {
    try {
      const response = await checkUserStatus(user_id);
      //console.log(response.data.status);
      const status = response.data.status;
      setCompleteStatus(status);
      if (status === undefined) {
        setIncompletePopup(true);
      }

      //console.log("complete status " + status);
    } catch (ex) {
      if (ex.response?.status === 400) {
        //console.log("EX", ex);
      } else {
        //console.log("something went wrong", ex);
      }
    } finally {
    }
  };
  // New Mod

  // End-New Mod
  // const ssn = session;
  // const user_id = ssn?.user?.id;
  // //console.log(user_id);
  // const atStartUp = () => {
  //   // // try{
  //   const userInfo = getUserData();
  //   setUser(userInfo);
  //   // const { data } = await getMerchantCredential(userInfo?.id);
  //   const user_id = userInfo?.id;
  //   //console.log("user data", user_id);
  //   setUserId(() => user_id);
  //   //console.log("user id before change", userId);
  //   // //console.log("dummy before change ", dummy);
  //   // setDummy(() => false);
  //   // //console.log("dummy after change: ", dummy);
  //   // }
  // };
  // useEffect(() => {
  //   atStartUp();
  // }, []);
  // useEffect(() => {
  //   if (userId) {
  //     checkMerchantStatus(userId);
  //     //console.log("userId after change 2nd useEffect:", userId);
  //   }
  // }, [userId]);
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
  }, [userId]);
  // TODO: replace the kyc complete placeholder logic by checking database
  const handlerRouting = () => {
    setLoading(true);
    router.push("/user/product");
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // //console.log(user_id);
    // if (completeStatus === "completed") {
    //   setIncompletePopup(false);
    //   setModalPopup(false);
    //   setLoading(true);
    //   router.push("/user/product");
    //   setTimeout(() => {
    //     setLoading(false);
    //   }, 1500);
    // } else if (completeStatus === "pending") {
    //   setModalPopup(true);
    // } else if (completeStatus === undefined) {
    //   setIncompletePopup(true);
    // }
  };

  const handleCloseIncompleteModal = () => {
    setIncompletePopup(false);
  };
  const handleCloseModal = () => {
    setModalPopup(false);
    // //console.log("close initiatied");
  };
  const showSuccessToast = () => {
    toast.success("Company Registered Successfuly. Please wait for Approval.");
  };
  return (
    <>
      <ToastContainer />
      {incompletePopup === true && complete === undefined ? (
        <RegisterModal
          user_id={userId}
          showPopup={incompletePopup}
          successMessage={showSuccessToast}
          onCloseModal={handleCloseIncompleteModal}
        />
      ) : (
        ""
      )}
      {modalPopup === true && complete === "pending" ? (
        <Modal
          tshowPopup={modalPopup}
          onCloseModel={handleCloseModal}
          title="Pending"
          description="Your request has been submitted. Please wait for approval."
        />
      ) : (
        ""
      )}
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
    </>
  );
};

export default Home;
