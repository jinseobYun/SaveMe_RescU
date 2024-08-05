import axios from 'axios';

import { API_SERVER_DOMAIN } from '../config/apiConfig';

const serverHost = `${API_SERVER_DOMAIN}/dispatch-orders`;

export const fetchIncidentListApi = async ({ page = 1, startDate, endDate, createdBy }) => {
  const response = await axios.get(`${serverHost}`, {
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
  const response = await axios.get(`${API_BASE_URL}/dispatch-orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("JWT-AccessToken")}`,
    },
  });
  return response.data;
};
