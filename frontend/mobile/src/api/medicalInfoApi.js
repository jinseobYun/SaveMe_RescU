import { loginAxios } from "@/api/http-commons";

const http = loginAxios();

async function registerMedicalInfo(data, success, fail) {
  await http.post(`/medical-info`, data).then(success).catch(fail);
}

async function getMedicalInfo(success, fail) {
  await http.get(`/medical-info`).then(success).catch(fail);
}

async function updateMedicalInfo(data, success, fail) {
  await http.put(`/medical-info`, data).then(success).catch(fail);
}

async function deleteMedicalInfo(success, fail) {
  await http
    .delete(`/medical-info`)
    .then(success)
    .catch(fail);
}

async function searchMedicine(keyword, success, fail) {
  await http.get(`/search?medicineName=${keyword}`).then(success).catch(fail);
}
export {
  registerMedicalInfo,
  getMedicalInfo,
  updateMedicalInfo,
  deleteMedicalInfo,
  searchMedicine
};
