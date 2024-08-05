import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReport, postFirstInfo, postSecondInfo } from "../api/reportApi";

export const getReportAsync = createAsyncThunk(
  "getReportAsync",
  async (memberId) => {
    return await getReport(memberId);
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
  emergencyType: null,
  latitude: "",
  longitude: "",
  reportedTime: "",
  hospitals: [],
  reporterName: "",
  reporterPhone: "",
  reportDetail: "",
  gwanhals: [],
  jibunLocationInfo: "",
  doroLocationInfo: "",
  medicalInformation: {
    memberName: "",
    birth: "",
    phone: "",
    chronicDisease: [],
    bloodType1: "",
    bloodType2: "",
    drugInfos: [],
    otherInfo: ""
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
