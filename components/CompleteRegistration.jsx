import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { LoadingDots, Google } from "@/components/shared/icons";
const merchantUrl = "https://developer.ethiotelecom.et/v2/merchant-info/";
import { message } from "antd";

import axios from "axios";
import Cookies from "js-cookie";
import { getUserData } from "@app/api-services/authService";

const CompleteRegistrationForm = ({ userId, closeModal }) => {
  const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(true);
  const [isContactEmailValid, setIsContactEmailValid] = useState(true);
  const [companyNameError, setCompanyTeamNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [userData, setUserData] = useState({
    developerTeamName: "",
    companyName: "",
    businessCategory: "",
    officialWebsite: "ethiotelecom.et",
    contactPersonName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleInputChange = ({ currentTarget: input }) => {
    setUserData({ ...userData, [input.name]: input.value });
  };

  const handleDeveloperTeamNameChange = (event) => {
    const inputValue = event.target.value;
    const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue); // Regex to allow only letters and numbers
    const isValidLength = inputValue.length <= 20; // Maximum 7 characters

    setUserData({ ...userData, developerTeamName: inputValue }); // Update the data regardless of validation

    if (isValidInput && isValidLength) {
      checkDeveloperTeamNameAvailability(inputValue);
      setIsDeveloperTeamNameAvailable(true); // Reset availability status
      setDeveloperTeamNameError(""); // Reset error message
    } else {
      if (!isValidInput) {
        setDeveloperTeamNameError("Please enter only letters and numbers.");
      } else if (!isValidLength) {
        setDeveloperTeamNameError("Please enter a maximum of 20 characters.");
      } else if (inputValue.includes(" ")) {
        setDeveloperTeamNameError("Spaces are not allowed.");
      }
    }
  };

  const handleCompanyNameChange = (event) => {
    const inputValue = event.target.value;
    const isValidInput = /^[a-zA-Z0-9]*$/.test(inputValue); // Regex to allow only letters and numbers
    const isValidLength = inputValue.length <= 20; // Maximum 20 characters

    setUserData({ ...userData, companyName: inputValue }); // Update the data regardless of validation

    if (isValidInput && isValidLength) {
      // checkDeveloperTeamNameAvailability(inputValue)
      // setIsDeveloperTeamNameAvailable(true); // Reset availability status
      setCompanyTeamNameError(""); // Reset error message
    } else {
      if (!isValidInput) {
        setCompanyTeamNameError("Please enter only letters and numbers.");
      } else if (!isValidLength) {
        setCompanyTeamNameError("Please enter a maximum of 20 characters.");
      } else if (inputValue.includes(" ")) {
        setCompanyTeamNameError("Spaces are not allowed.");
      }
    }
  };

  const handleContactEmailChange = (event) => {
    setUserData({ ...userData, contactEmail: event.target.value });
    setIsContactEmailValid(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const {
        developerTeamName,
        companyName,
        businessCategory,
        officialWebsite,
        contactPersonName,
        contactPhone,
        contactEmail,
      } = userData;

      // Generate a random string of length 4
      const randomString = Math.random().toString(36).substring(2, 4);

      const requestData = {
        userId,
        developerTeamName: companyName.toLowerCase() + randomString,
        companyName: companyName.toLowerCase() + randomString,
        contactPersonName: `${getUserData().firstName} ${
          getUserData().lastName
        }`,
        contactPhone,
        contactEmail,
        officialWebsite: "www.ethiotelecom.et",
        businessCategory,
        username: contactEmail,
        fullName: `${getUserData().firstName} ${getUserData().lastName}`,
        teamUsers: [{ id: userId, role: "admin" }],
      };

      const headers = {
        Authorization: "Bearer " + Cookies.get("token"),
        "Content-Type": "application/json",
      };

      const response = await axios.post(merchantUrl, requestData, { headers });

      handleSuccess(response);
    } catch (ex) {
      handleFailure(ex);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (response) => {
    console.log({ response });
    if (response.status === 201) {
      message.success(
        "Your team registration has been submitted successfully.",
        2,
        () => {
          // Reload the page after 2 seconds
          window.location.reload();
        }
      );
      closeModal();
    }
  };

  const handleFailure = (ex) => {
    console.log("EXCEPTION", ex);

    if (ex.response?.status === 400) {
      setError(true);
      handleBadRequest(ex.response.data);
    } else {
      if (ex.response && ex.response.data.error_code === "SYS0003") {
        setError(true);
        showErrorToast(
          "This email is already associated with another account. Please try a different email address"
        );
        setErrorMessage(
          "This email is already associated with another account. Please try a different email address"
        );
      } else {
        setError(true);
        showErrorToast("Something went wrong. Please try again");
        setErrorMessage("Something went wrong. Please try again");
      }
    }
  };

  const handleBadRequest = (errorData) => {
    const { error_code, error_msg } = errorData;

    // setErrorMessage(error_msg);
    showErrorToast(error_msg);
    setErrorMessage(error_msg);

    switch (error_code) {
      case "SYS0001":
        break;
      case "SYS0002":
      case "SYS0003":
        break;
      default:
        // Handle default case
        break;
    }
  };

  const showErrorToast = (errorMessage) => {
    message.error({
      content: errorMessage,
      duration: 5,
      className: "custom-error-toast",
    });
  };

  const checkDeveloperTeamNameAvailability = (inputValue) => {
    // Make an API call to check if the developer team name is available in the database
    // Set setIsDeveloperTeamNameAvailable accordingly
    // Example code:
    // api.checkDeveloperTeamNameAvailability(data.developerTeamName)
    //   .then(response => {
    //     setIsDeveloperTeamNameAvailable(response.available);
    //   });
    // Replace 'api.checkDeveloperTeamNameAvailability' with your actual API call
  };

  const getUserInfoAndSetEmail = () => {
    let user = getUserData();
    console.log({ user });
    setUserData({
      ...userData,
      contactEmail: user?.email,
    });
  };

  useEffect(() => {
    getUserInfoAndSetEmail();
  }, []);

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-full lg:flex-row mt-2">
          {/* Left content */}
          <div className="grid flex-grow h-full place-items-left">
            <div>
              <div className="py-2">
                <span className="text-red-500 mr-2">*</span> Organization Name
                <input
                  type="text"
                  name="companyName"
                  value={userData.companyName}
                  className="input input-bordered w-full "
                  onChange={handleCompanyNameChange}
                  placeholder="Your Organization Name"
                  required
                />
                {companyNameError && (
                  <p className="text-red-500">{companyNameError}</p>
                )}
                {!isCompanyNameAvailable && (
                  <p className="text-red-500">The name is not available.</p>
                )}
              </div>
              <div className="py-2">
                Business Category
                <input
                  type="text"
                  name="businessCategory"
                  value={userData.businessCategory}
                  className="input input-bordered w-full "
                  onChange={handleInputChange}
                  placeholder="Company Business Category"
                />
              </div>
            </div>
          </div>

          <div className="divider lg:divider-horizontal"></div>

          {/* Right content */}
          <div className="grid flex-grow h-full place-items-left">
            {/* <div className="py-2">
              <span className="text-red-500 mr-2">*</span> Contact Person Full
              Name
              <input
                type="text"
                name="contactPersonName"
                value={userData.contactPersonName}
                className="input input-bordered w-full "
                onChange={handleInputChange}
                placeholder="Contact Person Full Name"
                required
              />
            </div> */}
            <div className="py-2">
              <span className="text-red-500 mr-2">*</span> Contact Phone
              <input
                type="tel"
                name="contactPhone"
                value={userData.contactPhone}
                className="input input-bordered w-full"
                onChange={handleInputChange}
                placeholder="Contact Person's Number"
                required
              />
            </div>
            <div className="py-2">
              <span className="text-red-500 mr-2">*</span> Contact E-Mail
              <input
                type="email"
                name="contactEmail"
                value={userData.contactEmail}
                className="input input-bordered w-full "
                onChange={handleContactEmailChange}
                placeholder="Contact Person's Email"
                required
                readOnly
              />
              {!isContactEmailValid && (
                <p className="text-red-500">
                  Please enter a valid email address.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-end space-x-4">
          <button
            className="btn btn-primary border-none hover:bg-lime-400 w-32 bg-lime-500 text-white"
            type="submit"
          >
            {loading ? (
              <LoadingDots color="#808080" />
            ) : (
              <>
                <p>submit</p>
              </>
            )}
          </button>

          <button
            className="btn btn-primary border-none hover:bg-gray-400 w-32 bg-gray-500 text-white"
            onClick={closeModal}
          >
            Skip
          </button>
        </div>
      </form>
    </>
  );
};

export default CompleteRegistrationForm;
