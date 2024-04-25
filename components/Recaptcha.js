// components/Recaptcha.js
import ReCAPTCHA from "react-google-recaptcha";
import React from "react";

const Recaptcha = ({ onChange }) => {
  const recaptchaRef = React.createRef();

  const handleChange = () => {
    onChange(recaptchaRef.current.getValue());
  };

  return <ReCAPTCHA ref={recaptchaRef} sitekey="6Lcde0onAAAAACVjtMRWcjqcWgtmAFvrizrPMZVQ" onChange={handleChange} />;
};

export default Recaptcha;
