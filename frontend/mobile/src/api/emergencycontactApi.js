import { loginAxios } from "@/api/http-commons";

const http = loginAxios();

async function registerEmergencycontact(data, success, fail) {
  await http.post(`/emergency-info`, data).then(success).catch(fail);
}

async function getEmergencycontacts(success, fail) {
  await http.get(`/emergency-info`).then(success).catch(fail);
}

async function updateEmergencycontact(emergencyContactId, data, success, fail) {
  await http.put(`/emergency-info/${emergencyContactId}`, data).then(success).catch(fail);
}

async function deleteEmergencycontact(emergencyContactId, success, fail) {
  await http
    .delete(`/emergency-info?emergencyContactId=${emergencyContactId}`)
    .then(success)
    .catch(fail);
}
export {
  registerEmergencycontact,
  getEmergencycontacts,
  updateEmergencycontact,
  deleteEmergencycontact,
};
