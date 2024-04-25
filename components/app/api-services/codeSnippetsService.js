/** @format */

import _ from "lodash";
import * as _env from "./httpConstant";
import axios from "@lib/configs/axios-instance";

const urlEndpoints = _env.API_END_POINT;

const codes = [
  // H5 INTEGRATION START
  {
    id: 1,
    name: "Web Payment (H5) integration",
    value: [
      {
        id: 1,
        name: "ApplyFabricToken",
        description: `The fabric token is the first phase in the payment process, which you will provide in order to obtain a token from our server and submit an application to create an order.`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
import json
import urllib3

urllib3.disable_warnings()
class ApplyFabricTokenService:
    BASE_URL = None;
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    def __init__(self,BASE_URL,fabricAppId,appSecret,merchantAppId) :
        self.BASE_URL = BASE_URL
        self.fabricAppId = fabricAppId
        self.appSecret = appSecret
        self.merchantAppId = merchantAppId
    
    def applyFabricToken(self):
        headers = {
        "Content-Type": "application/json",
        "X-APP-Key": self.fabricAppId
        }
        payload = {
              "appSecret": self.appSecret
        }
        data=json.dumps(payload)
        authToken = requests.post(url=self.BASE_URL+"/payment/v1/token",headers=headers,data=data,verify=False)
        return authToken.json()`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const config = require("../config/config");
var request = require("request");

function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;`,
          },

          {
            id: 3,
            name: "C#",
            value: `H5 -> ApplyFabricToken -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `H5 -> ApplyFabricToken -> JSON Goes Here!`,
          },
        ],
      },

      {
        id: 2,
        name: "CreateOrder",
        description: `CreateOrder is the second process on payment integration, it create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        print(rawRequest)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },
          {
            id: 2,
            name: "Node JS",
            value: `var request = require("request");
const tools = require("../utils/tools");
const config = require("../config/config");
const applyFabricToken = require("./applyFabricTokenService");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  res.send(rawRequest);
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.google.com",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },
          {
            id: 3,
            name: "C#",
            value: `H5 -> CreateOrder -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `H5 -> CreateOrder -> JSON Goes Here!`,
          },
        ],
      },

      {
        id: 3,
        name: "Checkout",
        description: `Checkout is the third process on payment integration, after create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },
          {
            id: 2,
            name: "Node JS",
            value: `var request = require("request");
const tools = require("../utils/tools");
const config = require("../config/config");
const applyFabricToken = require("./applyFabricTokenService");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  res.send(rawRequest);
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.google.com",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },
          {
            id: 3,
            name: "C#",
            value: `H5 -> CreateOrder -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `H5 -> CreateOrder -> JSON Goes Here!`,
          },
        ],
      },

      {
        id: 4,
        name: "QueryOrder",
        description: `QueryOrder is the forth process on payment integration, after create a transaction if you are not redeived notification, you can request callback with this interface`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `H5 -> QueryOrder -> Python Goes Here!`,
          },
          {
            id: 2,
            name: "Node JS",
            value: `H5 -> QueryOrder -> JS Goes Here!`,
          },
          {
            id: 3,
            name: "C#",
            value: `H5 -> QueryOrder -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `H5 -> QueryOrder -> JSON Goes Here!`,
          },
        ],
      },
    ],
  },
  // H5 INTEGRATION END

  // MINI APP INTEGRATION START

  {
    id: 2,
    name: "Native (Mini App) integration",
    value: [
      {
        id: 1,
        name: "ApplyFabricToken",
        description: ` ApplyFabricToken is the initial step in the payment integration process where a token is obtained and added to a request for creating an order.`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
import json
import urllib3

urllib3.disable_warnings()
class ApplyFabricTokenService:
    BASE_URL = None;
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    def __init__(self,BASE_URL,fabricAppId,appSecret,merchantAppId) :
        self.BASE_URL = BASE_URL
        self.fabricAppId = fabricAppId
        self.appSecret = appSecret
        self.merchantAppId = merchantAppId
    
    def applyFabricToken(self):
        headers = {
        "Content-Type": "application/json",
        "X-APP-Key": self.fabricAppId
        }
        payload = {
              "appSecret": self.appSecret
        }
        data=json.dumps(payload)
        authToken = requests.post(url=self.BASE_URL+"/payment/v1/token",headers=headers,data=data,verify=False)
        print(authToken.json())
        return authToken.json()`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const config = require("../config/config");
var request = require("request");

function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;
`,
          },

          {
            id: 3,
            name: "C#",
            value: `Macle -> ApplyFabricToken -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Macle -> ApplyFabricToken -> JSON Goes Here!`,
          },
        ],
      },
      {
        id: 2,
        name: "CreateOrder",
        description: `CreateOrder is the second process on payment integration, it create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        print(rawRequest)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `var request = require("request");
const tools = require("../utils/tools");
const config = require("../config/config");
const applyFabricToken = require("./applyFabricTokenService");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  res.send(rawRequest);
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };
    request(options, (error, response) => {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.google.com",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}
`,
          },

          {
            id: 3,
            name: "C#",
            value: `Macle -> CreateOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Macle -> CreateOrder -> JSON`,
          },
        ],
      },
      {
        id: 3,
        name: "Checkout",
        description: `Checkout is the third process on payment integration, after create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `Macle -> Checkout -> Python Goes Here!`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `Macle -> Checkout -> JS Goes Here!`,
          },

          {
            id: 3,
            name: "C#",
            value: `Macle -> Checkout -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Macle -> Checkout -> JSON Goes Here!`,
          },
        ],
      },

      {
        id: 4,
        name: "QueryOrder",
        description: `QueryOrder is the forth process on payment integration, after create a transaction if you are not redeived notification, you can request callback with this interface`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `Macle -> QueryOrder -> Python Goes Here!`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `Macle -> QueryOrder -> JS Goes Here!`,
          },

          {
            id: 3,
            name: "C#",
            value: `Macle -> QueryOrder -> C# Goes Here!`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Macle -> QueryOrder -> JSON Goes Here!`,
          },
        ],
      },
    ],
  },

  // MINI APP INTEGRATION END

  // C2B CHECKOUT START
  {
    id: 3,
    name: "Cusetomer to Business WebCheckout",
    value: [
      {
        id: 1,
        name: "ApplyFabricToken",
        description: ` ApplyFabricToken is the initial step in the payment integration process where a token is obtained and added to a request for creating an order.`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
import json
import urllib3

urllib3.disable_warnings()
class ApplyFabricTokenService:
    BASE_URL = None;
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    def __init__(self,BASE_URL,fabricAppId,appSecret,merchantAppId) :
        self.BASE_URL = BASE_URL
        self.fabricAppId = fabricAppId
        self.appSecret = appSecret
        self.merchantAppId = merchantAppId
    
    def applyFabricToken(self):
        headers = {
        "Content-Type": "application/json",
        "X-APP-Key": self.fabricAppId
        }
        payload = {
              "appSecret": self.appSecret
        }
        data=json.dumps(payload)
        authToken = requests.post(url=self.BASE_URL+"/payment/v1/token",headers=headers,data=data,verify=False)
        return authToken.json()`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const config = require("../config/config");
var request = require("request");

function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;
`,
          },

          {
            id: 3,
            name: "C#",
            value: `C2B -> ApplyFabricToken -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `C2B -> ApplyFabricToken -> JSON`,
          },
        ],
      },
      {
        id: 2,
        name: "CreateOrder",
        description: `CreateOrder is the second process on payment integration, it create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
var request = require("request");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  // console.log("Assembled URL");
  res.send(config.webBaseUrl + rawRequest + "&version=1.0&trade_type=Checkout");
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    redirect_url: "https://www.bing.com/",
    callback_info: "From web",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `C2B -> CreateOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `C2B -> CreateOrder -> JSON`,
          },
        ],
      },
      {
        id: 3,
        name: "Checkout",
        description: `Checkout is the third process on payment integration, after create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
var request = require("request");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);
  // console.log("Assembled URL");
  res.send(config.webBaseUrl + rawRequest + "&version=1.0&trade_type=Checkout");
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};

function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "Checkout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    redirect_url: "https://www.bing.com/",
    callback_info: "From web",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `C2B -> Checkout -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `C2B -> Checkout -> JSON`,
          },
        ],
      },

      {
        id: 4,
        name: "QueryOrder",
        description: `QueryOrder is the forth process on payment integration, after create a transaction if you are not redeived notification, you can request callback with this interface`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `C2B -> QueryOrder -> Python`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `C2B -> QueryOrder -> JS`,
          },

          {
            id: 3,
            name: "C#",
            value: `C2B -> QueryOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `C2B -> QueryOrder -> JSON`,
          },
        ],
      },
    ],
  },
  // C2B CHECKOUT END

  // B2B CHECKOUT START
  {
    id: 4,
    name: "Business to Business WebCheckout",
    value: [
      {
        id: 1,
        name: "ApplyFabricToken",
        description: `ApplyFabricToken is the initial step in the payment integration process where a token is obtained and added to a request for creating an order.`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
import json
import urllib3

urllib3.disable_warnings()
class ApplyFabricTokenService:
    BASE_URL = None;
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    def __init__(self,BASE_URL,fabricAppId,appSecret,merchantAppId) :
        self.BASE_URL = BASE_URL
        self.fabricAppId = fabricAppId
        self.appSecret = appSecret
        self.merchantAppId = merchantAppId
    
    def applyFabricToken(self):
        headers = {
        "Content-Type": "application/json",
        "X-APP-Key": self.fabricAppId
        }
        payload = {
              "appSecret": self.appSecret
        }
        data=json.dumps(payload)
        authToken = requests.post(url=self.BASE_URL+"/payment/v1/token",headers=headers,data=data,verify=False)
        return authToken.json()`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const config = require("../config/config");
var request = require("request");

function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    };
    request(options, function (error, response) {
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;
`,
          },

          {
            id: 3,
            name: "C#",
            value: `B2B -> ApplyFabricToken -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `B2B -> ApplyFabricToken -> JSON`,
          },
        ],
      },
      {
        id: 2,
        name: "CreateOrder",
        description: `CreateOrder is the second process on payment integration, it create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        print(rawRequest)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `var request = require("request");
const tools = require("../utils/tools");
const config = require("../config/config");
const applyFabricToken = require("./applyFabricTokenService");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);

  console.log(
    config.webBaseUrl +
      rawRequest +
      "&version=1.0&trade_type=WebCheckout&use_notice_key=false&language=en"
  );
  res.send(
    config.webBaseUrl +
      rawRequest +
      "&version=1.0&trade_type=WebCheckout&use_notice_key=false&language=en"
  );
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};
//checked
function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  //checked
  let biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "WebCheckout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "TransferToOtherOrg",
    redirect_url: "https://www.baidu.com",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `B2B -> CreateOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `B2B -> CreateOrder -> JSON`,
          },
        ],
      },
      {
        id: 3,
        name: "Checkout",
        description: `Checkout is the third process on payment integration, after create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `B2B -> Checkout -> Python`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `var request = require("request");
const tools = require("../utils/tools");
const config = require("../config/config");
const applyFabricToken = require("./applyFabricTokenService");

exports.createOrder = async (req, res) => {
  let title = req.body.title;
  let amount = req.body.amount;
  let applyFabricTokenResult = await applyFabricToken();
  let fabricToken = applyFabricTokenResult.token;
  let createOrderResult = await exports.requestCreateOrder(
    fabricToken,
    title,
    amount
  );
  let prepayId = createOrderResult.biz_content.prepay_id;
  let rawRequest = createRawRequest(prepayId);

  console.log(
    config.webBaseUrl +
      rawRequest +
      "&version=1.0&trade_type=WebCheckout&use_notice_key=false&language=en"
  );
  res.send(
    config.webBaseUrl +
      rawRequest +
      "&version=1.0&trade_type=WebCheckout&use_notice_key=false&language=en"
  );
};

exports.requestCreateOrder = async (fabricToken, title, amount) => {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
};
//checked
function createRequestObject(title, amount) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  //checked
  let biz = {
    notify_url: "https://www.google.com",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId(),
    trade_type: "WebCheckout",
    title: title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "TransferToOtherOrg",
    redirect_url: "https://www.baidu.com",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log(req);
  return req;
}

function createMerchantOrderId() {
  return new Date().getTime() + "";
}

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `B2B -> Checkout -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `B2B -> Checkout -> JSON`,
          },
        ],
      },

      {
        id: 4,
        name: "QueryOrder",
        description: `QueryOrder is the forth process on payment integration, after create a transaction if you are not redeived notification, you can request callback with this interface`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `B2B -> QueryOrder -> Python`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `B2B -> QueryOrder -> JS`,
          },

          {
            id: 3,
            name: "C#",
            value: `B2B -> QueryOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `B2B -> QueryOrder -> JSON`,
          },
        ],
      },
    ],
  },
  // B2B CHECKOUT END

  // MANDET CHECKOUT START
  {
    id: 5,
    name: "Subscription Payment Integration",
    value: [
      {
        id: 1,
        name: "ApplyFabricToken",
        description: `ApplyFabricToken is the initial step in the payment integration process where a token is obtained and added to a request for creating an order.`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
import json
import urllib3

urllib3.disable_warnings()
class ApplyFabricTokenService:
    BASE_URL = None;
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    def __init__(self,BASE_URL,fabricAppId,appSecret,merchantAppId) :
        self.BASE_URL = BASE_URL
        self.fabricAppId = fabricAppId
        self.appSecret = appSecret
        self.merchantAppId = merchantAppId
    
    def applyFabricToken(self):
        headers = {
        "Content-Type": "application/json",
        "X-APP-Key": self.fabricAppId
        }
        payload = {
              "appSecret": self.appSecret
        }
        data=json.dumps(payload)
        authToken = requests.post(url=self.BASE_URL+"/payment/v1/token",headers=headers,data=data,verify=False)
        return authToken.json()`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const config = require("../config/config");
var request = require("request");

// Apply fabric token
function applyFabricToken() {
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.appSecret,
      }),
    };
    console.log(options);
    request(options, function (error, response) {
      if (error) throw new Error(error);
      let result = JSON.parse(response.body);
      resolve(result);
    });
  });
}

