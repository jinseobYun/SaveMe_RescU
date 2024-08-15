import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost, updatePassword } from "../api/membersApi";

import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";

const initState = {
  memberId: "",
  accessToken: "",
  refreshToken: "",
};

export const loginPostAsync = createAsyncThunk(
  "loginPostAsync",
  async (param) => {
    return await loginPost(param);
  }
);

// password 요청
export const updatePasswordAsync = createAsyncThunk(
  "updatePasswordAsync",
  async (param) => {
    return await updatePassword(param);
  }
);

//쿠키에서 로그인 정보 로드
const loadMemberCookie = () => {
  const memberInfo = getCookie("member");
  return memberInfo;
};

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState, //쿠키가 없다면 초깃값사용
  reducers: {
    login: (state, action) => {
      //{memberId, pw로 구성 }
      const data = action.payload;

      //새로운 상태
      return {
        memberId: data.memberId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      };
    },
    logout: (state, action) => {
      removeCookie("member");
      return { ...initState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {

        const payload = action.payload;

        setCookie(
          "member",
          JSON.stringify({
            memberId: state.memberId,
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
          }),
          1
        );

        return payload;
      })

      .addCase(loginPostAsync.pending, (state, action) => {
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
      })
      .addCase(updatePasswordAsync.fulfilled, (state, action) => {
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        throw action.error;
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
