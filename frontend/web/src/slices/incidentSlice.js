import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchIncidentListApi,
  fetchIncidentDetailsApi,
} from "../api/incidentApi";

// 초기값 지정
const initialState = {
  list: [],
  details: {
    emergencyType: "",
    reportedTime: "",
    hospital: "",
    reporterName: "",
    reporterPhone: "",
    reportDetails: "",
    firestation: "",
    jibunLocationInfo: "",
    doroLocationInfo: "",
    chronicDisease: [],
    bloodType1: "",
    bloodType2: "",
    drugInfos: [],
    otherInfo: "",
    createdBy: "",
  },
  loading: false,
  error: null,
};

// 전체 리스트 조회
export const fetchIncidentList = createAsyncThunk(
  "fetchIncidentList",
  async (params) => {
    const data = await fetchIncidentListApi(params);
    console.log(data)
    return data;
  }
);

// 상세 정보 조회
export const fetchIncidentDetails = createAsyncThunk(
  "fetchIncidentDetails",
  async (id) => {
    const data = await fetchIncidentDetailsApi(id);
    console.log("상세항목조회 데이터!!",data)
    return data;
  }
);

const incidentSlice = createSlice({
  name: "incident",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIncidentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchIncidentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIncidentDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncidentDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchIncidentDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default incidentSlice.reducer;