module.exports = applyFabricToken;
`,
          },

          {
            id: 3,
            name: "C#",
            value: `Schedule -> ApplyFabricToken -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Schedule -> ApplyFabricToken -> JSON`,
          },
        ],
      },
      {
        id: 2,
        name: "CreateOrder",
        description: `CreateOrder is the second process on payment integration, it create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        print(rawRequest)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
var request = require("request");

exports.createMandetOrder = async (req, res) => {
    let title = req.body.title;
    let amount = req.body.amount;
    let mandateTemplateId = req.body.mandateTemplateId
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;
    const mctContractNo = generateUniqueId()
    let createOrderResult = await exports.requestCreateOrder(
        fabricToken,
        title,
        amount,
        mandateTemplateId,
        mctContractNo
    );
    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest = createRawRequest(prepayId);
    res.status(200).json({ rawRequest, mctContractNo });
};

exports.requestCreateOrder = async (fabricToken, title, amount, mandateTemplateId, mctContractNo) => {
    return new Promise((resolve) => {
        let reqObject = createRequestObject(title, amount, mandateTemplateId, mctContractNo);
        var options = {
            method: "POST",
            url: config.baseUrl + "/payment/v1/merchant/preOrder",
            headers: {
                "Content-Type": "application/json",
                "X-APP-Key": config.fabricAppId,
                Authorization: fabricToken,
            },
            rejectUnauthorized: false, //add when working with https sites
            requestCert: false, //add when working with https sites
            agent: false, //add when working with https sites
            body: JSON.stringify(reqObject),
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            let result = JSON.parse(response.body);
            resolve(result);
        });
    });
};

