import { getCodeSnippetByPayment } from "@app/api-services/codeSnippetsService";

export const config = (name, credentials) => {
  let cofigData = "";

  if (name === "JS") {
    cofigData = `module.exports = {
      baseUrl: 'https://196.188.120.3:38443/apiaccess/payment/gateway',
      fabricAppId: ${JSON.stringify(credentials.fabricAppId)},
      appSecret: ${credentials.fabricAppSercet},
      merchantAppId: ${credentials.merchantAppId},
      merchantCode: ${credentials.short_code},
      privateKey: ${credentials.privateKey}`;
  } else if (name === "Python") {
    cofigData = `ENV_VARIABLES = {
        "baseUrl": "https://196.188.120.3:38443/apiaccess/payment/gateway",
        "fabricAppId": ${credentials.fabricAppId},
        "appSecret": ${credentials.fabricAppSercet},
        "merchantAppId":  ${credentials.merchantAppId},
        "merchantCode":${credentials.short_code},
        "privateKey":${credentials.privateKey}
    }`;
  } else if (name === "C#") {
    cofigData = `ENV_VARIABLES = {
        "baseUrl": "https://196.188.120.3:38443/apiaccess/payment/gateway",
        "fabricAppId": ${credentials.fabricAppId},
        "appSecret": ${credentials.fabricAppSercet},
        "merchantAppId":  ${credentials.merchantAppId},
        "merchantCode":${credentials.short_code},
        "privateKey":${credentials.privateKey}
    }`;
  } else {
    cofigData = `ENV_VARIABLES = {
        "baseUrl": "https://196.188.120.3:38443/apiaccess/payment/gateway",
        "fabricAppId": ${credentials.fabricAppId},
        "appSecret": ${credentials.fabricAppSercet},
        "merchantAppId":  ${credentials.merchantAppId},
        "merchantCode":${credentials.short_code},
        "privateKey":${credentials.privateKey}
    }`;
  }
  return cofigData;
};

export const fabricToken = (name, paymentMethod, codeId) => {
  let data = "";
  if (name === "JS") {
    const JSData = getCodeSnippetByPayment("JS", paymentMethod, codeId);
    data = `${JSData}`;
  } else if (name === "Python") {
    const PythonData = getCodeSnippetByPayment("Python", paymentMethod, codeId);
    data = `${PythonData}`;
  } else if (name === "C#") {
    const CData = getCodeSnippetByPayment("C#", paymentMethod, codeId);
    data = `${CData}`;
  } else {
    const JSData = getCodeSnippetByPayment("JS", paymentMethod, codeId);
    data = `${JSData}`;
  }
  return Data;
};

export const createOrder = (name, paymentMethod, codeId) => {
  let Data = "";

  if (name === "JS") {
    const JSData = getCodeSnippetByPayment("JS", paymentMethod, 2);
    Data = `${JSData}`;
  } else if (name === "Python") {
    const JSData = getCodeSnippetByPayment("Python", paymentMethod, 2);
    Data = `${JSData}`;
  } else if (name === "C#") {
    const JSData = getCodeSnippetByPayment("C#", paymentMethod, 2);
    Data = `${JSData}`;
  } else {
    const JSData = getCodeSnippetByPayment("JS", paymentMethod, 2);
    Data = `${JSData}`;
  }
  return Data;
};

export const utility = (name, credentials) => {
  let Data = "";

  if (name === "JS") {
    Data = `const crypto = require("crypto");
const config = require("../config/config");
const pmlib = require("./sign-util-lib");

// Fields not participating in signature
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

function signRequestObject(requestObject) {
  let fields = [];
  let fieldMap = {};
  for (let key in requestObject) {
    if (excludeFields.indexOf(key) >= 0) {
      continue;
    }
    fields.push(key);
    fieldMap[key] = requestObject[key];
  }
  // the fields in "biz_content" must Participating signature
  if (requestObject.biz_content) {
    let biz = requestObject.biz_content;
    for (let key in biz) {
      if (excludeFields.indexOf(key) >= 0) {
        continue;
      }
      fields.push(key);
      fieldMap[key] = biz[key];
    }
  }
  // sort by ascii
  fields.sort();

  let signStrList = [];
  for (let i = 0; i < fields.length; i++) {
    let key = fields[i];
    signStrList.push(key + "=" + fieldMap[key]);
  }
  let signOriginStr = signStrList.join("&");
  //console.log("signOriginStr", signOriginStr);
  return signString(signOriginStr, config.privateKey);
}

let signString = (text, privateKey) => {
  const sha256withrsa = new pmlib.rs.KJUR.crypto.Signature({
    alg: "SHA256withRSAandMGF1",
  });
  sha256withrsa.init(privateKey);
  sha256withrsa.updateString(text);
  const sign = pmlib.rs.hextob64(sha256withrsa.sign());
  return sign;
};

function createTimeStamp() {
  return Math.round(new Date() / 1000) + "";
}

// create a 32 length random string
function createNonceStr() {
  let chars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let str = "";
  for (let i = 0; i < 32; i++) {
    let index = parseInt(Math.random() * 35);
    str += chars[index];
  }
  return str;
}

module.exports = {
  signString: signString,
  signRequestObject: signRequestObject,
  createTimeStamp: createTimeStamp,
  createNonceStr: createNonceStr,
};
`;
  } else if (name === "Python") {
    Data = `import uuid
import time
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256
from Crypto.Signature import pss
from base64 import b64decode, b64encode
from config import env

def sign(request):
    privateKey = env.ENV_VARIABLES["privateKey"]
    exclude_fields = ["sign", "sign_type", "header", "refund_info", "openType", "raw_request"]
    join=[]
    for key in request:
        if key in exclude_fields:
            continue
        if key == "biz_content":
            biz_content = request["biz_content"]
            for k in biz_content:
                join.append(k+"="+biz_content[k])
        else:
            join.append(key+"="+request[key])
    join.sort()
    separator = '&'
    inputString = str(separator.join(join))
    return SignWithRSA(inputString,privateKey,"SHA256withRSA")
# """ Generate signature
#       :param data: the key=value&key2=value2 format signature source string
#       :param key: Sign key
#       :param sign_type: sign type SHA256withRSA or HmacSHA256
#       :return: sign string
# """
def SignWithRSA(data,key, sign_type="SHA256withRSA"):
    if sign_type == "SHA256withRSA":
        key_bytes = b64decode(key.encode("utf-8"))
        key = RSA.importKey(key_bytes)
        digest = SHA256.new()
        digest.update(data.encode("utf-8"))
        signer = pss.new(key)
        signature = signer.sign(digest)
        return b64encode(signature).decode("utf-8")
    else:
        return "Only allowed to the type SHA256withRSA hash"

#  * @Purpose: Creating a new merchantOrderId
#  *
#  * @Param: no parameters
#  * @Return: returns a string format of time (UTC)
def createMerchantOrderId():
    return str(int(time.time()))

def createTimeStamp():
    return str(int(time.time()))

def createNonceStr():
    return str(uuid.uuid1())`;
  } else if (name === "C#") {
  } else {
  }
  return Data;
};

