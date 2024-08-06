import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getEmergencyList, getRoute } from "../api/emergencyApi";

export const fetchEmergencyList = createAsyncThunk(
  "fetchEmergencyList",
  async ({ lat, lon }) => {
    const response = await getEmergencyList({ lat, lon });
    // 리스트 호출시 데이터
    console.log("응답요청 :", response);
    return response;
  }
);

export const fetchRoute = createAsyncThunk(
  "fetchRoute",
  async ({ originX, originY, destinationX, destinationY }) => {
    const response = await getRoute({
      originX,
      originY,
      destinationX,
      destinationY,
    });
    // 요소 클릭시 데이터
    console.log(response)
    return response;
  }
);

const emergencySlice = createSlice({
  name: "emergency",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // 항목에서 선택된 병원 항목 저장 필요 
    selectHospital: (state, action) => {
      state.selectedHospital = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmergencyList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmergencyList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEmergencyList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchRoute.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRoute.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.route = action.payload;
      })
      .addCase(fetchRoute.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        console.log("경로탐색 에러 : ",state.error)
      });
  },
});

export const { selectHospital } = emergencySlice.actions;
export default emergencySlice.reducer;