function createRequestObject(title, amount, mandateTemplateId, mctContractNo) {
    let req = {
        timestamp: tools.createTimeStamp(),
        nonce_str: tools.createNonceStr(),
        method: "payment.preorder",
        version: "1.0",
    };
    let biz = {
        notify_url: "https://developer.ethiotelecom.et/serviceapi/v2/notify",
        trade_type: "InApp",
        appid: config.merchantAppId,
        merch_code: config.merchantCode,
        merch_order_id: createMerchantOrderId(),
        title: title,
        total_amount: amount,
        trans_currency: "ETB",
        timeout_express: "120m",
        payee_identifier: "220311",
        payee_identifier_type: "04",
        payee_type: "5000",
        mandate_data: {
            mctContractNo: mctContractNo,
            mandateTemplateId: mandateTemplateId,
            executeTime: "2023-08-04"
        },
        redirect_url: "https://https://developer.ethiotelecom.et/api/v1/notify",
    };
    req.biz_content = biz;
    req.sign = tools.signRequestObject(req);
    req.sign_type = "SHA256WithRSA";
    return req;
}

function createMerchantOrderId() {
    return new Date().getTime() + "";
}

function generateUniqueId() {
    const random = Math.random().toString().substring(2); // Get random number as a string
    return random;
}

