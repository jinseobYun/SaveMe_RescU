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
  return memberInfo ? JSON.parse(memberInfo) : null;

  //닉네임 처리 수정전 ★★★★★★★★★★★★★★★★★★
  if (memberInfo && memberInfo.memberId) {
    memberInfo.memberId = decodeURIComponent(memberInfo.memberId);
  }
  return memberInfo;
  // ★★★★★★★★★★★★★★★★★★★★★★★★★
};

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: loadMemberCookie() || initState, //쿠키가 없다면 초깃값사용
  reducers: {
    login: (state, action) => {
      console.log("login.....");
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
      console.log("logout....");
      removeCookie("member");
      return { ...initState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log("fulfilled");

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
        console.log("pending");
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected");
      })
      .addCase(updatePasswordAsync.fulfilled, (state, action) => {
        console.log("비밀번호 변경 성공");
      })
      .addCase(updatePasswordAsync.rejected, (state, action) => {
        console.log("비밀번호 변경 실패");
        throw action.error;
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
