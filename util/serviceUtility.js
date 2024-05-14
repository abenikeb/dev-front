import * as _env from "./../app/api-services/httpConstant";
// const tools = require("./tools");
// import tools from "./tools";

const serviceUtility = (name, credentials, token, envVariables) => {
  let cofigData = null;
  let apiEndPoint =
    "https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway/payment/v1";

  if (name === "ApplyFabricToken") {
    //console.log({ name, token, credentials, envVariables });
    cofigData = {
      name,
      // url: `${apiEndPoint}/token`,
      url: `/token`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": credentials?.fabricAppId,
      },
      data: {
        appSecret: credentials?.fabricAppSercet,
      },
    };
  } else if (name === "CreateOrder") {
    // //console.log({ name, envVariables, credentials, token})
    let datax = {
      nonce_str: "fcab0d2949e64a69a212aa83eab6ee1d",
      biz_content: {
        trans_currency: "ETB",
        total_amount: "1",
        merch_order_id: "35471823648",
        appid: credentials?.merchantAppId,
        merch_code: credentials?.short_code.toString(),
        timeout_express: "120m",
        trade_type: "InApp",
        notify_url: "https://www.baidu.com",
        title: "iphone1",
        business_type: "BuyGoods",
        payee_identifier_type: "04",
        payee_type: "5000",
      },
      method: "payment.preorder",
      sign: "DB9M5w4DrrLL9jNjWeyLEIcyCyow6B4bflCplYw67HI96vaGtJzlSuPF9xskRbC4ecTRBLaMFjWkVSZ5sd9jui/GzgSRkXD6slWDVzSs0Oy0L5I4uoUxVZlF6h3HlyipR9VYF+gq3KMPB2wOzOh3RvV1iqUwmcbifoyIf1/gUIjxqLDH+HVC2iF8fJPw66PQx74cOoWbsNCdOl6HV43b+jLq4FtNNMvXbHtbQkwvDr8oFRbCa8/4B/bvt3oimqOyOEwCP1DFPBnyf+ZfwdekBUt3rCkaSUeMS3dIATnfAh/kVlEQlis9Bl6bNCT3c9BRKE5PJjtmSjc2JWNNYF2KcQ==",
      version: "1.0",
      sign_type: "SHA256WithRSA",
      timestamp: "1535166225",
    };
    cofigData = {
      name,
      url: `/merchant/preOrder`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": credentials?.fabricAppId,
        Authorization: envVariables,
      },
      data: {
        nonce_str: "fcab0d2949e64a69a212aa83eab6ee1d",
        biz_content: {
          trans_currency: "ETB",
          total_amount: "1",
          merch_order_id: "35471823648",
          appid: credentials?.merchantAppId,
          merch_code: credentials?.short_code.toString(),
          timeout_express: "120m",
          trade_type: "InApp",
          notify_url: "https://www.baidu.com",
          title: "iphone1",
          business_type: "BuyGoods",
          payee_identifier_type: "04",
          payee_type: "5000",
        },
        method: "payment.preorder",
        sign: "DB9M5w4DrrLL9jNjWeyLEIcyCyow6B4bflCplYw67HI96vaGtJzlSuPF9xskRbC4ecTRBLaMFjWkVSZ5sd9jui/GzgSRkXD6slWDVzSs0Oy0L5I4uoUxVZlF6h3HlyipR9VYF+gq3KMPB2wOzOh3RvV1iqUwmcbifoyIf1/gUIjxqLDH+HVC2iF8fJPw66PQx74cOoWbsNCdOl6HV43b+jLq4FtNNMvXbHtbQkwvDr8oFRbCa8/4B/bvt3oimqOyOEwCP1DFPBnyf+ZfwdekBUt3rCkaSUeMS3dIATnfAh/kVlEQlis9Bl6bNCT3c9BRKE5PJjtmSjc2JWNNYF2KcQ==",
        version: "1.0",
        sign_type: "SHA256WithRSA",
        timestamp: "1535166225",
      },
    };
  } else if (name === "Checkout") {
    cofigData = {
      name,
      url: `${apiEndPoint}/moke-api/checkout`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": credentials?.fabricAppId,
        Authorization: token,
      },
      data: {
        rawRequest: `appid=${credentials?.merchantAppId}&merch_code=${credentials?.short_code}&nonce_str=12345678901234567890123456789011&prepay_id={{prepay_id}}&sign=ujhjh&sign_type=SHA256WithRSA&timestamp=1234323432`,
      },
    };
  } else if (name === "QueryOrder") {
    cofigData = {
      name,
      url: `${apiEndPoint}/moke-api/queryOrder`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": credentials?.fabricAppId,
        Authorization: token,
      },
      data: {
        timestamp: "1535166225",
        nonce_str: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
        method: "payment.queryorder",
        sign_type: "SHA256WithRSA",
        sign: "iq33P+PJk1A+aArrb9cFQk1zAXTJ8gp3+1fuonRETw26Hbjo1DLy7ANgQsp0DaFOnKCGLCDDTpIohH7kypuOcxjWrkjdyULNl2rIQEseTKugFp4UozwmXXO8Bfv/eEP//S0IEUlq7Y0wrUQU82g+A8JwvZPIU5furEadJx/Bj17Pbsjp4oeteS0fxORH80JUNeRKVhDRYl6bKyAX7V8mZRZhGDFLrdYc/rHiSg9+nVh5v5vmtzJ9v6zhVEJkLB8G5AG9KvD4Mf1PXmsszh40JIyft5X2Abc54cIDgfmX8cYIPA6fE6ftHJcAM+Gk74YehMIvQw3d75rZX/k17JdKZQ==",
        version: "1.0",
        biz_content: {
          appid: credentials?.merchantAppId,
          merch_code: credentials?.short_code,
          merch_order_id: credentials?.short_code,
        },
      },
    };
  }

  return cofigData;
};

export default serviceUtility;