export const app = (name, credentials) => {
  let Data = "";

  if (name === "JS") {
    Data = `const express = require("express");
const bodyParser = require("body-parser");
var app = express();
const { signString } = require("./utils/tools");
const authToken = require("./service/authTokenService");
const createOrder = require("./service/createOrderService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// allow cross-origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

app.post("/auth/token", function (req, res) {
  authToken(req, res);
});

app.post("/create/order", function (req, res) {
  createOrder.createOrder(req, res);
});

// start server
let serverPort = 8081;
var app = app.listen(serverPort, function () {
  //console.log("server started, port:" + serverPort);
});
`;
  } else if (name === "Python") {
    Data = `from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
import json
from config import env
from service import createOrderService
from service import applyFabricTokenService
enviroment = env.ENV_VARIABLES
token = applyFabricTokenService.ApplyFabricTokenService(enviroment["baseUrl"],enviroment["fabricAppId"],enviroment["appSecret"],enviroment["merchantAppId"])
class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.send_response(200)
            self.send_header("Content-type", "application/json"),
            self.send_header("Access-Control-Allow-Origin"," *"),
            self.send_header("Access-Control-Allow-Methods", "*"),
            self.send_header("Access-Control-Allow-Methods", "PUT, GET,DELETE, POST,OPTIONS"),
            self.send_header("Access-Control-Allow-Headers"," Origin, X-Requested-With, Content-Type, Accept")
            self.end_headers()
            self.wfile.write(b'WELCOME TO API SERVER!')
        else:
            self.send_error(404)
    def do_POST(self):
        if self.path == "/create/order":
            self
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            requestParam= json.loads(body.decode('utf-8'))
            self.send_response(200)
            self.send_header("Content-type", "application/json"),
            self.send_header("Access-Control-Allow-Origin"," *"),
            self.send_header("Access-Control-Allow-Methods", "*"),
            self.send_header("Access-Control-Allow-Methods", "PUT, GET,DELETE, POST,OPTIONS"),
            self.send_header("Access-Control-Allow-Headers"," Origin, X-Requested-With, Content-Type, Accept")
            self.end_headers()
            response = BytesIO()
            module = createOrderService.CreateOrderService(requestParam,enviroment["baseUrl"],enviroment["fabricAppId"],enviroment["appSecret"],enviroment["merchantAppId"],enviroment["merchantCode"])
            order = module.createOrder()
            response.write(bytes(order,'utf-8'))
            self.wfile.write(response.getvalue())
            return order
        elif self.path == "/auth/token":
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            self.send_response(200)
            self.send_header("Content-type", "application/json"),
            self.send_header("Access-Control-Allow-Origin"," *"),
            self.send_header("Access-Control-Allow-Methods", "*"),
            self.send_header("Access-Control-Allow-Methods", "PUT, GET,DELETE, POST,OPTIONS"),
            self.send_header("Access-Control-Allow-Headers"," Origin, X-Requested-With, Content-Type, Accept")
            self.end_headers()
            token.applyFabricToken()
            response = BytesIO()
            response.write(b'AUTH TOKEN SERVICE')
            response.write(body)
            self.wfile.write(response.getvalue())
        else:
            self.send_error(404)


print("Server started http://localhost:8080")
httpd = HTTPServer(('localhost', 8080), SimpleHTTPRequestHandler)
httpd.serve_forever()`;
  } else if (name === "C#") {
  } else {
  }
  return Data;
};

export default {
  config,
  fabricToken,
  // authToken,
  createOrder,
  utility,
  app,
};
