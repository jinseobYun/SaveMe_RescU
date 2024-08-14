import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getReport, postFirstInfo, putSecondInfo } from "../api/reportApi";

export const getReportAsync = createAsyncThunk(
  "getReportAsync",
  async ({ patientId, reporterId, latitude, longitude }) => {
    return await getReport(patientId, reporterId, latitude, longitude);
  }
);

export const postFirstInfoAsync = createAsyncThunk(
  "postFirstInfoAsync",
  async (param) => {
    console.log(param);
    return await postFirstInfo(param);
  }
);

export const putSecondInfoAsync  = createAsyncThunk(
  "putSecondInfoAsync",
  async (param) => {
    return await putSecondInfo(param);
  }
);

const initState = {
  hospitals:"",
  latitude: "",
  longitude: "",
  reportedTime: "",
  reporterName: "",
  reporterPhone: "",
  rescueTeams: [],
  lotNumberAddress: "",
  roadNameAddress: "",
  taggingMedicalInformation: {
    medicalInformationId: null,
    bloodType1: "",
    bloodType2: "",
    otherInfo: "",
    drugInfos: [""],
    medCdis: [""],
    memberName: "",
    phoneNumber: "",
    birth: "",
    gender:"",
  },
  reporterMedicalInformation: {
    medicalInformationId: null,
    bloodType1: "",
    bloodType2: "",
    otherInfo: "",
    drugInfos: [""],
    medCdis: [""],
    memberName: "",
    phoneNumber: "",
    birth: "",
    gender:"",
  },
  dispatchOrderId: null,
  mappedData: null,
};

const reportSlice = createSlice({
  name: "reportSlice",
  initialState: initState,
  reducers: {
    setDispatchOrderId: (state, action) => {
      state.dispatchOrderId = action.payload;
    },
    setMappedData: (state, action) => {
      state.mappedData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReportAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        return {
          ...state,
          reportData: action.payload,
        };
      })
      .addCase(postFirstInfoAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload.dispatchOrderId) {
          return {
            ...state,
            dispatchOrderId: action.payload.dispatchOrderId,
          };
        }
      })
      .addCase(putSecondInfoAsync.fulfilled, (state, action) => {
        alert(action.payload)
        console.log(action.payload);
      });
  },
});

export const { setDispatchOrderId, setMappedData  } = reportSlice.actions;
export default reportSlice.reducer;
