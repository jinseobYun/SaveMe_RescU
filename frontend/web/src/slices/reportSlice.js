import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReport, postFirstInfo, postSecondInfo } from "../api/reportApi";

export const getReportAsync = createAsyncThunk(
  "getReportAsync",
  async ({ patientId, reporterId, latitude, longitude }) => {
    return await getReport( patientId, reporterId, latitude, longitude );
  }
);

export const postFirstInfoAsync = createAsyncThunk(
  "postFirstInfoAsync",
  async (param) => {
    return await postFirstInfo(param);
  }
);

export const postSecondInfoAsync = createAsyncThunk(
  "postSecondInfoAsync",
  async (param) => {
    return await postSecondInfo(param);
  }
);

const initState = {
  latitude: "",
  longitude: "",
  reportedTime: "",
  reporterName: "",
  reporterPhone: "",
  rescueTeams: [],
  lotNumberAddress: "",
  roadNameAddress: "",
  patientMedicalInformation: {
    medicalInformationId: null,
    bloodType1: "",
    bloodType2: "",
    otherInfo: "",
    drugInfos: [],
    medCdis: [],
    memberName: "",
    phoneNumber: "",
    birth: ""
  },
  reporterMedicalInformation: {
    medicalInformationId: null,
    bloodType1: "",
    bloodType2: "",
    otherInfo: "",
    drugInfos: [],
    medCdis: [],
    memberName: "",
    phoneNumber: "",
    birth: ""
  }
};


const reportSlice = createSlice({
  name: "reportSlice",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReportAsync.fulfilled, (state, action) => {
        console.log(action.payload);

        return action.payload;
      })
      .addCase(postFirstInfoAsync.fulfilled, (state, action) => {
        console.log(action.payload);

        return action.payload;
      })
      .addCase(postSecondInfoAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        return action.payload;
      })
      ;
  },
});

export default reportSlice.reducer;
