// recaptchaConfig.js
import { ReCaptchaProvider } from 'react-recaptcha-v3';

const reCAPTCHAConfig = {
  siteKey: '6LdA4kUpAAAAAM1rcZ9S6OACBE9ZsOr0hXyMYCOO',
  action: 'signup' // Specify the action name for reCAPTCHA verification
};

const ReCAPTCHAProviderWrapper = ({ children }) => (
  <ReCaptchaProvider {...reCAPTCHAConfig}>{children}</ReCaptchaProvider>
);

export default ReCAPTCHAProviderWrapper;
