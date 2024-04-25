import React, { useState } from "react";
import CompleteRegistrationForm from "./CompleteRegistration";
import { useEffect } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterModal = (props) => {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    props.showPopup && document.getElementById("register_modal").showModal();
    setUserId(props.user_id);
  }, [props.user_id]);

  useEffect(() => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      user_id: userId,
    }));
  }, [userId]);

  const [userData, setUserData] = useState({
    user_id: userId,
    developerTeamName: "",
    companyName: "",
    businessCategory: "",
    officialWebsite: "ethiotelecom.et",
    contactPersonName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const closeModal = () => {
    console.log("closeModal triggered");
    props.onCloseModal();
  };

  return (
    <>
      <ToastContainer />
      {props.showPopup && (
        <dialog id="register_modal" className="modal">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-xl">Create Organization Account</h3>
            <CompleteRegistrationForm
              data={userData}
              userId={userId}
              closeModal={closeModal}
            />
          </div>
        </dialog>
      )}
    </>
  );
};

export default RegisterModal;
