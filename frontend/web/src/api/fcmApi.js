import axios from 'axios';
import { API_FCM_HOST } from '../config/apiConfig';

const fcmHost = `${API_FCM_HOST}`;

export const sendEmergencyPush = async (data) => {
  try {
    const response = await axios.post(`${fcmHost}/emergency-push`, data);
    return response.data;
  } catch (error) {
    console.error('Error sending emergency push:', error);
    throw error;
  }
};