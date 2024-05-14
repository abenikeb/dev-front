/** @format */

"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "../../api-services/authService";
import { getCredential } from "@app/api-services/configService";
import withErrorHandler from "@hoc/withErrorHandler/withErrorHandler";
import {
  getCodeSnippet,
  saveCodeResponse,
} from "@app/api-services/codeSnippetsService";
import Sidebar from "@components/Sidebar";
import CodeSnippet from "@components/CodeSnippet";
import ResponseSnippet from "@components/ResponseSnippet";
import Languages from "@components/languges";
import serviceUtility from "@util/serviceUtility";
import Mockup from "./Mockup";

// import { authCheckState } from "../../api-services/authService";
import getTopics from "../../api-services/topicsService";
import ApiKey from "@components/Dashboard/ApiKeys";
import Intitution from "@components/Dashboard/Intitution";
import Info from "@components/Dashboard/Info";
import { useMockUpModal } from "@components/Dashboard/mock-up-modal";

const Dashboard = ({ post }) => {
  const router = useRouter();
  const [isUserLogin, setIsUserLogin] = useState(false);
  const [user, setUser] = useState(null);

  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState({
    merchant_id: false,
    fabric_app_id: false,
    short_code: false,
    app_secret: false,
    public_key: false,
    private_key: false,
  });
  const [isPKeyClicked, setIsPKeyClicked] = useState(false);

  const [topics, setTopics] = useState([]);
  const [envVariables, setEnvVariables] = useState(null); // bareer token
  const [prepayID, setPrepayID] = useState(null); // bareer token
  const [activeNavBar, setActiveNavBar] = useState(null);
  const [isMockStarted, setMocStarted] = useState(null);
  const [codeSnippets, setCodeSnippets] = useState(null);
  const [plValue, setPlValue] = useState("Python");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [mainTopicId, setMainTopicID] = useState(1);
  const [httpResponse, setHttpResponse] = useState({});
  const [activeTab, setActiveTab] = useState("code");
  const { MocakUpModal, setShowMockModal } = useMockUpModal();

  async function startUp() {
    try {
      // authCheckState();
      const topics = getTopics();
      setTopics(topics);

      // When Start a server it populate some code snippets on the state
      const { codeSnippets } = getCodeSnippet(1, 1);
      setCodeSnippets(codeSnippets); // set the code snipets with out filtering the languages

      const userInfo = getUserData();
      let user_id;

      if (userInfo.role === "admin" || userInfo.role === "Admin") {
        user_id = userInfo.id;
      } else if (userInfo.role === "Developer") {
        user_id = userInfo.userId;
      }

      setUser(userInfo);
      if (userInfo !== null) {
        setIsUserLogin(true);
        const { data } = await getCredential(user_id);
        //console.log("user data", data);
        setCredentials(data);
      } else {
        setIsUserLogin(false);
        return router.push("/guest/login");
      }
    } catch (ex) {
      //console.log("ERROR", ex);
    }
  }

  useEffect(() => {
    startUp();
  }, []);

  useEffect(() => {
    document.getElementById("section2").scrollIntoView({ behavior: "smooth" });
  }, [codeSnippets]);

  const handleCopy = (key_) => {
    //console.log({
    //   key_,
    //   credentials: credentials[key_],
    // });
    setCopied({ ...copied, [key_]: true });
    navigator.clipboard.writeText(credentials[key_]);
    setTimeout(() => setCopied({ ...copied, [key_]: false }), 3000);
  };

  const handleClickedLanguage = (PlValue) => {
    setPlValue(PlValue);
  };

  const handleCodeReponse = async () => {
    if (codeSnippets?.name === "Checkout") {
      if (prepayID === null) {
        const rawRequestResult = {
          rawRequest:
            "appid=" +
            credentials.merchant_id +
            "&merch_code=" +
            credentials.short_code +
            "\n&nonce_str=12345678901234567890123456789011&prepay_id=" +
            prepayID +
            "&sign=ujhjhhbhsv73787835/3njnjn5jn535+njnbjnjfb&sign_type=SHA256WithRSA&timestamp=1234323432",
        };
        setHttpResponse(rawRequestResult);
        document
          .getElementById("section1")
          .scrollIntoView({ behavior: "smooth" }); // scroll to response page
        setTimeout(() => setMocStarted(3), 4000); // after 4 sec initate the Mockup modal with Error message
        return;
      }

      const rawRequestResult = {
        rawRequest:
          "appid=" +
          credentials.merchant_id +
          "&merch_code=" +
          credentials.short_code +
          "\n&nonce_str=12345678901234567890123456789011&prepay_id=" +
          prepayID +
          "&sign=ujhjhhbhsv73787835/3njnjn5jn535+njnbjnjfb&sign_type=SHA256WithRSA&timestamp=1234323432",
      };

      setHttpResponse(rawRequestResult);
      document
        .getElementById("section1")
        .scrollIntoView({ behavior: "smooth" }); // scroll to response page
      setTimeout(() => setMocStarted(2), 4000); // after 4 sec initate the mocup page
      return;
    }

    const resService = serviceUtility(
      codeSnippets?.name,
      credentials,
      paymentMethod,
      envVariables
    ); //make a request template and send to backend

    const res = await saveCodeResponse(resService);
    if (res.token) setEnvVariables(res?.token);
    if (res?.biz_content?.prepay_id) setPrepayID(res?.biz_content.prepay_id);
    setHttpResponse(res);
    document.getElementById("section1").scrollIntoView({ behavior: "smooth" });
  };

  const handleClickTopic = (topic_id, supTopicId) => {
    const { filteredPaymentMethod, codeSnippets } = getCodeSnippet(
      Number(topic_id),
      Number(supTopicId)
    );
    setCodeSnippets(codeSnippets); // set the code snipets with out filtering the languages
    setPaymentMethod(filteredPaymentMethod.name);
    setHttpResponse({}); //reset the http response state
    setMainTopicID(filteredPaymentMethod.id);
  };

  const handleNextTopicBtn = (idx1, idx2) => {
    // idx1 = mainTopicId
    // idx2 = codeSnippets?.id what is next --> {createOrder, checkout}
    if (idx2 === 2) {
      if (envVariables === null) {
        return alert(
          "You haven't gotten the right token; please Run the simulator and try again."
        );
      }
    } else if (idx2 === 3) {
      if (prepayID === null) {
        return alert(
          "You haven't gotten the right PrepayId from this API interface; please go to step 1 and try again."
        );
      }
    }
    handleClickTopic(idx1, idx2);
    setActiveNavBar(3);
  };

  const handlePrevTopicBtn = (idx1, idx2) => {
    if (codeSnippets?.id === 2) {
      handleClickTopic(mainTopicId, 1);
      setActiveNavBar(3);
    }
    if (codeSnippets?.id === 3) {
      handleClickTopic(mainTopicId, 2);
      setActiveNavBar(3);
    }
  };

  const handleTabButton = (nextActiveTab) => {
    const currentPage = document.querySelector(".tab-content.active");
    const nextPage = document.getElementById(nextActiveTab);

    currentPage.classList.remove("active");
    nextPage.classList.add("active");

    setActiveTab(nextActiveTab);
  };

  return (
    <div className="dashboard">
      {/* SIDE BAR SECTION START */}
      <div id="section2" class="scrollToMe" />
      <Sidebar
        topics={topics}
        onClickLanguage={handleClickedLanguage}
        onClickTopic={handleClickTopic}
        activeNavBar={activeNavBar}
      />
      {/* SIDE BAR SECTION END */}

      {/* Desktop Section */}
      <section className="sm:flex sm:flex-col hidden dash-body ml-6 md:ml-[20rem] w-11/12 md:w-[75%]">
        {/* API KEYS SECTION START */}
        <ApiKey
          credentials={credentials}
          setIsPKeyClicked={setIsPKeyClicked}
          handleCopy={handleCopy}
          copied={copied}
          isPKeyClicked={isPKeyClicked}
        />
        {/* API KEYS SECTION END */}

        <div className="code-snippet">
          <Languages onClickLanguage={handleClickedLanguage} />

          {/* CODE HEADER START */}
          <div className="code-header w-full">
            <div className="flex flex-row justify-center items-center">
              <h3 className="text-xl font-semibold ">{`Step ${codeSnippets?.id}: ${codeSnippets?.name}`}</h3>
              <div
                className="tooltip"
                data-tip={`${codeSnippets?.description}`}
              >
                <button className="bg-lime-500 rounded-full w-5 h-5 text-sm text-black opacity-50">
                  ?
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="tooltip" data-tip="Run & See the Result!">
                <button className="bg-lime-500 rounded-full w-5 h-5 text-sm text-black opacity-60">
                  ?
                </button>
              </div>
              <button
                id="myButton"
                className="card__button"
                onClick={handleCodeReponse}
              >
                Run
              </button>
            </div>
          </div>
          {/* CODE HEADER END */}

          {/* CODE BODY START */}
          {isMockStarted === 2 && <Mockup id="2" />}
          {isMockStarted === 3 && <Mockup id="3" />}

          <div className="code-body mt-8 flex flex-col max-w-6xl">
            <div className="flex flex-row justify-start items-center gap-3">
              <button className="text-gray-700 text-lg border-b-4 border-lime-500 mr-3">
                Codes
              </button>

              <Mockup id="1" />

              <Link
                href="http://developer.ethiotelecom.et/docs/GettingStarted"
                target="_blank"
                className="text-gray-700 text-lg"
              >
                Docuementation
              </Link>
            </div>

            {/* INFORMATION SECTION START */}
            <Info>
              <Intitution
                codeSnippets={codeSnippets}
                id={1}
                icon="icon"
                isResponseCode={false}
              />
              <Intitution
                codeSnippets={codeSnippets}
                id={2}
                icon="icon"
                isResponseCode={false}
              />
              <Intitution
                codeSnippets={codeSnippets}
                id={3}
                icon="icon"
                isResponseCode={false}
              />
            </Info>
            {/* INFORMATION SECTION END */}

            <CodeSnippet
              codeSnippets={codeSnippets}
              paymentMethod={paymentMethod}
              plValue={plValue}
              credentials={credentials}
            />

            <div className="w-full relative my-4 mb-8">
              <div className="flex justify-center items-center absolute -left-1">
                <div
                  className="tooltip relative top-0 left-32"
                  data-tip="Run and see the response!"
                >
                  <button className="bg-white rounded-full w-5 h-5 text-sm text-black opacity-70">
                    ?
                  </button>
                </div>
                <button
                  id="myButton"
                  className="btn w-36 bg-lime-500 text-white border-none hover:bg-lime-400 hover:text-black"
                  onClick={handleCodeReponse}
                >
                  Run
                </button>
              </div>
            </div>

            <div id="section1" className="scrollToMe" />
            <ResponseSnippet responseCode={JSON.stringify(httpResponse)} />

            {/* RESPONSE ~ INFORMATION SECTION START */}
            {/* <Info>
              <Intitution
                codeSnippets={codeSnippets}
                httpResponse={httpResponse}
                id={5}
                key_={1}
                data={httpResponse?.token}
                icon="icon"
                isResponseCode={true}
              />
              <Intitution
                codeSnippets={codeSnippets}
                httpResponse={httpResponse}
                id={6}
                key_={2}
                data={httpResponse?.msg === "success"}
                icon="icon"
                isResponseCode={true}
              />
              <Intitution
                codeSnippets={codeSnippets}
                httpResponse={httpResponse}
                id={7}
                key_={3}
                data={prepayID !== null}
                icon="icon"
                isResponseCode={true}
              />
            </Info> */}
            {/* RESPONSE ~ INFORMATION SECTION END */}

            {/* Prev and Next Btn Here */}
            <div className="my-5 flex relative">
              {/* Back Button */}
              {codeSnippets?.id !== 1 && (
                <button
                  disabled={codeSnippets?.id === 1}
                  onClick={handlePrevTopicBtn}
                  className={`rounded-md text-white flex flex-row justify-between items-center gap-x-2 px-4 py-1.5 absolute top-3 left-0 ${
                    codeSnippets?.id === 1 ? "bg-gray-400" : "bg-gray-700"
                  }`}
                >
                  <span className="text-2xl font-bold">{`<`}</span>
                  <div className="flex flex-col items-start">
                    <p className="text-base-200 text-sm font-bold opacity-75">
                      Prev
                    </p>
                    <p className="">
                      {codeSnippets?.id === 2
                        ? "Apply Fabric Token"
                        : "Create Order"}
                    </p>
                  </div>
                </button>
              )}

              {/* Next Button*/}
              {codeSnippets?.id !== 3 && (
                <button
                  onClick={() =>
                    handleNextTopicBtn(
                      mainTopicId,
                      codeSnippets?.id === 1 ? 2 : 3
                    )
                  }
                  className="bg-gray-700 rounded-md text-white flex flex-row justify-between items-center gap-x-2 px-4 py-1.5 absolute top-3 right-0"
                >
                  <div className="flex flex-col items-end">
                    <p className="text-base-200 text-sm font-bold opacity-75">
                      Next
                    </p>
                    <p className="">
                      {codeSnippets?.id === 1 ? "Create Order" : "Check out"}
                    </p>
                  </div>
                  <div className="text-2xl font-bold">{`>`}</div>
                </button>
              )}
            </div>

            {/* Full project Download */}
            <div className="flex flex-row gap-x-3 mb-5 mt-20 self-end">
              <Link
                href={`https://developer.ethiotelecom.et/developer_tools/static/download/ET_DEMO_${plValue}.zip`}
              >
                <button className="btn">Get Full Project</button>
              </Link>
              <Link
                href={`https://developer.ethiotelecom.et/developer_tools/static/download/Postman_Collection_&_Envirnoment.zip`}
              >
                <button className="btn bg-lime-500 text-white">
                  Postman collection
                </button>
              </Link>
            </div>
          </div>
          {/* CODE BODY END */}
        </div>
      </section>

      {/* Mobile Section */}
      <section className="sm:hidden flex flex-col w-full ml-10 text-lg">
        <div className="tabs w-full">
          <a
            onClick={() => handleTabButton("code")}
            className={`tab tab-bordered ${
              activeTab === "code" && "tab-active"
            }`}
          >
            Code
          </a>
          <a
            onClick={() => handleTabButton("keys")}
            className={`tab tab-bordered ${
              activeTab === "keys" && "tab-active"
            }`}
          >
            Keys
          </a>
          <a
            onClick={() => handleTabButton("documentation")}
            className={`tab tab-bordered ${
              activeTab === "documentation" && "tab-active"
            }`}
          >
            Documentation
          </a>
        </div>

        <div className="tab-content active" id="code">
          {/* CODE HEADER START */}
          <div className="code-header w-11/12">
            <div className="flex flex-row justify-center items-center">
              <h3 className="font-semibold ">{`Step ${codeSnippets?.id}: ${codeSnippets?.name}`}</h3>
              <div
                className="tooltip"
                data-tip={`${codeSnippets?.description}`}
              >
                <button className="bg-lime-500 rounded-full w-4 h-4 text-xs text-black opacity-70">
                  ?
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="tooltip" data-tip="Run & See the Result!">
                <button className="bg-lime-500 rounded-full w-4 h-4 text-xs text-black opacity-70">
                  ?
                </button>
              </div>
              <button
                id="myButton"
                className="card__button"
                onClick={handleCodeReponse}
              >
                Run
              </button>
            </div>
          </div>
          {/* CODE HEADER END */}

          <CodeSnippet
            codeSnippets={codeSnippets}
            plValue={plValue}
            credentials={credentials}
          />
          <div id="section1" className="scrollToMe" />
          <ResponseSnippet responseCode={JSON.stringify(httpResponse)} />

          <div className="ml-auto">
            <button
              onClick={() =>
                handleNextTopicBtn(mainTopicId, codeSnippets?.id === 1 ? 2 : 3)
              }
              className="bg-gray-700 rounded-md text-white flex flex-row justify-between items-center gap-x-2 my-5 px-4 py-1.5"
            >
              <div className="flex flex-col items-end">
                <p className="text-base-200 text-sm font-bold opacity-75">
                  Next
                </p>
                <p className="">
                  {codeSnippets?.id === 1 ? "Create Order" : "Check out"}
                </p>
              </div>
              <div className="text-2xl font-bold">{`>`}</div>
            </button>
          </div>
        </div>

        {/* TAB SECTION 2 -- API KEYS SECTION START */}
        <div className="tab-content" id="keys">
          <div className="w-full">
            <div className="w-full bg-white rounded-md border border-gray-300 px-4 py-2">
              <div className="flex flex-col gap-y-2">
                <div>
                  <h3 className="font-bold">Merchant AppId </h3>
                  <p>
                    {credentials
                      ? credentials.merchantAppId
                      : "#####-#####-#####-#####"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Fabric App ID </h3>
                  <p>
                    {credentials
                      ? credentials.fabricAppId
                      : "#####-#####-#####-#####"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">ShortCode</h3>
                  <p>
                    {credentials
                      ? credentials.short_code
                      : "#####-#####-#####-#####"}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold">App Secret </h3>
                  <p>
                    {credentials
                      ? credentials.fabricAppSercet
                      : "#####-#####-#####-#####"}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-md border border-gray-300 px-2 py-2 mt-5 md:mt-0">
              <div className="flex flex-col gap-y-2 w-72 overflow-auto">
                <div>
                  <h3 className="font-bold">Public Key</h3>
                  <p className="truncate">
                    {credentials
                      ? credentials.public_key
                      : "#####-#####-#####-#####"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold">Private Key </h3>
                  <p className="truncate">
                    {credentials && isPKeyClicked
                      ? credentials.private_key
                      : "*****************"}
                  </p>
                </div>
              </div>

              <div className="flex flex-row gap-3 items-center mt-4">
                <button
                  className="btn h-10"
                  onClick={() => setIsPKeyClicked(!isPKeyClicked)}
                >
                  <span>See Private Key</span>
                </button>
                <div className="copy_btn" onClick={handleCopy}>
                  <Image
                    src={
                      copied === true
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
        {/* API KEYS SECTION END */}

        <div class="tab-content" id="documentation">
          <div className="flex justify-center items-center mt-20">
            <Link
              href="http://developer.ethiotelecom.et/docs/GettingStarted"
              className="btn"
            >
              Go to Documentation
            </Link>
          </div>
        </div>
      </section>

      <MocakUpModal />
    </div>
  );
};

export default withErrorHandler(Dashboard);