function createRawRequest(prepayId) {
    let map = {
        appid: config.merchantAppId,
        merch_code: config.merchantCode,
        nonce_str: tools.createNonceStr(),
        prepay_id: prepayId,
        timestamp: tools.createTimeStamp(),
    };
    let sign = tools.signRequestObject(map);
    // order by ascii in array
    let rawRequest = [
        "appid=" + map.appid,
        "merch_code=" + map.merch_code,
        "nonce_str=" + map.nonce_str,
        "prepay_id=" + map.prepay_id,
        "timestamp=" + map.timestamp,
        "sign=" + sign,
        "sign_type=SHA256WithRSA",
    ].join("&");
    return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `Schedule -> CreateOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Schedule -> CreateOrder -> JSON`,
          },
        ],
      },
      {
        id: 3,
        name: "Checkout",
        description: `Checkout is the third process on payment integration, after create a transaction and ready for payment process`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `import requests
from service import applyFabricTokenService
import json
from utils import tools 
from config import env
from utils import tools
class CreateOrderService:
    req = None;
    BASE_URL = None
    fabricAppId = None
    appSecret = None
    merchantAppId = None
    merchantCode = None
    notify_path = None
    
    def __init__(self,req,BASE_URL,fabricAppId,appSecret,merchantAppId,merchantCode):
        self.req=req
        self.BASE_URL=BASE_URL
        self.fabricAppId=fabricAppId
        self.appSecret=appSecret
        self.merchantAppId=merchantAppId
        self.merchantCode=merchantCode
        self.notify_path = "http://www.google.com"
    # @Purpose: Creating Order
    #  *
    #  * @Param: no parameters it takes from the constructor
    #  * @Return: rawRequest|String
    def createOrder(self):
        title = self.req["title"];
        amount = self.req["amount"];
        applyFabricTokenResult = applyFabricTokenService.ApplyFabricTokenService(self.BASE_URL,self.fabricAppId,self.appSecret,self.merchantAppId)
        result=applyFabricTokenResult.applyFabricToken()
        fabricToken = result["token"]
        createOrderResult = self.requestCreateOrder(fabricToken,title,amount)
        prepayId = createOrderResult["biz_content"]["prepay_id"]
        rawRequest = self.createRawRequest(prepayId)
        print(rawRequest)
        return rawRequest
    #  * @Purpose: Requests CreateOrder
    #  *
    #  * @Param: fabricToken|String title|string amount|string
    #  * @Return: String | Boolean
    def requestCreateOrder(self,fabricToken,title,amount):
        headers = {
            "Content-Type":"application/json",
            "X-APP-Key":self.fabricAppId,
            "Authorization":fabricToken
        }
        # Body parameters
        payload = self.createRequestObject(title,amount)
        server_output = requests.post(url=self.BASE_URL+"/payment/v1/merchant/preOrder",headers=headers,data=payload,verify=False)
        return server_output.json()
    #  * @Purpose: Creating Request Object
    #  *
    #  * @Param: title|String and amount|String
    #  * @Return: Json encoded string
    def createRequestObject(self,title,amount):
        req = {
            "nonce_str":tools.createNonceStr(),
            "method":"payment.preorder",
            "timestamp":tools.createTimeStamp(),
            "version":"1.0",
            "biz_content":{},   
        }
        biz={
            "notify_url":self.notify_path,
            "business_type":"BuyGoods",
            "trade_type":"InApp",
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "merch_order_id":tools.createMerchantOrderId(),
            "title":title,
            "total_amount":amount,
            "trans_currency":"ETB",
            "timeout_express":"120m",
            "payee_identifier":"220311",
            "payee_identifier_type":"04",
            "payee_type":"5000"
        }
        req["biz_content"] = biz
        req["sign_type"] = "SHA256withRSA"
        sign = tools.sign(req)
        req["sign"] = sign
        print(json.dumps(req))
        return json.dumps(req)
    #  * @Purpose: Create a rawRequest string for H5 page to start pay
    #  *
    #  * @Param: prepayId returned from the createRequestObject
    #  * @Return: rawRequest|string
    def createRawRequest(self,prepayId):
        maps={
            "appid":self.merchantAppId,
            "merch_code":self.merchantCode,
            "nonce_str":tools.createNonceStr(),
            "prepay_id":prepayId,
            "timestamp":tools.createTimeStamp(),
            "sign_type":"SHA256WithRSA" 
        }
        rawRequest=""
        for key in maps:
            value = maps[key]
            rawRequest = rawRequest + key + "=" + value + "&"
        sign = tools.sign(maps)
        rawRequest = rawRequest+"sign="+sign
        return rawRequest`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const config = require("../config/config");
var request = require("request");

exports.createMandetOrder = async (req, res) => {
    let title = req.body.title;
    let amount = req.body.amount;
    let mandateTemplateId = req.body.mandateTemplateId
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;
    const mctContractNo = generateUniqueId()
    let createOrderResult = await exports.requestCreateOrder(
        fabricToken,
        title,
        amount,
        mandateTemplateId,
        mctContractNo
    );
    let prepayId = createOrderResult.biz_content.prepay_id;
    let rawRequest = createRawRequest(prepayId);
    res.status(200).json({ rawRequest, mctContractNo });
};

exports.requestCreateOrder = async (fabricToken, title, amount, mandateTemplateId, mctContractNo) => {
    return new Promise((resolve) => {
        let reqObject = createRequestObject(title, amount, mandateTemplateId, mctContractNo);
        var options = {
            method: "POST",
            url: config.baseUrl + "/payment/v1/merchant/preOrder",
            headers: {
                "Content-Type": "application/json",
                "X-APP-Key": config.fabricAppId,
                Authorization: fabricToken,
            },
            rejectUnauthorized: false, //add when working with https sites
            requestCert: false, //add when working with https sites
            agent: false, //add when working with https sites
            body: JSON.stringify(reqObject),
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            let result = JSON.parse(response.body);
            resolve(result);
        });
    });
};

