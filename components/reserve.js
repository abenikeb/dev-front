// import React, { useState } from "react";
// import { LoadingDots, Google } from "@/components/shared/icons";

// const CompleteRegistrationForm = ({
//   data,
//   setData,
//   handleSubmit,
//   onChange,
//   closeModal,
//   loading
// }) => {
//   const [isDeveloperTeamNameAvailable, setIsDeveloperTeamNameAvailable] = useState(true);
//   const [isCompanyNameAvailable, setIsCompanyNameAvailable] = useState(true);
//   const [isContactEmailValid, setIsContactEmailValid] = useState(true);
//   const [developerTeamNameError, setDeveloperTeamNameError] = useState("");

//   const checkDeveloperTeamNameAvailability = () => {
//     // Make an API call to check if the developer team name is available in the database
//     // Set setIsDeveloperTeamNameAvailable accordingly
//     // Example code:
//     // api.checkDeveloperTeamNameAvailability(data.developerTeamName)
//     //   .then(response => {
//     //     setIsDeveloperTeamNameAvailable(response.available);
//     //   });
//     // Replace 'api.checkDeveloperTeamNameAvailability' with your actual API call
//   };

//   const checkCompanyNameAvailability = () => {
//     // Make an API call to check if the company name is available in the database
//     // Set setIsCompanyNameAvailable accordingly
//     // Example code:
//     // api.checkCompanyNameAvailability(data.companyName)
//     //   .then(response => {
//     //     setIsCompanyNameAvailable(response.available);
//     //   });
//     // Replace 'api.checkCompanyNameAvailability' with your actual API call
//   };

//   const validateEmail = () => {
//     // You can use a regular expression or a library like 'validator' to validate the email
//     // Example code using 'validator':
//     // const isValidEmail = validator.isEmail(data.contactEmail);
//     // setIsContactEmailValid(isValidEmail);
//     // Replace 'validator.isEmail' with your actual email validation code
//   };

//   const handleDeveloperTeamNameChange = (event) => {
//     const inputValue = event.target.value;
//     const isValidInput = /^[a-zA-Z0-9\s]*$/.test(inputValue); // Regex to allow only letters, numbers, and spaces

//     if (isValidInput) {
//       setData({ ...data, developerTeamName: inputValue });
//       setIsDeveloperTeamNameAvailable(true); // Reset availability status
//       setDeveloperTeamNameError(""); // Reset error message
//     } else {
//       setDeveloperTeamNameError("Please enter only letters, numbers, and spaces.");
//     }
//   };

//   const handleCompanyNameChange = (event) => {
//     setData({ ...data, companyName: event.target.value });
//     setIsCompanyNameAvailable(true); // Reset availability status
//   };

//   const handleContactEmailChange = (event) => {
//     setData({ ...data, contactEmail: event.target.value });
//     setIsContactEmailValid(true); // Reset email validation status
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();

//     // Perform input validations
//     checkDeveloperTeamNameAvailability();
//     checkCompanyNameAvailability();
//     validateEmail();

//     // Proceed with form submission if all validations pass
//     if (isDeveloperTeamNameAvailable && isCompanyNameAvailable && isContactEmailValid) {
//       handleSubmit();
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleFormSubmit}>
//         <div className="flex flex-col w-full lg:flex-row">
//           {/* Left content */}
//           <div className="grid flex-grow h-full place-items-left">
//             <div>
//               <div className="py-2">
//                 Developer Team Name
//                 <input
//                   type="text"
//                   name="developerTeamName"
//                   value={data.developerTeamName}
//                   className="input input-bordered w-full"
//                   onChange={handleDeveloperTeamNameChange}
//                   placeholder="Developer Team Name"
//                   required
//                 />
//                 {developerTeamNameError && (
//                   <p className="text-red-500">{developerTeamNameError}</p>
//                 )}
//                 {!isDeveloperTeamNameAvailable && !developerTeamNameError && (
//                   <p className="text-red-500">The name is not available.</p>
//                 )}
//               </div>
//               <div className="py-2">
//                 Company Name
//                 <input
//                   type="text"
//                   name="companyName"
//                   value={data.companyName}
//                   className="input input-bordered w-full"
//                   onChange={handleCompanyNameChange}
//                   placeholder="Your Organization Name"
//                   required
//                 />
//                 {!isCompanyNameAvailable && (
//                   <p className="text-red-500">The name is not available.</p>
//                 )}
//               </div>
//               <div className="py-2">
//                 Business Category
//                 <input
//                   type="text"
//                   name="businessCategory"
//                   value={data.businessCategory}
//                   className="input input