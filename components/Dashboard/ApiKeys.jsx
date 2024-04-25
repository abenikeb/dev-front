import React from "react";
import Image from "next/image";

const ApiKeys = ({
  credentials,
  setIsPKeyClicked,
  handleCopy,
  copied,
  isPKeyClicked,
}) => {
  return (
    <div className="md:flex gap-3 w-full">
      <div className="w-full bg-white rounded-md border border-gray-300 p-2 relative">
        <div
          className="tooltip tooltip-bottom absolute top-2 right-4"
          data-tip={`Here are the API credentials that are required while making a request to the telebirr Super App API. Using these credentials accordingly, we can access the API of the telebirr Super App. Here is a brief description.
Short Code (Merchant Code): is a unique identifier of a merchant on the telebirr system for receiving payment.
Merchant App ID: is a unique identifier of an application that uses the telebirr payment; it could be a website, app, or mini app.
Fabric App ID: is an identifier to communicate with the fabric API of the payment system.
AppSecret: is an identifier to establish a connection with the fabric API of the payment system.`}
        >
          <button className="bg-lime-500 rounded-full w-5 h-5 text-sm text-black opacity-50">
            ?
          </button>
        </div>
        <div className="flex">
          <div className="key-value flex flex-col gap-y-8 md:gap-y-5 text-sm text-black font-normal pr-3">
            <h3>Merchant AppId </h3>
            <h3>Fabric App ID </h3>
            <h3>ShortCode </h3>
            <h3>App Secret </h3>
          </div>
          <div
            className={`key-value flex flex-col gap-y-7 md:gap-y-3 w-[60%] ${
              credentials ? "" : "animate-pulse"
            }`}
          >
            <div className="flex gap-2 w-full items-center">
              <p className="w-5/6">
                {credentials
                  ? credentials.merchantAppId
                  : "#####-#####-#####-#####"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("merchant_id")}
              >
                <Image
                  src={
                    copied?.merchant_id === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full items-center">
              <p className="w-5/6">
                {credentials
                  ? credentials.fabricAppId
                  : "#####-#####-#####-#####"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("fabric_app_id")}
              >
                <Image
                  src={
                    copied?.fabric_app_id === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full items-center">
              <p className="w-5/6">
                {credentials
                  ? credentials.short_code
                  : "#####-#####-#####-#####"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("short_code")}
              >
                <Image
                  src={
                    copied?.short_code === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div>
            <div className="flex gap-2 w-full items-center">
              <p className="w-5/6">
                {credentials
                  ? credentials.fabricAppSercet
                  : "#####-#####-#####-#####"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("app_secret")}
              >
                <Image
                  src={
                    copied?.app_secret === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-md border border-gray-300 p-2 mt-3 md:mt-0">
        <div className="flex items-center">
          <div className="key-value flex flex-col gap-y-3 md:gap-y-6 ml-2 text-sm text-black font-normal pr-3">
            {/* <h3>Public Key: </h3> */}
            <h3>PrivateKey: </h3>
          </div>
          <div className="key-value w-96 flex flex-col gap-y-6 ml-2 overflow-auto">
            {/* <div className="flex gap-2 w-full items-center">
              <p
                className={`text-sm font-bold truncate w-5/6 ${
                  credentials ? "" : "animate-pulse"
                }`}
              >
                {credentials
                  ? credentials.public_key
                  : "#####-#####-#####-#####"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("public_key")}
              >
                <Image
                  src={
                    copied?.public_key === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div> */}
            <div className="flex gap-2 w-full items-center">
              <p className="text-sm font-bold truncate w-5/6">
                {credentials && isPKeyClicked
                  ? credentials.privateKey
                  : "*****************"}
              </p>
              <div
                className="copy_btn"
                onClick={() => handleCopy("private_key")}
              >
                <Image
                  src={
                    copied?.private_key === false
                      ? "/assets/icons/code.svg"
                      : "/assets/icons/tick.svg"
                  }
                  alt={"tick_icon"}
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 items-center">
          <button
            className="btn btn-sm mt-3 text-sm"
            onClick={() => setIsPKeyClicked(!isPKeyClicked)}
          >
            <span className="hidden md:flex">See Private Key</span>
            <span className="md:hidden">
              <Image
                src="/assets/icons/view.svg"
                alt="tick_icon"
                width={23}
                height={23}
                className="opacity-60"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeys;