function createRequestObject(title, amount, mandateTemplateId, mctContractNo) {
    let req = {
        timestamp: tools.createTimeStamp(),
        nonce_str: tools.createNonceStr(),
        method: "payment.preorder",
        version: "1.0",
    };
    let biz = {
        notify_url: "https://developer.ethiotelecom.et/serviceapi/v2/notify",
        trade_type: "InApp",
        appid: config.merchantAppId,
        merch_code: config.merchantCode,
        merch_order_id: createMerchantOrderId(),
        title: title,
        total_amount: amount,
        trans_currency: "ETB",
        timeout_express: "120m",
        payee_identifier: "220311",
        payee_identifier_type: "04",
        payee_type: "5000",
        mandate_data: {
            mctContractNo: mctContractNo,
            mandateTemplateId: mandateTemplateId,
            executeTime: "2023-08-04"
        },
        redirect_url: "https://https://developer.ethiotelecom.et/api/v1/notify",
    };
    req.biz_content = biz;
    req.sign = tools.signRequestObject(req);
    req.sign_type = "SHA256WithRSA";
    return req;
}

function createMerchantOrderId() {
    return new Date().getTime() + "";
}

function generateUniqueId() {
    const random = Math.random().toString().substring(2); // Get random number as a string
    return random;
}

