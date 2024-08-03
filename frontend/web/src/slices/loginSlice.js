import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/membersApi";

import { getCookie, setCookie, removeCookie } from "../util/cookieUtil";

const initState = {
  memberId: "",
};

export const loginPostAsync = createAsyncThunk("loginPostAsync", (param) => {
  return loginPost(param);
});

//쿠키에서 로그인 정보 로드
const loadMemberCookie = () => {
  const memberInfo = getCookie("member");

  //닉네임 처리
  if (memberInfo && memberInfo.memberId) {
    memberInfo.memberId = decodeURIComponent(memberInfo.memberId);
  }

  return memberInfo;
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
      return { memberId: data.memberId };
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

        if (payload.nickname) {
          payload.nickname = encodeURIComponent(payload.nickname);
        }

        //정상적인 로그인시에만 저장
        if (!payload.error) {
          setCookie("member", JSON.stringify(payload), 1); //1일
        }

        return payload;
      })

      .addCase(loginPostAsync.pending, (state, action) => {
        console.log("pending");
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected");
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
