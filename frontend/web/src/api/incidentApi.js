import axios from 'axios';

import { API_SERVER_DOMAIN } from '../config/apiConfig';

const serverDispatchHost = `${API_SERVER_DOMAIN}/dispatch-orders`;
const serverHost = `${API_SERVER_DOMAIN}`;

export const fetchIncidentListApi = async ({ page, startDate, endDate, createdBy }) => {
  const response = await axios.get(`${serverHost}/dispatch-orders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
    },
    params: {
      page,
      startDate,
      endDate,
      createdBy,
    },
  });
  return response.data;
};

export const fetchIncidentDetailsApi = async (id) => {
  const response = await axios.get(`${serverHost}/dispatch-orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
    },
  });
  return response.data;
};
