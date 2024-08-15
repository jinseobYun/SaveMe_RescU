import { fcmAxios } from "@/api/http-commons";

const http = fcmAxios();
async function getPushNoti(memberId, success, fail) {
  await http.get(`/push-notification/${memberId}`).then(success).catch(fail);
}

export { getPushNoti }