function createRawRequest(prepayId) {
    let map = {
        appid: config.merchantAppId,
        merch_code: config.merchantCode,
        nonce_str: tools.createNonceStr(),
        prepay_id: prepayId,
        timestamp: tools.createTimeStamp(),
    };
    let sign = tools.signRequestObject(map);
    // order by ascii in array
    let rawRequest = [
        "appid=" + map.appid,
        "merch_code=" + map.merch_code,
        "nonce_str=" + map.nonce_str,
        "prepay_id=" + map.prepay_id,
        "timestamp=" + map.timestamp,
        "sign=" + sign,
        "sign_type=SHA256WithRSA",
    ].join("&");
    return rawRequest;
}`,
          },

          {
            id: 3,
            name: "C#",
            value: `Schedule -> Checkout -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Schedule -> Checkout -> JSON`,
          },
        ],
      },

      {
        id: 4,
        name: "QueryOrder",
        description: `QueryOrder is the forth process on payment integration, after create a transaction if you are not redeived notification, you can request callback with this interface`,
        value: [
          {
            id: 1,
            name: "Python",
            value: `Schedule -> QueryOrder -> Python`,
          },

          {
            id: 2,
            name: "Node JS",
            value: `const applyFabricToken = require("./applyFabricTokenService");
const tools = require("../utils/tools");
const tools2 = require("../utils/tools-2")
const config = require("../config/config");
var request = require("request");

exports.queryMandet = async (req, res) => {
    let merch_contract_no = req.body.merch_contract_no;
    let applyFabricTokenResult = await applyFabricToken();
    let fabricToken = applyFabricTokenResult.token;

    let createOrderResult = await exports.requestCreateOrder(
        fabricToken,
        merch_contract_no
    );
    res.send(createOrderResult);
};

