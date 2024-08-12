import { Axios, loginAxios } from "@/api/http-commons";

const http = Axios();

async function registerUser(data, success, fail) {
  await http.post("/members/register", data).then(success).catch(fail);
}
async function loginApi(id, pw, deviceToken, success, fail) {
  const data = {
    memberId: id,
    password: pw,
    deviceToken: deviceToken
  };
  await http.post("/members/login", data).then(success).catch(fail);
}

async function checkIdDuplication(id, success, fail) {
  const data = {
    memberId: id,
  };
  await http.post(`/members/id-validate`, data).then(success).catch(fail);
}

async function reqVerifyCode(phoneNumber, success, fail) {
  await http
    .post(`/members/phone-verify-code-req`, { phoneNumber: phoneNumber })
    .then(success)
    .catch(fail);
}

async function checkVerifyCode(type, data, success, fail) {
  let typeurl = "";
  if (type === "findid") {
    typeurl = "-id";
  } else if (type === "findpassword") {
    typeurl = "-pw";
  }
  await http
    .post(`/members/phone-verify-code${typeurl}-check`, data)
    .then(success)
    .catch(fail);
}

async function updateUserPwd(type, data, success, fail) {
  switch (type) {
    case "find":
      await http
        .put("/members/password-not-login", data)
        .then(success)
        .catch(fail);
      break;
    case "update":
      const loginHttp = loginAxios();
      await loginHttp.put("/members/password", data).then(success).catch(fail);
  }
}

async function getNFCToken(loginId, success, fail) {
  await http.get(`/members/nfc-token/${loginId}`).then(success).catch(fail);
}
// async function logout(loginId, success, fail) {
//   await http.get(`/members/logout/${loginId}`).then(success).catch(fail);
// }

export {
  registerUser,
  loginApi,
  updateUserPwd,
  checkIdDuplication,
  reqVerifyCode,
  checkVerifyCode,
  getNFCToken
};
