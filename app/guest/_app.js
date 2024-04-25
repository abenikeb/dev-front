// pages/_app.js

import { ReCaptchaProvider } from 'react-google-recaptcha-v3';

function MyApp({ Component, pageProps }) {
    return (
        <ReCaptchaProvider
            reCaptchaKey="YOUR_RECAPTCHA_SITE_KEY"
        >
            <Component {...pageProps} />
        </ReCaptchaProvider>
    );
}

export default MyApp;