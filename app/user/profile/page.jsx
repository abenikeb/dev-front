"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Joi from "joi-browser";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import ToastyModal from "@components/UI/ToastyModal/ToastModal";
import InputField from "../../../components/Input";

import { Image, Button, Upload } from "antd";
import { getUserData } from "../../api-services/authService";
import { UploadOutlined } from "@ant-design/icons";

import { update, updatePassword } from "@app/api-services/userService";
import { MiniLoading } from "@components/UI/miniLoading";
import axios from "axios";
import { API_END_POINT } from "@app/api-services/httpConstant";

const Profile = () => {
  const router = useRouter();
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    tel: "",
    email: "",
    password: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passMessage, setpassMessage] = useState("");
  const [profileImage, setProfileImage] = useState(user?.profileImage);

  useEffect(() => {
    const user = getUserData();
    if (!user) {
      return router.push("/guest/login");
    }
    setUser(user);
    if (user !== null) {
      setIsUserLogin(true);
      populateUser(user._id);
    }
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    const data = { ...userData };
    data[input.name] = input.value;
    setUserData(data);
  };

  let populateUser = async (_id) => {
    try {
      const userId = _id;
      if (userId == "new") return;

      const user = getUserData();
      setUserData(mapToViewModel(user));
    } catch (ex) {
      if (ex.response && ex.response.status === 404) router.replace("/");
    }
  };

  const mapToViewModel = (user) => {
    return {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      tel: user.tel,
      email: user.email,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const up = await update(userData);
      if (up.status === 200) {
        setMessage("User Profile Updated Successfuly");
      }
      setLoading(false);
      return;
    } catch (error) {
      //console.log(error);
      setLoading(false);
    } finally {
      setTimeout(() => {
        setMessage(null);
      }, 4000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setpassMessage("New password and confirm password fields do not match");
      return;
    }

    try {
      const response = await updatePassword(
        user?.id,
        currentPassword,
        newPassword
      );
      if (response.data.success) {
        setMessage("Password updated successfully");
      } else {
        setpassMessage("Invalid current password");
      }
    } catch (error) {
      setpassMessage("An error occurred");
    } finally {
      setTimeout(() => {
        setMessage(null);
        setpassMessage(null);
      }, 4000);
    }
  };

  const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      //console.log({
      //   file,
      // });

      const response = await axios.post(
        `${API_END_POINT}/user/upload/${user.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedProfileImage = response.data.user.profileImage;

      setProfileImage(updatedProfileImage);

      //console.log("File uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="md:flex place-items-start">
      <div className="gap-4 md:gap-0 content-center bg-white md:bg-none w-[20%] p-8 rounded-md shadow-md">
        <Upload
          customRequest={({ file }) => handleUpload(file)}
          showUploadList={false}
        >
          <div className="rounded-full border-2 border-lime-500 w-48 h-48 flex justify-center items-center mx-auto">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Image"
                style={{ width: "150px", height: "150px" }}
              />
            ) : (
              <>
                <Image
                  src="/assets/icons/user.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </>
            )}
          </div>
          <div className="text-center">
            <p className="font-bold text-2xl mt-4">{`${user?.firstName} ${user?.lastName}`}</p>
          </div>
          {!profileImage ? (
            <Button
              type="default"
              icon={<UploadOutlined />}
              className="border-2 border-lime-500 rounded py-2 text-lg hover:bg-lime-500 hover:text-white w-2/4 mt-4 flex justify-center items-center mx-auto"
            >
              Upload
            </Button>
          ) : (
            <>
              <Button
                type="default"
                icon={<UploadOutlined />}
                className="border-2 border-lime-500 rounded py-2 text-lg hover:bg-lime-500 hover:text-white w-2/3 mt-4 flex justify-center items-center mx-auto"
              >
                Change Profile
              </Button>
            </>
          )}
        </Upload>
      </div>

      <div className="w-auto md:mx-20">
        {/* Change Profile Form */}
        <form
          onSubmit={handleSubmit}
          className="grid place-content-center md:grid-cols-2 gap-4 bg-white px-10 py-5 drop-shadow-md w-auto mb-5"
        >
          <p className="font-bold text-lg">PERSONAL INFORMATION</p>
          <h1></h1>
          <InputField
            title="First name"
            name="firstName"
            value={userData["firstName"]}
            onChange={handleChange}
          />
          <InputField
            title="Last name"
            name="lastName"
            value={userData["lastName"]}
            onChange={handleChange}
          />
          <InputField
            title="email"
            type="email"
            name="email"
            value={userData["email"]}
            onChange={handleChange}
          />
          <InputField
            title="Phone number"
            type="Number"
            name="tel"
            value={userData["tel"]}
            onChange={handleChange}
          />
          <center className="grid md:hidden">
            <button
              type="submit"
              className="my-4 mx-3 border-2 border-lime-500 bg-lime-500 text-white rounded w-4/6 py-px text-xl hover:bg-white hover:text-lime-500"
            >
              Save
            </button>
          </center>
          <button
            type="submit"
            className="md:grid hidden my-4 mx-3 border-2 border-lime-500 bg-lime-500 text-white rounded w-4/6 py-px text-xl hover:bg-white hover:text-lime-500"
          >
            Save
          </button>
        </form>
        {/* {message && <div>{message}</div>} */}
        {/* Change Password Form */}
        <form
          onSubmit={handlePasswordSubmit}
          className="grid grid-cols-1 gap-4 bg-white pl-10 pr-50 py-5 drop-shadow-md mb-10"
        >
          <p className="font-bold text-lg">CHANGE PASSWORD</p>
          <h1></h1>
          <InputField
            title="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <InputField
            title="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <InputField
            title="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <center className="grid md:hidden">
            <button
              type="submit"
              className="my-4 mx-3 border-2 border-lime-500 bg-lime-500 text-white rounded w-2/6 py-px text-xl hover:bg-white hover:text-lime-500"
            >
              Change Password
            </button>
          </center>
          <button
            type="submit"
            className="md:grid hidden my-4 mx-3 border-2 border-lime-500 bg-lime-500 text-white rounded w-2/6 py-px text-xl hover:bg-white hover:text-lime-500"
          >
            Change Password
          </button>
          {passMessage && (
            <div className="text-red-400 font-semibold">{passMessage}</div>
          )}
        </form>
      </div>

      <MiniLoading isLoading={loading} />

      <ToastyModal status="success" show={message}>
        {message}
      </ToastyModal>
    </div>
  );
};
export default withErrorHandler(Profile);