exports.requestCreateOrder = async (fabricToken, merch_contract_no) => {
    return new Promise((resolve) => {
        let reqObject = createRequestObject(merch_contract_no);
        var options = {
            method: "POST",
            url: config.baseUrl + "/payment/v1/mandates/query",
            headers: {
                "Content-Type": "application/json",
                "X-APP-Key": config.fabricAppId,
                Authorization: fabricToken,
            },
            rejectUnauthorized: false, //add when working with https sites
            requestCert: false, //add when working with https sites
            agent: false, //add when working with https sites
            body: JSON.stringify(reqObject),
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            let result = JSON.parse(response.body);
            resolve(result);
        });
    });
};

function createRequestObject(merch_contract_no) {
    let req = {
        timestamp: tools.createTimeStamp(),
        nonce_str: tools.createNonceStr(),
        method: "payment.queryMandate",
        version: "1.0",
    };
    let biz = {
        appid: config.merchantAppId,
        merch_short_code: config.merchantCode,
        merch_contract_no: merch_contract_no
    };
    req.biz_content = biz;
    req.sign = tools2.signRequestObject(req);
    req.sign_type = "SHA256WithRSA";
    return req;
}
`,
          },

          {
            id: 3,
            name: "C#",
            value: `Schedule -> QueryOrder -> C#`,
          },

          {
            id: 4,
            name: "PHP",
            value: `Schedule -> QueryOrder -> JSON`,
          },
        ],
      },
    ],
  },
  // MANDET CHECKOUT END
];

export function getCodeSnippets() {
  return codes;
}

export function getCodeSnippet(topic_id, supTopicId) {
  const filteredPaymentMethod = _.find(codes, (code) => {
    return code.id === topic_id;
  });

  const codeSnippets = _.find(filteredPaymentMethod?.value, (f) => {
    return f.id === supTopicId;
  });

  return {
    filteredPaymentMethod,
    codeSnippets,
  };
}

export function getCodeSnippetByPayment(name, paymentMethod, codeId) {
  if (paymentMethod === null) paymentMethod = "Web Payment (H5) integration";

  const newCode = _.filter(codes, (code) => {
    return code.name === paymentMethod;
  });
  let updateDode = _.find(newCode[0]?.value, (n) => {
    return n?.id === codeId;
  });

  const logs = updateDode?.value.filter((f) => f.name === name);
  console.log({ newCode });
  return logs[0]?.value;
}

export async function saveCodeResponse({ data, name, headers, url }) {
  // console.log({ data, name, headers, url });
  // const {data:respnse} = await axios({
  //   method: 'post',
  //   headers,
  //   url,
  //   data
  // });

  // return await respnse
  if (name === "ApplyFabricToken") {
    return {
      token: "Bearer 94cc42bee412696d754508c06ca1db20",
      effectiveDate: Date.now().toString(),
      expirationDate: (Date.now() + 300).toString(),
    };
  } else if (name === "CreateOrder") {
    return {
      result: "SUCCESS",
      code: "0",
      msg: "Success",
      nonce_str:
        "DB9M5w4DrrLL9jNjWeyLEIcyCyow6B4bflCplYw67HI96vaGtJzlSuPF9xskRbC4ecTRBLaMFjWkVSZ5sd9jui/GzgSRkXD6slWDVzSs0Oy0L5I4uoUxVZlF6h3HlyipR9VYF+gq3KMPB2wOzOh3RvV1iqUwmcbifoyIf1/gUIjxqLDH+HVC2iF8fJPw66PQx74cOoWbsNCdOl6HV43b+jLq4FtNNMvXbHtbQkwvDr8oFRbCa8/4B/bvt3oimqOyOEwCP1DFPBnyf+ZfwdekBUt3rCkaSUeMS3dIATnfAh/kVlEQlis9Bl6bNCT3c9BRKE5PJjtmSjc2JWNNYF2KcQ==",
      sign: "BC4EE8D710BAC6A7E33DE4511A1CE77230EF",
      sign_type: "SHA256WithRSA",
      biz_content: {
        merch_order_id: "201907151435001",
        prepay_id: "007a6bd3175cdb3c658545a4f3f8q87c87483",
      },
    };
  } else if (condition) {
    return {
      rawRequest: "",
    };
  }
}
