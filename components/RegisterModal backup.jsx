// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import Button from "./UI/Button/Button";
// import CompleteRegistrationForm from "./CompleteRegistration";
// import { useEffect } from "react";
// import { LoadingDots, Google } from "@/components/shared/icons";
// import { getUserData } from "@app/api-services/authService";
// import {
//   registerOnManagementConsole,
//   checkUserStatus,
// } from "../app/api-services/userService";
// import userSession from "@lib/hooks/userSession";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { toast } from "react-toastify";
// import http from "@app/api-services/httpService";
// const RegisterModal = (props) => {
//   // const [isOpen, setIsOpen] = useState(true);
//   const session = userSession();
//   const [userId, setUserId] = useState(null);
//   const [loding, setLoading] = useState(false);
//   const [user, setUser] = useState();
//   const [errors, setErrors] = useState(null);

//   useEffect(() => {
//     props.showPopup && document.getElementById("register_modal").showModal();
//     setUserId(props.user_id);
//   }, [props.user_id]);

//   useEffect(() => {
//     setUserData((prevUserData) => ({
//       ...prevUserData,
//       user_id: userId,
//     }));
//   }, [userId]);

//   const [userData, setUserData] = useState({
//     user_id: userId,
//     developerTeamName: "",
//     companyName: "",
//     businessCategory: "",
//     officialWebsite: "",
//     contactPersonName: "",
//     contactPhone: "",
//     contactEmail: "",
//   });

//   const closeModal = () => {
//     //console.log("closeModal triggered");
//     props.onCloseModal();
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     try {
//       const {
//         user_id,
//         developerTeamName,
//         companyName,
//         businessCategory,
//         officialWebsite,
//         contactPersonName,
//         contactPhone,
//         contactEmail,
//       } = userData;
//       const response = await registerOnManagementConsole(
//         user_id,
//         developerTeamName,
//         companyName,
//         businessCategory,
//         officialWebsite,
//         contactPersonName,
//         contactPhone,
//         contactEmail
//       );

//       //console.log({ response });

//       if (response.status === 201) {
//         const { data: appCubeRegestrationData } = await http.post(
//           `https://developer.ethiotelecom.et/v2/appcube/setup`,
//           {
//             user_id,
//             developerTeamName,
//             companyName,
//             contactPersonName,
//             contactPhone,
//             contactEmail,
//             officialWebsite,
//             businessCategory,
//           }
//         );

//         //console.log({
//           siteId: appCubeRegestrationData.siteId,
//           tenant: appCubeRegestrationData?.tenantId,
//         });

//         if (appCubeRegestrationData) {
//           //console.log("User registered on on CAS appCube");

//           if (appCubeRegestrationData) {
//             const { data: siteegestrationData } = await http.post(
//               `https://developer.ethiotelecom.et/v2/appCubeUser/create`,
//               {
//                 UserId: user_id,
//                 UserName: contactEmail,
//                 siteId: appCubeRegestrationData.siteId,
//                 tenantId: appCubeRegestrationData?.tenantId,
//               }
//             );
//             if (siteegestrationData) {
//               setLoading(false);
//               // closeModal();
//             }
//           }

//           closeModal();

//           props.successMessage();

//           setLoading(false);
//         } else {
//           alert(JSON.stringify("Some thing went when appCubeUser/create"));
//         }
//       } else {
//         alert(
//           JSON.stringify(
//             "Something went wrong when on registering On Management Console"
//           )
//         );
//         setLoading(false);
//       }
//     } catch (ex) {
//       if (ex.response?.status === 400) {
//         //console.log("EXCEPTION 400", ex);
//         //console.log(ex.response);
//         if (ex.response.data.error_code === "SYS0001") {
//           alert(ex.response.data.error_msg);
//         } else if (ex.response.data.error_code === "SYS0002") {
//           alert(ex.response.data.error_msg);
//         } else if (ex.response.data.error_code === "SYS0003") {
//           alert(ex.response.data.error_msg);
//         } else {
//           alert(ex.response.data.message);
//         }
//         // setError(ex?.response?.data);
//       } else {
//         //console.log("Something went wrong. SYS0001", ex);
//         setLoading(false);
//         //setError("Something went wrong.");
//       }
//     } finally {
//       //setErrors(null);
//       // recaptchaRef.current.reset();
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       {props.showPopup && (
//         <dialog id="register_modal" className="modal">
//           <div className="modal-box w-11/12 max-w-5xl">
//             <h3 className="font-bold text-xl">Fill Developer Information</h3>
//             <CompleteRegistrationForm
//               data={userData}
//               userId={userId}
//               // setData={setUserData}
//               // handleSubmit={handleSubmit}
//               // onChange={handleInputChange}
//               closeModal={closeModal}
//               // loading={loding}
//             />
//             {/* <div className="modal-action">
//               <button className="btn btn-xs" onClick={closeModal}>
//                 Skip
//               </button>
//             </div> */}
//           </div>
//         </dialog>
//       )}
//     </>
//   );
// };

// export default RegisterModal;
